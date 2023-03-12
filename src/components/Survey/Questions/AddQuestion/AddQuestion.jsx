import React, { useState } from 'react'
import { Grid, Box, Switch } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import OfficerButton from '../../../Common/OfficerButton'
import Questions from '../Questions'
import { postAPIWrapper } from '../../../../utils/api'
import AddChoice from './AddChoice'
import { questionUrl } from '../../../../utils/apiUrls'
import { AddQuestionHeading, Questionlooks, Required, Choices } from './AddQuestionStyle'
import { OfficerAutocomplete, OfficerInputField } from '../../../Common'
import { validateQueSubmission } from '../../../../utils/helpers'
import PropTypes from 'prop-types'

const AddQuestion = props => {
  AddQuestion.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [selectedType, setSelectedType] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)
  const [newQuestionData, setNewQuestionData] = useState({
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
  const handleClose = () => {
    history.push('/survey')
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

  const onChoiceSwitchChange = (item, checked) => {
    setNewQuestionData({
      ...newQuestionData,
      choices: newQuestionData.choices.map(choice => {
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

  const onRequiredSwitchChange = (item, checked) => {
    setNewQuestionData({
      ...newQuestionData,
      required: checked
    })
  }

  const handleAddChoiceRemove = item => {
    setNewQuestionData({
      ...newQuestionData,
      choices: newQuestionData.choices.filter(choice => choice.id !== item.id)
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

  const typeList = ['Drop Down', 'Multiple Choice', 'Text Area', 'Checkbox']
  const history = useHistory()

  const submitQuestion = async () => {
    setShowSpinner(true)
    const res = await postAPIWrapper(questionUrl, newQuestionData)
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

  const handleNewQuestionDataChange = event => {
    setNewQuestionData({
      ...newQuestionData,
      question: event.target.value
    })
  }

  const onTypeChange = value => {
    if (value === 'Text Area') {
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

  return (
    <>
      <AddQuestionHeading className="mt-3  mb-2 d-flex justify-content-center ">Add Question</AddQuestionHeading>
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
            id="combo-box-add-question-type"
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

      {newQuestionData.choices.map((choice, index) => (
        <Grid item sm={12} key={`new-question-data${index + 2}`}>
          <AddChoice
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
      <Questions item={newQuestionData} />

      <Grid container direction="row" item display="flex-end" sm={12} xs={12}>
        <Box display="flex" marginRight={1} marginTop={2}>
          <OfficerButton
            buttonName="Save Question"
            color="secondary"
            variant="medium"
            click={submitQuestion}
            showSpinnerProp={showSpinner}
            disabled={!validateQueSubmission(newQuestionData)}
          />
        </Box>
        <Box marginTop={2}>
          <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleClose} />
        </Box>
      </Grid>
    </>
  )
}

export default AddQuestion
