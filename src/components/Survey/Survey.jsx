/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Grid, Box } from '@material-ui/core'
import OfficerButton from '../Common/OfficerButton/OfficerButton'
import { getAPI, deleteAPIWrapper, putAPIWrapper } from '../../utils/api'
import Questions from './Questions'
import { useHistory } from 'react-router-dom'
import OfficerLoader from '../Common/OfficerLoader'
import { surveyUrl, deleteQuestionUrl } from '../../utils/apiUrls'
import OfficerDialog from '../Common/OfficerDialog'
import { OfficerCard, OfficerInputField } from '../Common'
import { SurveyHeading, SurveyText, Heading } from './SurveyStyle'
import PropTypes from 'prop-types'

const OfficerSurvey = props => {
  OfficerSurvey.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [survey, setSurvey] = useState({ questions: [] })
  const [fetchingSurvey, setFetchingSurvey] = useState(false)
  const [showSpinner, setshowSpinner] = useState(false)
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState()
  const [openUpdate, setOpenUpdate] = useState(false)
  const [aboutData, setAboutData] = useState()

  const fetchSurveyQuestionsAPI = async () => {
    setFetchingSurvey(true)
    const response = await getAPI(surveyUrl)
    const data = response.data.data.data
    if (!response.isError) {
      setFetchingSurvey(false)
      setSurvey(data)
      setAboutData(data.about)
    }
  }
  const onClickDeleteQuestion = async () => {
    setshowSpinner(true)
    const res = await deleteAPIWrapper(`${deleteQuestionUrl}${currentQuestion.id}/`)
    if (!res.isError) {
      const updatedQuestions = survey.questions.filter(question => question.id !== currentQuestion.id)
      setSurvey({ ...survey, questions: updatedQuestions })
      setshowSpinner(false)
      setOpenDeleteQuestion(false)
      props.notify(res.data.data.message, 'success')
    } else props.notify(res.error.message, 'error')
  }
  const onClickUpdateSurvey = async () => {
    setshowSpinner(true)
    const res = await putAPIWrapper(`/${surveyUrl}`, {
      about: aboutData
    })
    if (!res.isError) {
      setshowSpinner(false)
      setOpenUpdate(false)
      props.notify(res.data.data.message, 'success')
    } else props.notify(res.error.message, 'error')
  }
  const handleOpenDeleteQuestion = item => {
    setCurrentQuestion(item)
    setOpenDeleteQuestion(true)
  }
  const handleCloseDeleteQuestion = () => {
    setOpenDeleteQuestion(false)
  }

  const handleOpenUpdate = () => {
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }

  useEffect(() => {
    fetchSurveyQuestionsAPI()
  }, [])

  const history = useHistory()
  const handleAddQuestion = () => {
    history.push('/add-question')
  }

  const handleUpdateQuestion = id => {
    history.push(`update-question/${id}`)
  }

  const openHeader = () => {
    history.push('./upload-header')
  }

  const rearrange = () => {
    history.push('./survey-rearrange')
  }

  return (
    <>

      <Grid container>
        <OfficerLoader isFetching={fetchingSurvey}>
          <SurveyHeading>{survey.name}</SurveyHeading>

          <OfficerCard>
            <Grid container direction="row" justify="space-around" spacing={5}>
              <Grid container item xs={12} sm={12} md={6} spacing={3}>
                <SurveyText>{aboutData}</SurveyText>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className="d-flex justify-content-around">
                  <OfficerButton buttonName="Add Question" color="primary" variant="medium" click={handleAddQuestion} />
                  <OfficerButton
                    buttonName="Instructions"
                    color="secondary"
                    variant="medium"
                    click={handleOpenUpdate}
                    align="right"
                  />

                  <OfficerButton buttonName="Update Cover Page" color="secondary" variant="large" click={openHeader} />
                </div>
              </Grid>
            </Grid>
          </OfficerCard>

          <div className=" w-100">
            <OfficerButton
              buttonName="Rearrange Questions"
              color="officer"
              variant="large"
              align="right"
              click={rearrange}
            />
          </div>

          <Grid container item display="flex" sm={12} xs={12} direction="row">
            <div className="survay_qs pt-3 w-100">
              {survey.questions.map((item, count) => (
                <Box key={item.id}>
                  <Grid item>
                    <Questions id={`survey-question${count + 2}`} item={item} count={count + 1} />
                  </Grid>

                  <Box display="flex" marginBottom={3} marginTop={3} justifyContent="flex-end">
                    <Box display="flex" height="40px" marginRight={1}>
                      <OfficerButton
                        buttonName="Update Question"
                        color="primary"
                        variant="medium"
                        click={() => handleUpdateQuestion(item.id)}
                      />
                    </Box>
                    <Box display="flex" height="40px" marginRight={1}>
                      <OfficerButton
                        buttonName="Delete Question"
                        color="danger"
                        variant="medium"
                        click={() => handleOpenDeleteQuestion(item)}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </div>
          </Grid>
        </OfficerLoader>
      </Grid>
      <OfficerDialog
        open={openDeleteQuestion}
        onClose={handleCloseDeleteQuestion}
        actions={
          <>
            <div className="pb-3 d-flex">
              <OfficerButton
                buttonName="Yes"
                color="secondary"
                variant="small"
                click={onClickDeleteQuestion}
                showSpinnerProp={showSpinner}
              />
              <div className="px-3">
                <OfficerButton buttonName="No" color="danger" variant="small" click={handleCloseDeleteQuestion} />
              </div>
            </div>
          </>
        }
        content={
          <>
            <Heading>Delete Question</Heading>
            <p className="d-flex justify-content-center">Do you want to delete this Question ?</p>
          </>
        }
      />
      <OfficerDialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        fullWidth
        maxWidth={'md'}
        actions={
          <>
            <div className="pb-3 d-flex">
              <OfficerButton
                buttonName="Update"
                color="secondary"
                variant="small"
                click={onClickUpdateSurvey}
                showSpinnerProp={showSpinner}
              />
              <div className="px-3">
                <OfficerButton buttonName="Cancel" color="danger" variant="small" s click={handleCloseUpdate} />
              </div>
            </div>
          </>
        }
        content={
          <>
            <Heading>Update Survey</Heading>
            <OfficerInputField
              label="Survey Information"
              id="Survey About Data"
              color="primary"
              name="about"
              value={aboutData}
              onChange={event => setAboutData(event.target.value)}
              multiline
            />
          </>
        }
      />
    </>
  )
}
export default OfficerSurvey
