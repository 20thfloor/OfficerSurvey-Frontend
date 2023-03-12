/* eslint-disable react/jsx-one-expression-per-line */

import React, { useState } from 'react'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { Grid } from '@material-ui/core'
import { Questionlooks, Choices, CopyText } from './CreatePoleStyle'
import Questions from '../../Survey/Questions/Questions'
import { postAPIWrapper } from '../../../utils/api'
import AddChoice from '../../Survey/Questions/AddQuestion/AddChoice/AddChoice'
import { postSurvey } from '../../../utils/apiUrls'
import { OfficerCard, OfficerCopyButton, OfficerInputField } from '../../Common'
import logo from '../../../assets/logo_officer.png'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { validateQueSubmission } from '../../../utils/helpers'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

const CreatePole = ({ notify }) => {
  CreatePole.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const ID = () => '_' + Math.random().toString(36).substr(2, 9)
  const [showSurveyURL, setShowSUrveyURL] = useState(false)
  const [surveyURL, setSurveyURL] = useState()
  const { category } = useParams()

  const [submitSpinner, setSubmitSpinner] = useState(false)
  const [survey, setSurvey] = useState({
    title: '',
    instruction: '',
    type: 'Poll',
    questions: [{ question: '', type: 'Poll', required: true, choices: [] }],
    survery_category: category
  })

  const setDate = event => {
    var date = moment(event.target.value).utc().format('YYYY-MM-DD HH:mm')
    if (date) {
      setSurvey({ ...survey, expire: date })
    }
  }

  const handleNewQuestionDataChange = event => {
    setSurvey({
      ...survey,
      questions: [{ ...survey.questions[0], question: event.target.value }]
    })
  }

  const handleAddNewChoiceTrue = () => {
    setSurvey({
      ...survey,
      questions: [
        {
          ...survey.questions[0],
          choices: [
            ...survey.questions[0].choices,
            {
              id: ID(),
              choice: '',
              show_comment_box: false,
              comment_box_place_holder: ''
            }
          ]
        }
      ]
    })
  }

  const onChoiceValueChange = (item, value) => {
    setSurvey({
      ...survey,
      questions: [
        {
          ...survey.questions[0],
          choices: survey.questions[0].choices.map(choice => {
            if (choice.id === item.id) {
              choice.choice = value
            }
            return choice
          })
        }
      ]
    })
  }

  const handleAddChoiceRemove = item => {
    setSurvey({
      ...survey,
      questions: [
        {
          ...survey.questions[0],
          choices: survey.questions[0].choices.filter(choice => choice.id !== item.id)
        }
      ]
    })
  }

  const submitPole = async () => {
    setSubmitSpinner(true)
    const res = await postAPIWrapper(postSurvey, survey)
    if (!res.isError) {
      setSubmitSpinner(false)
      setShowSUrveyURL(true)
      setSurveyURL(res.data.data.data.link)

      notify(res.data.data.message, 'success')
    } else {
      setSubmitSpinner(false)
      notify(res.error.message, 'error')
    }
  }

  return (
    <>
      {showSurveyURL ? (
        <div className="h-100 ">
          <Grid container direction="row" justify="space-around" spacing={5}>
            <Grid item xs={12} sm={12} md={8} spacing={3}>
              <OfficerCard>
                <div className="d-flex justify-content-around">
                  <b className="pt-2">
                    {process.env.REACT_APP_DEPLOYED_LINK}
                    /employee-survey-by-link/
                    {surveyURL}
                  </b>

                  <OfficerCopyButton
                    text={`${process.env.REACT_APP_DEPLOYED_LINK}/employee-survey-by-link/${surveyURL}`}
                    notify={notify}
                  />
                </div>
                <CopyText className="pt-5 pb-3">
                  Copy and paste the generated link with your employees anywhere, in an email, text it, or share it by
                  other means.
                </CopyText>
              </OfficerCard>
            </Grid>
          </Grid>
        </div>
      ) : (
        <>
          <p>Create a Poll</p>
          <OfficerInputField
            placeholder="Enter Poll Title"
            id="title"
            name="title"
            value={survey.title}
            onChange={event => setSurvey({ ...survey, title: event.target.value })}
            label="Enter Poll Title"
          />
          <OfficerInputField
            placeholder="Enter Poll Instructions"
            id="instructions"
            name="instruction"
            value={survey.instruction}
            onChange={event => setSurvey({ ...survey, instruction: event.target.value })}
            label="Enter Poll Instructions"
          />

          <Grid container spacing={3}>
            <Grid item sm={12}>
              <OfficerInputField
                placeholder="Enter Poll Question"
                id="Enter Question"
                required
                type="text"
                label="Enter Poll Question"
                name="question"
                value={survey.questions[0].question}
                onChange={handleNewQuestionDataChange}
              />
            </Grid>
          </Grid>

          <div className="my-3">
            <OfficerButton
              buttonName="Add Choice"
              color="primary"
              variant="medium"
              click={handleAddNewChoiceTrue}
              align="right"
            />
          </div>

          <div className="mb-3">
            <Choices>Choices</Choices>
          </div>

          {survey.questions[0].choices.map(choice => (
            <Grid key="item" item sm={12}>
              <AddChoice
                value={choice.choice}
                onChangeChoice={event => onChoiceValueChange(choice, event.target.value)}
                hideSwitch
                onRemoveChoice={() => handleAddChoiceRemove(choice)}
              />
            </Grid>
          ))}
          <Questionlooks className="pt-5">This is How Question Will Look Like :</Questionlooks>
          <Questions item={survey.questions[0]} count={1} />

          <div>
            <form noValidate className="d-flex justify-content-end py-3">
              <TextField
                id="datetime-local"
                label="Expiry Date"
                type="datetime-local"
                name="expire"
                // max={moment().format("YYYY-MM-DD[T]HH:mm")}
                // minDate={"2021-04-23T12:45"}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={setDate}
              />
            </form>
          </div>
          <div className="pt-3">
            <OfficerButton
              buttonName="Create Poll"
              color="officer"
              align="right"
              variant="medium"
              showSpinnerProp={submitSpinner}
              click={submitPole}
              disabled={!validateQueSubmission(survey.questions[0])}
            />
          </div>
        </>
      )}

      <div className="d-flex  flex-column justify-content-center align-items-center">
        <p>Powered By</p>
        <img src={logo} alt="officerLogo" width="250x" height="100px" className="logoStyle" />
      </div>
    </>
  )
}
export default CreatePole
