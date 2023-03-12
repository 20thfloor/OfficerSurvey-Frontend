import React, { useState, useEffect } from 'react'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { Grid } from '@material-ui/core'
import { Questionlooks, Choices } from './UpdatePollStyle'
import Questions from '../../Survey/Questions/Questions'
import { putAPIWrapper, getAPI } from '../../../utils/api'
import AddChoice from '../../Survey/Questions/AddQuestion/AddChoice/AddChoice'
import { updateCommunitySurvey, getCommunitySurvey } from '../../../utils/apiUrls'
import { OfficerInputField } from '../../Common'
import logo from '../../../assets/logo_officer.png'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { validateQueSubmission } from '../../../utils/helpers'
import { useParams, useHistory } from 'react-router-dom'
import OfficerLoader from '../../Common/OfficerLoader/OfficerLoader'
import PropTypes from 'prop-types'

const UpdatePoll = props => {
  UpdatePoll.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const history = useHistory()
  const [surveyFetchingSpinner, setSurveyFetchingSpinner] = useState(false)

  const ID = () => '_' + Math.random().toString(36).substr(2, 9)
  const { poleId } = useParams()
  const pageLimit = 1
  const [query] = useState({
    page: 1,
    page_size: pageLimit
  })

  const [submitSpinner, setSubmitSpinner] = useState(false)
  const [survey, setSurvey] = useState({
    title: '',
    instruction: '',
    type: 'Poll',
    expire: '',
    questions: [
      {
        question: '',
        type: 'Poll',
        required: true,
        choices: [],
        delete_choices: []
      }
    ]
  })

  const setDate = event => {
    var date = moment(event.target.value).format('YYYY-MM-DD HH:mm')
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
    let list = []
    if (survey.questions[0].delete_choices) list = [...survey.questions[0].delete_choices, item.id]
    else list = [item.id]
    setSurvey({
      ...survey,
      questions: [
        {
          ...survey.questions[0],
          choices: survey.questions[0].choices.filter(choice => choice.id !== item.id),
          delete_choices: list
        }
      ]
    })
  }

  const updatePole = async () => {
    setSubmitSpinner(true)
    const res = await putAPIWrapper(`${updateCommunitySurvey} ${poleId}`, survey)
    if (!res.isError) {
      setSubmitSpinner(false)
      history.push('/community-feedback')

      props.notify(res.data.data.message, 'success')
    } else {
      setSubmitSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }

  const fetchSurvey = async () => {
    setSurveyFetchingSpinner(true)
    const response = await getAPI(`${getCommunitySurvey} ${poleId}`, query)
    if (!response.isError) {
      setSurvey({ ...survey, ...response.data.data.data })
      setSurveyFetchingSpinner(false)

      return
    } else {
      setSurveyFetchingSpinner(false)
    }
  }

  useEffect(() => {
    fetchSurvey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    // eslint-disable-next-line no-console
  }, [survey])

  return (
    <>
      <OfficerLoader isFetching={surveyFetchingSpinner}>
        <p>Update a Poll</p>
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
              id="Enter Poll Question"
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
        <Questions count={1} item={survey.questions[0]} />

        <div>
          <form noValidate className="d-flex justify-content-end py-3">
            <TextField
              id="datetime-local"
              label="Expiry Date"
              type="datetime-local"
              name="expire"
              disabled
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
            color="officer"
            align="right"
            variant="medium"
            showSpinnerProp={submitSpinner}
            click={updatePole}
            disabled={!validateQueSubmission(survey.questions[0])}
          />
        </div>

        <div className="d-flex  flex-column justify-content-center align-items-center">
          <p>Powered By</p>
          <img src={logo} alt="officerLogo" width="250x" height="100px" className="logoStyle" />
        </div>
      </OfficerLoader>
    </>
  )
}
export default UpdatePoll
