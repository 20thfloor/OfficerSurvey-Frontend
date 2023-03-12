/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { getAPI } from '../../../utils/api'
import { addEmployeeSurveyResponse } from '../../../utils/apiUrls'
import { useParams } from 'react-router-dom'
import { OfficerCard } from '../../Common'
import { Question, QuestionNumber, Res, Answer, File } from './EmployeeFeedbackResponseStyle'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import logo from '../../../assets/logo_officer.png'
import { convertDate } from '../../../utils/helpers'
import OfficerLoader from '../../Common/OfficerLoader/OfficerLoader'
import Rating from '@material-ui/lab/Rating'

const EmployeeFeedbackResponse = () => {
  const { responseId } = useParams()
  const [createdAt, setCreatedAt] = useState()
  const [surveyFetchingSpinner, setSurveyFetchingSpinner] = useState(false)

  const [next, setNext] = useState('')
  const [previous, setPrevious] = useState(null)

  const [info, setinfo] = useState({
    data: [{ questions_response: [] }]
  })

  const pageLimit = 1

  const [query, setQuery] = useState({
    page: 1,
    page_size: pageLimit
  })

  const fetchResponseDetail = async () => {
    setSurveyFetchingSpinner(true)

    const res = await getAPI(`${addEmployeeSurveyResponse}${responseId}`, query)
    const data = res.data.data
    if (!res.isError) {
      setinfo(data)
      setNext(data.links.next)
      setPrevious(data.links.previous)
      setSurveyFetchingSpinner(false)
      if (res.data.data.data.length > 0) {
        setCreatedAt(res.data.data.data[0].created_at)
      }
      return
    } else {
      setSurveyFetchingSpinner(false)
    }
  }

  useEffect(() => {
    fetchResponseDetail()
  }, [query]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleChangePage = newPage => {
    setQuery({
      ...query,
      page: newPage
    })
  }

  const showReviews = () => {
    var List = []

    if (info.data.length > 0) {
      for (var i = 0; i < info.data[0].questions_response.length; i = i + 2) {
        List.push(
          <Grid key={`data-item-empolyee${i}`} container direction="row" justify="space-around" spacing={5}>
            <Grid item xs={12} sm={12} md={6}>
              <OfficerCard mt="0px" mb="0px" shouldFullHeight>
                <div>
                  <Question>
                    <QuestionNumber className="pr-2">Q{i + 1}:</QuestionNumber>
                    {info.data[0].questions_response[i].question.question}
                  </Question>
                  <div>
                    <p className="d-flex">
                      <Res className="pr-2"> Res:</Res>
                      {info.data[0].questions_response[i].question.type === 'Rating' ? (
                        <Rating name="simple-controlled" value={info.data[0].questions_response[i].rating} readOnly />
                      ) : info.data[0].questions_response[i].question.type === 'Checkbox' ? (
                        <Answer>{info.data[0].questions_response[i].check_box_answers}</Answer>
                      ) : info.data[0].questions_response[i].question.type === 'File' ? (
                        <File href={info.data[0].questions_response[i].file} target="_blank">
                          {info.data[0].questions_response[i].file}
                        </File>
                      ) : (
                        <Answer>
                          {info.data[0].questions_response[i].choice
                            ? info.data[0].questions_response[i].choice.choice
                            : info.data[0].questions_response[i].comment_box}
                        </Answer>
                      )}
                    </p>
                    <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                  </div>
                </div>
              </OfficerCard>
            </Grid>

            {info.data[0].questions_response[i + 1] ? (
              <Grid key={`data-item-empolyee${i + 1}`} item xs={12} sm={12} md={6}>
                <OfficerCard mt="0px" mb="0px" shouldFullHeight>
                  <div>
                    <Question>
                      <QuestionNumber className="pr-2">Q{i + 1 + 1}:</QuestionNumber>
                      {info.data[0].questions_response[i + 1].question.question}
                    </Question>
                    <p>
                      <Res className="pr-2"> Res:</Res>
                      {info.data[0].questions_response[i + 1].question.type === 'Rating' ? (
                        <Rating
                          name="simple-controlled"
                          value={info.data[0].questions_response[i + 1].rating}
                          readOnly
                        />
                      ) : info.data[0].questions_response[i + 1].question.type === 'Checkbox' ? (
                        <Answer>{info.data[0].questions_response[i + 1].check_box_answers}</Answer>
                      ) : info.data[0].questions_response[i + 1].question.type === 'File' ? (
                        <File href={info.data[0].questions_response[i + 1].file} target="_blank">
                          {info.data[0].questions_response[i + 1].file}
                        </File>
                      ) : (
                        <Answer>
                          {info.data[0].questions_response[i + 1].choice
                            ? info.data[0].questions_response[i + 1].choice.choice
                            : info.data[0].questions_response[i + 1].comment_box}
                        </Answer>
                      )}
                    </p>
                  </div>
                </OfficerCard>
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={6} />
            )}
          </Grid>
        )
      }
    } else {
      List.push(
        <OfficerCard key={'data-item-empolyee'}>
          <p className="d-flex justify-content-center ">No Feedback To Show</p>
        </OfficerCard>
      )
    }

    return List
  }

  return (
    <>
      <OfficerLoader isFetching={surveyFetchingSpinner}>
        <div className="d-flex justify-content-between">
          <p className="py-3">View All Responses</p>
          {createdAt ? (
            <p>
              Created At:
              {convertDate(createdAt)}
            </p>
          ) : null}
        </div>

        <Grid container direction="column" component="div">
          <Grid item xs={12} sm={12}>
            <div>{showReviews()}</div>
          </Grid>

          {info.total > 0 ? (
            <Grid item xs={12} sm={12}>
              <div className="d-flex justify-content-between pt-3">
                <OfficerButton
                  buttonName="Previous"
                  color="secondary"
                  variant="small"
                  disabled={!previous}
                  click={() => handleChangePage(query.page - 1)}
                />
                <OfficerButton
                  buttonName="Next"
                  color="officer"
                  variant="small"
                  disabled={!next}
                  click={() => handleChangePage(query.page + 1)}
                />
              </div>
            </Grid>
          ) : null}
        </Grid>
        <div className="d-flex pt-5  flex-column justify-content-center align-items-center">
          <p>Powered By</p>
          <img src={logo} alt="officerLogo" width="250x" height="50px" className="logoStyle" />
        </div>
      </OfficerLoader>
    </>
  )
}
export default EmployeeFeedbackResponse
