/* eslint-disable react/jsx-one-expression-per-line */

import React, { useState } from 'react'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerDialog from '../../Common/OfficerDialog'
import { Grid, Switch } from '@material-ui/core'
import { Questionlooks, Required, Choices, CopyText } from './CreateCommunitySurveyStyle'
import Questions from '../../Survey/Questions/Questions'
import { postAPIWrapper } from '../../../utils/api'
import AddChoice from '../../Survey/Questions/AddQuestion/AddChoice/AddChoice'
import { postCommunitySurvey } from '../../../utils/apiUrls'
import { OfficerAutocomplete, OfficerCard, OfficerCopyButton, OfficerInputField } from '../../Common'
import logo from '../../../assets/logo_officer.png'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { validateQueSubmission } from '../../../utils/helpers'
import { QRCodeCanvas } from 'qrcode.react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

const CreateCommunitySurvey = ({ notify }) => {
  CreateCommunitySurvey.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const ID = () => '_' + Math.random().toString(36).substr(2, 9)
  const [submitSpinner, setSubmitSpinner] = useState(false)
  const [openAddQuestion, setOpenAddQue] = useState(false)
  const [openUpdateQue, setOpenUpdateQue] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [selectedUpdateType, setSelectedUpdateType] = useState('')
  const [surveyURL, setSurveyURL] = useState()
  const [showSurveyURL, setShowSUrveyURL] = useState(false)
  const { category } = useParams()

  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    id: ID(),
    type: '',
    required: true,
    choices: [],
    rating: 0,
    file: null
  })
  const [survey, setSurvey] = useState({
    title: '',
    instruction: '',
    questions: [],
    survery_category: category
  })
  const [updateQuestion, setUpdateQuestion] = useState({
    question: '',
    type: '',
    required: true,
    choices: []
  })
  const onChoiceValueChange = (item, value) => {
    setNewQuestionData({
      ...newQuestionData,
      choices: newQuestionData.choices.map(choice => {
        if (choice.id === item.id) {
          choice.choice = value
        }
        return choice
      })
    })
  }

  const onUpdateChoiceValueChange = (item, value) => {
    setUpdateQuestion({
      ...updateQuestion,
      choices: updateQuestion.choices.map(choice => {
        if (choice.id === item.id) {
          choice.choice = value
        }
        return choice
      })
    })
  }

  const onChoicePlaceholderChange = (item, value) => {
    setNewQuestionData({
      ...newQuestionData,
      choices: newQuestionData.choices.map(choice => {
        if (choice.id === item.id) {
          choice.comment_box_place_holder = value
        }
        return choice
      })
    })
  }

  const onUpdateChoicePlaceholderChange = (item, value) => {
    setUpdateQuestion({
      ...updateQuestion,
      choices: updateQuestion.choices.map(choice => {
        if (choice.id === item.id) {
          choice.comment_box_place_holder = value
        }
        return choice
      })
    })
  }

  const onRequiredSwitchChange = (item, checked) => {
    setNewQuestionData({
      ...newQuestionData,
      required: checked
    })
  }

  const onUpdateRequiredSwitchChange = (item, checked) => {
    setUpdateQuestion({
      ...updateQuestion,
      required: checked
    })
  }

  const handleAddChoiceRemove = item => {
    setNewQuestionData({
      ...newQuestionData,
      choices: newQuestionData.choices.filter(choice => choice.id !== item.id)
    })
  }

  const handleUpdateChoiceRemove = item => {
    setUpdateQuestion({
      ...updateQuestion,
      choices: updateQuestion.choices.filter(choice => choice.id !== item.id)
    })
  }

  const handleAddNewChoiceTrue = () => {
    setNewQuestionData({
      ...newQuestionData,
      choices: [
        ...newQuestionData.choices,
        {
          id: ID(),
          choice: '',
          show_comment_box: false,
          comment_box_place_holder: ''
        }
      ]
    })
  }

  const handleUpdateChoiceTrue = () => {
    setUpdateQuestion({
      ...updateQuestion,
      choices: [
        ...updateQuestion.choices,
        {
          id: ID(),
          choice: '',
          show_comment_box: false,
          comment_box_place_holder: ''
        }
      ]
    })
  }

  const typeList = ['Drop Down', 'Multiple Choice', 'Text Area', 'Checkbox', 'Rating']

  const submitUpdateQuestion = () => {
    const updatedQuestions = survey.questions.map(item => (item.id === updateQuestion.id ? updateQuestion : item))
    setSurvey({ ...survey, questions: updatedQuestions })
    handleUpdateClose()
  }

  const submitQuestion = () => {
    setSurvey({ ...survey, questions: [...survey.questions, newQuestionData] })
    handleClose()
  }

  const handleNewQuestionDataChange = event => {
    setNewQuestionData({
      ...newQuestionData,
      question: event.target.value
    })
  }

  const handleUpdateDataChange = event => {
    setUpdateQuestion({
      ...updateQuestion,
      question: event.target.value
    })
  }

  const onTypeChange = value => {
    if (value === 'Text Area' || value === 'Rating' || value === 'File') {
      setNewQuestionData({
        ...newQuestionData,
        type: value,
        choices: []
      })
    } else {
      setNewQuestionData({
        ...newQuestionData,
        type: value,
        choices: [
          {
            id: ID(),
            choice: '',
            show_comment_box: false,
            comment_box_place_holder: ''
          }
        ]
      })
    }
  }
  const onUpdateTypeChange = value => {
    if (value === 'Text Area' || value === 'Rating' || value === 'File') {
      setUpdateQuestion({
        ...updateQuestion,
        type: value,
        choices: []
      })
    } else {
      setUpdateQuestion({
        ...updateQuestion,
        type: value,
        choices: [
          {
            id: ID(),
            choice: '',
            show_comment_box: false,
            comment_box_place_holder: ''
          }
        ]
      })
    }
  }

  const handleOpen = () => {
    setSelectedType('')
    setNewQuestionData({
      ...newQuestionData,
      id: ID(),
      question: '',
      type: '',
      choices: [],
      rating: 0
    })
    setOpenAddQue(true)
  }
  const handleClose = () => {
    setOpenAddQue(false)
  }

  const handleUpdateOpen = () => {
    setOpenUpdateQue(true)
  }
  const handleUpdateClose = () => {
    setOpenUpdateQue(false)
  }

  const update = item => {
    handleUpdateOpen()
    setSelectedUpdateType(item.type)
    setUpdateQuestion(item)
  }
  const deleteQuestion = item => {
    const deleteItem = survey.questions.filter(question => question.id !== item.id)
    setSurvey({ ...survey, questions: deleteItem })
  }

  const submitSurvey = async () => {
    setSubmitSpinner(true)
    const res = await postAPIWrapper(postCommunitySurvey, survey)
    if (!res.isError) {
      setSubmitSpinner(false)
      notify(res.data.data.message, 'success')
      setSurveyURL(res.data.data.data.link)
      setShowSUrveyURL(true)
    } else {
      setSubmitSpinner(false)
      notify(res.error.message, 'error')
    }
  }

  const setDate = event => {
    var date = moment(event.target.value).utc().format('YYYY-MM-DD HH:mm')
    if (date) {
      setSurvey({ ...survey, expire: date })
    }
  }
  const downloadQR = () => {
    const canvas = document.getElementById('123456')
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'qr.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
  return (
    <>
      {showSurveyURL ? (
        <div className="h-100 ">
          <Grid container direction="row" justify="space-around" spacing={5}>
            <Grid item xs={12} sm={12} md={8} spacing={3}>
              <OfficerCard>
                <div className="d-flex bg-light justify-content-center align-items-center  p-3 ">
                  <div className="pt-2 pr-5">
                    {process.env.REACT_APP_DEPLOYED_LINK}
                    /community-survey-by-link/
                    {surveyURL}
                  </div>
                  <div className="pl-5">
                    <OfficerCopyButton
                      text={`${process.env.REACT_APP_DEPLOYED_LINK}/community-survey-by-link/${surveyURL}`}
                      notify={notify}
                      color
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <div className="p-4">
                    <QRCodeCanvas
                      value={`${process.env.REACT_APP_DEPLOYED_LINK}/community-survey-by-link/${surveyURL}`}
                      id="123456"
                    />
                  </div>
                  <div>
                    <OfficerButton
                      buttonName="Download QR"
                      color="secondary"
                      align="right"
                      variant="medium"
                      click={downloadQR}
                    />
                  </div>
                </div>
                <CopyText className="pt-5 pb-3">
                  Copy and paste the generated link with your community anywhere, in an email, text it, or share it by
                  other means.
                </CopyText>
              </OfficerCard>
            </Grid>
          </Grid>
        </div>
      ) : (
        <>
          <p>Community Feedback</p>
          <OfficerInputField
            placeholder="Enter Survey Title"
            id="title"
            name="title"
            value={survey.title}
            onChange={event => setSurvey({ ...survey, title: event.target.value })}
            label="Enter Survey Title"
          />
          <OfficerInputField
            placeholder="Enter Survey Instructions"
            id="instructions"
            name="instruction"
            value={survey.instruction}
            onChange={event => setSurvey({ ...survey, instruction: event.target.value })}
            label="Enter Survey Instructions"
          />
          <div className="pt-3">
            <OfficerButton
              buttonName="Add Question"
              color="secondary"
              align="right"
              variant="medium"
              click={handleOpen}
            />
          </div>

          {survey.questions.map((item, count) => {
            return (
              <div key={`survey-questions${count + 2}`}>
                <Questions item={item} count={count + 1} />
                <div className="pb-3 d-flex justify-content-end">
                  <OfficerButton buttonName="Update" color="secondary" variant="small" click={() => update(item)} />
                  <div className="px-3">
                    <OfficerButton
                      buttonName="Delete"
                      color="danger"
                      variant="small"
                      click={() => deleteQuestion(item)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
          <div>
            <form noValidate className="d-flex justify-content-end py-3">
              <TextField
                id="datetime-local"
                label="Expiry Date"
                type="datetime-local"
                name="expire"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={setDate}
              />
            </form>
          </div>
          <div className="pt-3">
            <OfficerButton
              buttonName="Create Survey"
              color="officer"
              align="right"
              variant="medium"
              showSpinnerProp={submitSpinner}
              disabled={survey.questions.length === 0 ? true : false}
              click={submitSurvey}
            />
          </div>
        </>
      )}

      <div className="d-flex  flex-column justify-content-center align-items-center">
        <p>Powered By</p>
        <img src={logo} alt="officerLogo" width="250x" height="100px" className="logoStyle" />
      </div>

      <OfficerDialog
        open={openAddQuestion}
        fullWidth
        maxWidth={'md'}
        title="Add Question"
        onClose={handleClose}
        actions={
          <div className="pb-3 d-flex">
            <OfficerButton
              buttonName="Save Question"
              color="secondary"
              variant="medium"
              click={submitQuestion}
              disabled={!validateQueSubmission(newQuestionData)}
              align="right"
            />
            <div className="px-3">
              <OfficerButton buttonName="Cancel" color="danger" variant="small" align="right" click={handleClose} />
            </div>
          </div>
        }
        content={
          <>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <OfficerInputField
                  placeholder="Enter Question"
                  id="Enter Question"
                  required
                  type="text"
                  label="Enter Question"
                  name="question"
                  value={newQuestionData.question}
                  onChange={handleNewQuestionDataChange}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <div className="d-flex  align-items-center">
                  <Required>Required: </Required>
                  <Switch
                    onChange={onRequiredSwitchChange}
                    checked={newQuestionData.required}
                    color="primary"
                    name="checked"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <OfficerAutocomplete
                  id="combo-box-community-create-type"
                  options={typeList}
                  placeholder="Select Type"
                  required
                  type="text"
                  label="Select Type"
                  idTextField="Select Type"
                  name="type"
                  onChange={(event, newValue) => {
                    if (newValue !== undefined) {
                      onTypeChange(newValue)
                      return newValue != null ? setSelectedType(newValue) : ''
                    }
                  }}
                  getOptionLabel={option => (option ? option : '')}
                  getOptionSelected={(option, value) => {
                    if (value === '') {
                      return true
                    } else if (value === option) {
                      return true
                    }
                  }}
                />
              </Grid>
            </Grid>

            {selectedType === 'Drop Down' ||
            selectedType === 'Multiple Choice' ||
            selectedType === 'Checkbox' ||
            selectedType === 'Poll' ||
            selectedType === 'Vote' ? (
              <>
                <OfficerButton
                  buttonName="Add Choice"
                  color="primary"
                  variant="medium"
                  click={handleAddNewChoiceTrue}
                  align="right"
                />

                <div className="mb-3">
                  <Choices>Choices</Choices>
                </div>
              </>
            ) : (
              ''
            )}

            {newQuestionData.choices.map((choice, index) => (
              <Grid key={`new-Question-data${index + 2}`} item sm={12}>
                <AddChoice
                  value={choice.choice}
                  onChangeChoice={event => onChoiceValueChange(choice, event.target.value)}
                  hideSwitch
                  onChangePlaceholder={event => onChoicePlaceholderChange(choice, event.target.value)}
                  onRemoveChoice={() => handleAddChoiceRemove(choice)}
                />
              </Grid>
            ))}
            <Questionlooks className="pt-5">This is How Question Will Look Like :</Questionlooks>
            <Questions item={newQuestionData} count={1} id={'employee-survey-question'} />
          </>
        }
      />

      <OfficerDialog
        open={openUpdateQue}
        title="Update Question"
        fullWidth
        maxWidth={'md'}
        onClose={handleUpdateClose}
        actions={
          <div className="pb-3 d-flex">
            <OfficerButton
              buttonName="Update Question"
              color="secondary"
              variant="medium"
              click={submitUpdateQuestion}
              disabled={!validateQueSubmission(updateQuestion)}
              align="right"
            />
            <div className="px-3">
              <OfficerButton
                buttonName="Cancel"
                color="danger"
                variant="small"
                align="right"
                click={handleUpdateClose}
              />
            </div>
          </div>
        }
        content={
          <>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <OfficerInputField
                  placeholder="Enter Question"
                  id="Enter Question"
                  required
                  type="text"
                  label="Enter Question"
                  name="question"
                  onChange={handleUpdateDataChange}
                  value={updateQuestion.question}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <div className="d-flex  align-items-center">
                  <Required>Required: </Required>
                  <Switch
                    onChange={onUpdateRequiredSwitchChange}
                    checked={updateQuestion.required}
                    color="primary"
                    name="checked"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <OfficerAutocomplete
                  id="combo-box-community-create-type"
                  options={typeList}
                  placeholder="Select Type"
                  required
                  type="text"
                  disabled
                  value={updateQuestion.type}
                  label="Select Type"
                  idTextField="Select Type"
                  name="type"
                  onChange={(event, newValue) => {
                    if (newValue !== undefined) {
                      onUpdateTypeChange(newValue)
                      return newValue != null ? setSelectedUpdateType(newValue) : ''
                    }
                  }}
                  getOptionLabel={option => (option ? option : '')}
                  getOptionSelected={(option, value) => {
                    if (value === '') {
                      return true
                    } else if (value === option) {
                      return true
                    }
                  }}
                />
              </Grid>
            </Grid>

            {selectedUpdateType === 'Drop Down' ||
            selectedUpdateType === 'Multiple Choice' ||
            selectedUpdateType === 'Checkbox' ||
            selectedUpdateType === 'Poll' ||
            selectedUpdateType === 'Vote' ? (
              <>
                <OfficerButton
                  buttonName="Add Choice"
                  color="primary"
                  variant="medium"
                  click={handleUpdateChoiceTrue}
                  align="right"
                />

                <div className="mb-3">
                  <Choices>Choices</Choices>
                </div>
              </>
            ) : (
              ''
            )}

            {updateQuestion.choices.map((choice, index) => (
              <Grid key={`update-Question-data${index + 2}`} item sm={12}>
                <AddChoice
                  value={choice.choice}
                  onChangeChoice={event => onUpdateChoiceValueChange(choice, event.target.value)}
                  hideSwitch
                  onChangePlaceholder={event => onUpdateChoicePlaceholderChange(choice, event.target.value)}
                  onRemoveChoice={() => handleUpdateChoiceRemove(choice)}
                />
              </Grid>
            ))}
            <Questionlooks className="pt-5">This is How Question Will Look Like :</Questionlooks>
            <Questions item={updateQuestion} count={1} id={'community-survey-question-update'} />
          </>
        }
      />
    </>
  )
}
export default CreateCommunitySurvey
