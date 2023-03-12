import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getSurvey, updateEmployeeSurvey } from '../../../utils/apiUrls'
import { getAPI, putAPIWrapper } from '../../../utils/api'
import Questions from '../../Survey/Questions/Questions'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerDialog from '../../Common/OfficerDialog'
import { Grid, Switch } from '@material-ui/core'
import AddChoice from '../../Survey/Questions/AddQuestion/AddChoice/AddChoice'
import { Questionlooks, Required, Choices } from './EditEmployeeSurveyStyle'
import { OfficerAutocomplete, OfficerInputField } from '../../Common'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import logo from '../../../assets/logo_officer.png'
import OfficerLoader from '../../Common/OfficerLoader/OfficerLoader'
import { validateQueSubmission } from '../../../utils/helpers'
import PropTypes from 'prop-types'

const EditEmployeeSurvey = props => {
  EditEmployeeSurvey.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const history = useHistory()
  const { surveyId } = useParams()
  const pageLimit = 1
  const [query] = useState({
    page: 1,
    page_size: pageLimit
  })
  const ID = () => '_' + Math.random().toString(36).substr(2, 9)
  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    id: ID(),
    type: '',
    required: true,
    choices: [],
    rating: 0
  })

  const [surveyFetchingSpinner, setSurveyFetchingSpinner] = useState(false)
  const [selectedUpdateType, setSelectedUpdateType] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)
  const [openUpdateFeedback, setOpenUpdateFeedback] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [survey, setSurvey] = useState({
    delete_questions: [],
    expire: '',
    questions: []
  })
  const [updateQuestion, setUpdateQuestion] = useState({
    question: '',
    type: '',
    required: true,
    choices: [],
    delete_choices: []
  })

  const fetchSurvey = async () => {
    setSurveyFetchingSpinner(true)
    const response = await getAPI(`${getSurvey} ${surveyId}`, query)
    if (!response.isError) {
      setSurveyFetchingSpinner(false)
      setSurvey({ ...survey, ...response.data.data.data })
      return
    } else {
      setSurveyFetchingSpinner(false)
    }
  }

  useEffect(() => {
    fetchSurvey()
  }, [query]) //eslint-disable-line react-hooks/exhaustive-deps

  const deleteQuestion = item => {
    const deleteIds = []
    deleteIds.push(item.id)
    const deleteItem = survey.questions.filter(question => question.id !== item.id)
    setSurvey({
      ...survey,
      questions: deleteItem,
      delete_questions: [...survey.delete_questions, item.id]
    })
  }

  const update = item => {
    handleUpdateOpen()
    setUpdateQuestion({ ...updateQuestion, ...item })
    setSelectedUpdateType(item.type)
  }

  const handleUpdateClose = () => {
    setOpenUpdateFeedback(false)
  }

  const handleUpdateOpen = () => {
    setOpenUpdateFeedback(true)
  }

  const submitUpdateQuestion = () => {
    const updatedQuestions = survey.questions.map(item => (item.id === updateQuestion.id ? updateQuestion : item))

    setSurvey({ ...survey, questions: updatedQuestions })
    handleUpdateClose()
  }

  const handleUpdateDataChange = event => {
    setUpdateQuestion({
      ...updateQuestion,
      question: event.target.value
    })
  }

  const onUpdateRequiredSwitchChange = (item, checked) => {
    setUpdateQuestion({
      ...updateQuestion,
      required: checked
    })
  }

  const typeList = ['Drop Down', 'Multiple Choice', 'Text Area', 'Checkbox', 'Rating']

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

  const handleUpdateChoiceRemove = item => {
    const deleteChoiceIds = []
    deleteChoiceIds.push(item.id)
    setUpdateQuestion({
      ...updateQuestion,
      choices: updateQuestion.choices.filter(choice => choice.id !== item.id),
      delete_choices: [...updateQuestion.delete_choices, item.id]
    })
  }

  const submitSurvey = async () => {
    setShowSpinner(true)
    const res = await putAPIWrapper(`${updateEmployeeSurvey} ${surveyId}`, survey)
    if (!res.isError) {
      props.notify(res.data.data.message, 'success')
      history.push('/employee-feedback')
      setShowSpinner(false)
    } else {
      props.notify(res.error.message, 'error')
      setShowSpinner(false)
    }
  }

  const handleOpen = () => {
    setSelectedType('')
    setNewQuestionData({
      ...newQuestionData,
      id: ID(),
      question: '',
      choices: [],
      type: '',
      rating: 0
    })
    setOpenAdd(true)
  }
  const handleClose = () => {
    setOpenAdd(false)
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

  const onRequiredSwitchChange = (item, checked) => {
    setNewQuestionData({
      ...newQuestionData,
      required: checked
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

  const handleAddChoiceRemove = item => {
    setNewQuestionData({
      ...newQuestionData,
      choices: newQuestionData.choices.filter(choice => choice.id !== item.id)
    })
  }

  const setDate = event => {
    var date = moment(event.target.value).utc().format('YYYY-MM-DD HH:mm')
    if (date) {
      setSurvey({ ...survey, expire: date })
    }
  }

  return (
    <>
      <OfficerLoader isFetching={surveyFetchingSpinner}>
        <p>Update Employee Survey</p>
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
        <div className="d-flex justify-content-end pt-3">
          <OfficerButton
            buttonName="Rearrange Questions"
            color="officer"
            variant="large"
            click={() => history.push(`/employee-survey-rearrange/${surveyId}`)}
          />

          <div className="px-2">
            <OfficerButton buttonName="Add Question" color="secondary" variant="medium" click={handleOpen} />
          </div>
        </div>

        {survey.questions.map((item, count) => {
          return (
            <div key={`survey-Question-data${count + 2}`}>
              <Questions id={'edit-employee-survey'} item={item} count={count + 1} />
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
              value={moment(survey.expire).format('YYYY-MM-DDThh:mmz')}
              InputLabelProps={{
                shrink: true
              }}
              onChange={setDate}
            />
          </form>
        </div>

        <div className="pt-3">
          <OfficerButton
            buttonName="Update"
            color="primary"
            align="right"
            variant="small"
            showSpinnerProp={showSpinner}
            disabled={survey.questions.length === 0 ? true : false}
            click={submitSurvey}
          />
        </div>

        <div className="d-flex pt-3  flex-column justify-content-center align-items-center">
          <p>Powered By</p>
          <img src={logo} alt="officerLogo" width="250x" height="50px" className="logoStyle" />
        </div>
      </OfficerLoader>

      <OfficerDialog
        open={openAdd}
        title="Add Question"
        fullWidth
        maxWidth={'md'}
        onClose={handleClose}
        actions={
          <div className="pb-3 d-flex">
            <OfficerButton
              buttonName="Save Question"
              color="secondary"
              variant="medium"
              click={submitQuestion}
              align="right"
              disabled={!validateQueSubmission(newQuestionData)}
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
                  id="combo-box-employee-type"
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
              <Grid key={`new-Question-choice${index + 2}`} item sm={12}>
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
            <Questions item={newQuestionData} count={1} />
          </>
        }
      />

      <OfficerDialog
        open={openUpdateFeedback}
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
              align="right"
              disabled={!validateQueSubmission(updateQuestion)}
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
                  id="combo-box-employee-type-2"
                  options={typeList}
                  placeholder="Select Type"
                  required
                  type="text"
                  value={updateQuestion.type}
                  disabled
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
              <Grid key={`update-Question-choice${index + 2}`} item sm={12}>
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
            <Questions item={updateQuestion} count={1} />
          </>
        }
      />
    </>
  )
}
export default EditEmployeeSurvey
