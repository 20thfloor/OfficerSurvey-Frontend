/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react'
import { getAPIWithoutAuth, postAPIWithoutAuth } from '../../../utils/api'
import { setCommunityUrlList, getCommunityUrlList } from '../../../utils/localStorage'
import { getCommunitySurveyByLink, addCommunitySurveyResponse } from '../../../utils/apiUrls'
import { useParams, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  DataInstruction,
  QuestionDiv,
  ExpireMessage,
  Image,
  Thankyou,
  SuccessMessage
} from './CommunitySurveyByLinkStyle'
import { Box, Grid } from '@material-ui/core'
import { OfficerCard, OfficerCopyButton } from '../../Common'
import Questions from '../../Survey/Questions'
import OfficerButton from '../../Common/OfficerButton'
import logo from '../../../assets/logo_officer.png'
import thumbsup from '../../../assets/thumbsup.svg'
import facebook from '../../../assets/facebook.svg'
import twitter from '../../../assets/twit.svg'
import instagram from '../../../assets/instagram.svg'
import nextdoor from '../../../assets/Nextdoor.svg'
import { validateSurvey } from '../../../utils/helpers'
import './style.css'
import OfficerBarGraph from '../../OfficerBarGraph'
import OfficerLoader from '../../Common/OfficerLoader/OfficerLoader'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import moment from 'moment'

