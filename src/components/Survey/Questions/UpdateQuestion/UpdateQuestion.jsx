/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Grid, Box, Switch } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import OfficerButton from '../../../Common/OfficerButton'
import Questions from '../Questions'
import { putAPIWrapper, getAPI } from '../../../../utils/api'
import AddChoice from '../AddQuestion/AddChoice'
import OfficerLoader from '../../../Common/OfficerLoader'
import { questionUrl } from '../../../../utils/apiUrls'
import { UpdateQuestionHeading, Questionlooks, Required, Choices } from './UpdateQuestionStyle'
import { OfficerAutocomplete, OfficerInputField } from '../../../Common'
import { validateQueSubmission } from '../../../../utils/helpers'

const UpdateQuestion = props => {
  UpdateQuestion.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [selectedType, setSelectedType] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)
  const [fetchingQuestion, setFetchingQuestion] = useState(false)
  const [updateQuestionData, setUpdateQuestionData] = useState({
    question: '',
    type: '',
    required: false,
    choices: [],
    delete_choices: [1]
  })

  const onChoiceValueChange = (item, value) => {
    setUpdateQuestionData({
      ...updateQuestionData,
      choices: updateQuestionData.choices.map(choice => {
        if (choice.id === item.id) {
          choice.choice = value
        }
        return choice
      })
    })
  }

  const onRequiredSwitchChange = (item, checked) => {
    setUpdateQuestionData({
      ...updateQuestionData,
      required: checked
    })
  }

  const onChoicePlaceholderChange = (item, value) => {
    setUpdateQuestionData({
      ...updateQuestionData,
      choices: updateQuestionData.choices.map(choice => {
        if (choice.id === item.id) {
          choice.comment_box_place_holder = value
        }
        return choice
      })
    })
  }

  const handleClose = () => {
    history.push('/survey')
  }

  const onChoiceSwitchChange = (item, checked) => {
    setUpdateQuestionData({
      ...updateQuestionData,
      choices: updateQuestionData.choices.map(choice => {
        if (choice.id === item.id) {
          choice.show_comment_box = checked
          if (checked === false) {
            choice.comment_box_place_holder = ''
          }
        }
        return choice
      })
    })
  }

  const handleAddChoiceRemove = item => {
    setUpdateQuestionData({
      ...updateQuestionData,
      choices: updateQuestionData.choices.filter(choice => choice.id !== item.id),
      delete_choices: [...updateQuestionData.delete_choices, item.id]
    })
  }
  const handleAddNewChoiceTrue = () => {
    setUpdateQuestionData({
      ...updateQuestionData,
      choices: [
        ...updateQuestionData.choices,
        {
          id: ID(),
          choice: '',
          show_comment_box: false,
          comment_box_place_holder: '',
          is_new: true
        }
      ]
    })
  }

  const typeList = ['Drop Down', 'Multiple Choice', 'Text Area']
  const { questionId } = useParams()

  const fetchQuestionAPI = async () => {
    setFetchingQuestion(true)
    const response = await getAPI(`${questionUrl}${questionId}`)
    if (!response.isError) {
      setFetchingQuestion(false)
      setSelectedType(response.data.data.data.type)
      setUpdateQuestionData({ ...response.data.data.data, delete_choices: [] })
    }
  }

  useEffect(() => {
    fetchQuestionAPI()
  }, [])

  const history = useHistory()

  const submitQuestion = async () => {
    setShowSpinner(true)
    const res = await putAPIWrapper(`/${questionUrl}${questionId}/`, updateQuestionData)
    if (!res.isError) {
      setShowSpinner(false)
      props.notify(res.data.data.message, 'success')
      history.push('/survey')
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }

  const ID = () => '_' + Math.random().toString(36).substr(2, 9)

  const handleUpdateQuestionDataChange = event => {
    setUpdateQuestionData({
      ...updateQuestionData,
      question: event.target.value
    })
  }

  const onTypeChange = value => {
    if (value === 'Text Area') {
      setUpdateQuestionData({
        ...updateQuestionData,
        type: value,
        choices: []
      })
    } else {
      setUpdateQuestionData({
        ...updateQuestionData,
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

  return (
    <>
      <UpdateQuestionHeading className="mt-3  mb-2 d-flex justify-content-center ">
        Update Question
      </UpdateQuestionHeading>
      <OfficerLoader isFetching={fetchingQuestion}>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <OfficerInputField
              placeholder="Enter Question"
              id="Enter Question"
              required
              type="text"
              label="Enter Question"
              name="question"
              value={updateQuestionData.question}
              onChange={handleUpdateQuestionDataChange}
            />
          </Grid>
          <Grid item sm={12} xs={12}>
            <div className="d-flex  align-items-center">
              <Required>Required: </Required>
              <Switch
                onChange={onRequiredSwitchChange}
                checked={updateQuestionData.required}
                color="primary"
                name="checked"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <OfficerAutocomplete
              id="combo-box-update-question-type"
              options={typeList}
              fullWidth
              disabled
              value={updateQuestionData.type}
              placeholder="Select Type"
              idTextField="Select Type"
              required
              type="text"
              label="Select Type"
              name="type"
              getOptionLabel={option => (option ? option : '')}
              getOptionSelected={(option, value) => {
                if (value === '') {
                  return true
                } else if (value === option) {
                  return true
                }
              }}
              onChange={(event, newValue) => {
                if (newValue !== undefined) {
                  onTypeChange(newValue)
                  return newValue != null ? setSelectedType(newValue) : ''
                }
              }}
            />
          </Grid>
        </Grid>
        <Grid>
          {selectedType === 'Drop Down' || selectedType === 'Multiple Choice' || selectedType === 'Checkbox' ? (
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
        </Grid>
        {updateQuestionData.choices.map(choice => (
          <Grid key={`item${choice.id}`} item sm={12}>
            <AddChoice
              id={choice.id}
              value={choice.choice}
              onChangeChoice={event => onChoiceValueChange(choice, event.target.value)}
              onChangeSwitch={event => onChoiceSwitchChange(choice, event.target.checked)}
              checked={choice.show_comment_box}
              hideSwitch={selectedType === 'Checkbox'}
              show_comment_box={choice.show_comment_box}
              onChangePlaceholder={event => onChoicePlaceholderChange(choice, event.target.value)}
              onRemoveChoice={() => handleAddChoiceRemove(choice)}
            />
          </Grid>
        ))}
        <Questionlooks className="pt-5">This is how your question will look like :</Questionlooks>

        <Questions item={updateQuestionData} />

        <Grid container direction="row" item display="flex-end" alignItems="flex-end" sm={12} xs={12}>
          <Box display="flex" marginRight={1} marginTop={2}>
            <OfficerButton
              buttonName="Update Question"
              color="secondary"
              variant="medium"
              click={submitQuestion}
              showSpinnerProp={showSpinner}
              disabled={!validateQueSubmission(updateQuestionData)}
            />
          </Box>
          <Box marginTop={2}>
            <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleClose} />
          </Box>
        </Grid>
      </OfficerLoader>
    </>
  )
}

export default UpdateQuestion