const CommunitySurveyByLink = props => {
  CommunitySurveyByLink.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const [info, setinfo] = useState(null)
  const { link } = useParams()
  const location = useLocation()
  const [rawQuestionResponse, setRawQuestionResponse] = useState({})
  const [questionIds, setQuestionIds] = useState({})
  const [showSpinner, setShowSpinner] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [expiryDateMessage, setExpiryDateMessage] = useState(false)
  const [surveyFetchingSpinner, setSurveyFetchingSpinner] = useState(false)

  const [survey, setSurvey] = useState({
    questions: [{ choices: [] }]
  })
  const [surveyData, setSurveyData] = useState({
    survey: '',
    questions: []
  })

  const handleCheckboxData = (question, choice, text) => {
    const arr = rawQuestionResponse[question.id].choices.filter(item => item !== choice.id)
    if (arr.length === 0) {
      const obj = rawQuestionResponse
      delete obj[question.id]
      setRawQuestionResponse({ ...obj })
    } else
      setRawQuestionResponse({
        ...rawQuestionResponse,
        [question.id]: {
          question: question.id,
          choice: null,
          text: text,
          choices: [...arr],
          file: null
        }
      })
  }

  const handleQuestionData = (question, choice, text, rating, file) => {
    if (question.type === 'Checkbox') {
      let arr = []
      if (rawQuestionResponse[question.id]) arr = rawQuestionResponse[question.id].choices

      setRawQuestionResponse({
        ...rawQuestionResponse,
        [question.id]: {
          question: question.id,
          choice: null,
          text: text,
          choices: [...arr, choice.id],
          file: null
        }
      })
    } else {
      setRawQuestionResponse({
        ...rawQuestionResponse,
        [question.id]: {
          question: question.id,
          choice: choice ? choice.id : null,
          text: text,
          rating: rating,
          file: file
        }
      })
    }
    setQuestionIds({
      ...questionIds,
      [question.id]: {
        status: true
      }
    })
  }

  const fetchSurveyData = async () => {
    setSurveyFetchingSpinner(true)
    const response = await getAPIWithoutAuth(`${getCommunitySurveyByLink}${link}`, {
      date: moment().utc().format('MM-DD-YYYY HH:mm a')
    })

    if (!response.isError) {
      setExpiryDateMessage(false)
      setSurveyFetchingSpinner(false)

      setSurvey(response.data.data.data)
      setSurveyData({
        ...surveyData,
        survey: response.data.data.data.id
      })
    } else {
      setExpiryDateMessage(true)
      setSurveyFetchingSpinner(false)
    }
  }
  useEffect(() => {
    fetchSurveyData()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = event => {
    event.preventDefault()
    submitSurvey()
  }

  const submitSurvey = async () => {
    const array = []
    for (const key in rawQuestionResponse) {
      array.push(rawQuestionResponse[key])
    }
    const data = {
      survey: surveyData.survey,
      questions: array
    }
    setShowSpinner(true)
    const response = await postAPIWithoutAuth(addCommunitySurveyResponse, data)
    if (!response.isError) {
      setShowSpinner(false)
      setShowMessage(true)
      await setCommunityUrlList(link)
    } else {
      setShowSpinner(false)
      props.notify(response.error.message, 'error')
      setShowSpinner(false)
    }
  }
  useEffect(() => {
    getUrls()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  const getUrls = async () => {
    const UrlList = await getCommunityUrlList()
    if (UrlList.some(item => link.includes(item))) {
      setShowMessage(true)
    }
  }

  const submitPoll = async (question, choice, text) => {
    const data = {
      survey: surveyData.survey,
      questions: [{ question: question.id, choice: choice.id, text: text }]
    }
    setShowSpinner(true)
    const response = await postAPIWithoutAuth(addCommunitySurveyResponse, data)
    if (!response.isError) {
      setinfo(response.data.data.data.questions[0])
      setShowSpinner(false)
      setShowMessage(true)
      await setCommunityUrlList(link)
    } else {
      setShowSpinner(false)
      props.notify(response.error.message, 'error')
    }
  }

  const showGraph = () => {
    const choices = info.choices.map(item => ((item.count / info.count) * 100).toFixed(2))
    const res = info.choices.map(item => item.choice)

    return <OfficerBarGraph yaxisList={res} xaxisList={choices} />
  }

  return (
    <>
      {expiryDateMessage ? (
        <>
          <ExpireMessage className=" d-flex justify-content-center  align-items-center">
            Provided suvery is expired now
          </ExpireMessage>
          <div className="d-flex  flex-column justify-content-center align-items-center">
            <p>Powered By</p>
            <img src={logo} alt="officerLogo" width="250x" height="50px" className="logoStyle" />
          </div>
        </>
      ) : showMessage ? (
        <>
          <div className="d-flex  flex-column justify-content-center align-items-center vh-100 ">
            {survey.type !== 'Poll' ? <Image src={thumbsup} width={'124'} height={'124'} /> : null}
            {survey.type !== 'Poll' ? (
              <div className="thankyouText">Thank you for your time and your feedback!</div>
            ) : (
              <Thankyou className="pt-5">THANK YOU!</Thankyou>
            )}
            {survey.type !== 'Poll' ? (
              <h5 className="pb-3 text-center pt-3 shareStyle">Share this survey to help us get more responses.</h5>
            ) : null}
            {survey.type !== 'Poll' ? <div className="shareSurveyStyle">Share The Survey</div> : null}
            {survey.type !== 'Poll' ? (
              <>
                <div className="d-flex bg-light pt-4 pb-4 pl-1 justify-content-center  align-items-center mt-3 copyLinkStyle">
                  <b className="pt-2  text-primary ">
                    {process.env.REACT_APP_DEPLOYED_LINK}
                    {location.pathname}
                  </b>
                  <div className="pt-2 ">
                    <OfficerCopyButton
                      text={`${process.env.REACT_APP_DEPLOYED_LINK}
                      ${location.pathname}`}
                      notify={'Copied'}
                    />
                  </div>
                </div>
                <div className="d-flex p-5">
                  <FacebookShareButton
                    url={`${process.env.REACT_APP_DEPLOYED_LINK}${location.pathname}`}
                    className="Demo__some-network__share-button">
                    <img src={facebook} alt="facebook" width="34x" height="24px" className="socialIconStyle" />
                  </FacebookShareButton>
                  <div>
                    <TwitterShareButton
                      title={'test'}
                      url={`${process.env.REACT_APP_DEPLOYED_LINK}${location.pathname}`}
                      hashtags={['hashtag1', 'hashtag2']}>
                      <img src={twitter} alt="twitter" width="34x" height="24px" className="socialIconStyle" />
                    </TwitterShareButton>
                  </div>
                  <div>
                    <a href="https://www.instagram.com/">
                      <img src={instagram} alt="instagram" width="34x" height="24px" className="socialIconStyle" />
                    </a>
                  </div>
                  <div>
                    <a href="https://nextdoor.com/">
                      <img src={nextdoor} alt="nextdoor" width="34x" height="24px" className="socialIconStyle" />
                    </a>
                  </div>
                </div>
                <div>
                  <img src={logo} alt="officerLogo" width="342x" height="70px" className="logoStyle" />
                </div>
              </>
            ) : null}
            {info ? <div className=" d-flex justify-content-center  align-items-center">{showGraph()}</div> : null}
            {info ? (
              <p className="d-flex justify-content-center  align-items-center">
                {/* eslint-disable-next-line no-console */}
                <strong>Total Responses</strong>:{info.count}
              </p>
            ) : null}
            {survey.type === 'Poll' ? (
              <SuccessMessage className=" d-flex justify-content-center  align-items-center w-100">
                YOUR FEEDBACK HAS BEEN RECEIVED.
              </SuccessMessage>
            ) : (
              ''
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <OfficerLoader isFetching={surveyFetchingSpinner}>
            <Box m={3} className=" d-flex  align-items-center flex-column">
              <div className="dataStyle">{survey.title}</div>
              <DataInstruction>{survey.instruction}</DataInstruction>
            </Box>
            <OfficerCard>
              {survey.questions.map((item, count) => (
                <QuestionDiv key={`community-div${item.id}`}>
                  <Grid key={item.id}>
                    <Questions
                      item={item}
                      count={count + 1}
                      handleQuestionData={handleQuestionData}
                      rawQuestionResponse={rawQuestionResponse}
                      submitPoll={submitPoll}
                      handleCheckboxData={handleCheckboxData}
                    />
                  </Grid>
                </QuestionDiv>
              ))}

              {survey.type !== 'Poll' ? (
                <>
                  <div className="laptopView">
                    <Grid item xs={12} sm={12}>
                      <Box mt={3}>
                        <OfficerButton
                          type="submit"
                          buttonName="Submit Feedback"
                          color="officer"
                          variant="large"
                          align="right"
                          disabled={!validateSurvey(survey, rawQuestionResponse)}
                          showSpinnerProp={showSpinner}
                        />
                      </Box>
                    </Grid>
                  </div>

                  <div className="mobileView">
                    <Grid item xs={12} sm={12}>
                      <Box mt={3}>
                        <OfficerButton
                          type="submit"
                          buttonName="Submit Feedback"
                          color="officer"
                          variant="large"
                          align="center"
                          disabled={!validateSurvey(survey, rawQuestionResponse)}
                          showSpinnerProp={showSpinner}
                        />
                      </Box>
                    </Grid>
                  </div>
                </>
              ) : null}
            </OfficerCard>
            <div className="d-flex  flex-column justify-content-center align-items-center">
              <p>Powered By</p>
              <img src={logo} alt="officerLogo" width="250x" height="100px" className="logoStyle" />
            </div>
          </OfficerLoader>
        </form>
      )}
    </>
  )
}
export default CommunitySurveyByLink
