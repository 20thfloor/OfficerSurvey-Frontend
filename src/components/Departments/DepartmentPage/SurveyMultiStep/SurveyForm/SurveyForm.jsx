// eslint-disable-next-line react/prop-types

import React, { useEffect, useState } from 'react'
import { Box, Grid, Hidden } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import Questions from '../../../../Survey/Questions'
import OfficerButton from '../../../../Common/OfficerButton'
import { useTranslation } from 'react-i18next'
import { QuestionDiv } from './SurveyFormStyle'
import { OfficerCard, OfficerInputField } from '../../../../Common'
import { validateDepartmentSurvey } from '../../../../../utils/helpers'
import { useLocation } from 'react-router-dom'
import { patchAPIWrapperWithoutAuth } from '../../../../../utils/api'
import './style.css'
import PropTypes from 'prop-types'
import { updateClickSubmitCount } from '../../../../../utils/apiUrls'

// import $ from "jquery";


//   $(".PrivateSwitchBase-input-6").on('click', function(event){
//     alert("Om Success its working");
// });


const SurveyForm = ({
  type,
  rating,
  departmentData,
  handleFinish,
  handleRating,
  handleChangeComment,
  handlePrevious,
  showSpinner,
  comment,
  show
}) => {
  SurveyForm.propTypes = {
    rating: PropTypes.any.isRequired,
    departmentData: PropTypes.any.isRequired,
    handleFinish: PropTypes.any.isRequired,
    type: PropTypes.any.isRequired,
    handleRating: PropTypes.any.isRequired,
    handleChangeComment: PropTypes.any.isRequired,
    handlePrevious: PropTypes.any.isRequired,
    showSpinner: PropTypes.any.isRequired,
    comment: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired
  }
  const [rawQuestionResponse, setRawQuestionResponse] = useState({})
  const [questionIds, setQuestionIds] = useState({})
  const { t, i18n: translator } = useTranslation()
  const [buttonDisable, setButtonDisable] = useState(false)
  const search = useLocation().search
  const id = new URLSearchParams(search).get('ref')

 
//   $(".bodyWithoutPadding").on('click', function(event){
//     alert("Om Success");
// });

// $(".PrivateSwitchBase-input-6").on('click', function(event){
//   var bla = $(".PrivateSwitchBase-input-6").attr("value");
//   alert('value is '+bla);


//   alert("Om Success its working");
// }); 
 
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
          comment: text,
          choices: [...arr],
          file: null
        }
      })
  }

  const handleQuestionData = (question, choice, comment) => {
    if (question.type === 'Checkbox') {
      let arr = []
      if (rawQuestionResponse[question.id]) arr = rawQuestionResponse[question.id].choices
      setRawQuestionResponse({
        ...rawQuestionResponse,
        [question.id]: {
          question: question.id,
          choice: null,
          comment: comment,
          choices: [...arr, choice.id]
        }
      })
    } else {
      setRawQuestionResponse({
        ...rawQuestionResponse,
        [question.id]: {
          question: question.id,
          choice: choice.id,
          comment: comment,
          choices: []
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

  const handleSubmit = event => {
    event.preventDefault()
    handleFinish(rawQuestionResponse)
    postSubmitFeedbackAPI()
  }
  const postSubmitFeedbackAPI = async () => {
    await patchAPIWrapperWithoutAuth(updateClickSubmitCount, { is_submitted: true, ref: id })
  }

  useEffect(() => {
    translator.changeLanguage(type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    rating === null ? setButtonDisable(true) : setButtonDisable(false)
  }, [rating])

  useEffect(() => {
    if (!validateDepartmentSurvey(departmentData.survey, rawQuestionResponse)) {
      setButtonDisable(true)
    } else {
      setButtonDisable(false)
    }
  }, [departmentData.survey, rawQuestionResponse])

  const renderSurvey = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <Box mb={3} m={1}>
            <div className="dataStyle">{departmentData.survey.about}</div>
          </Box>
          <OfficerCard>
            {departmentData.survey.questions.map((item, count) => (
              <QuestionDiv key={`department-data${count + 2}`}>
                <Grid key={item.id}>
                  <div className={item.id}></div>
                  <Questions
                    type={type}
                    item={item}
                    count={count + 1}
                    handleQuestionData={handleQuestionData}
                    handleCheckboxData={handleCheckboxData}
                    
                  />
                </Grid>
                
              </QuestionDiv>
            ))}
            <Box component="fieldset" mx={1} borderColor="transparent">
              <h5>{t('Rate the Officer') + ':'}</h5>
              <Rating
                name="simple-controlled"
                value={rating}
                size="large"
                onChange={(event, newValue) => {
                  handleRating(newValue)
                }}
              />
            </Box>
            <Box component="fieldset" mx={1} borderColor="transparent">
              <h5>{t('Any Comments:')}</h5>
              <OfficerInputField
                type="text"
                variant="outlined"
                placeholder={t('Comment Here')}
                id="comment_data"
                name="comment"
                value={comment}
                onChange={handleChangeComment}
                maxLength={800}
                multiline
                characterCount
              />
            </Box>
            {show ? (
              <Grid container>
                <Grid item xs={6} sm={6}>
                  <Box mt={3} mx={1}>
                    <OfficerButton
                      buttonName={t('Previous')}
                      color="secondary"
                      variant="small"
                      align="left"
                      click={() => handlePrevious()}
                    />
                  </Box>
                </Grid>

                <Grid>
                  <Box mt={3} style={{ display: 'flex' }}>
                    <OfficerButton
                      type="submit"
                      buttonName={t('Submit Feedback')}
                      color="black"
                      variant="large"
                      align="right"
                      showSpinnerProp={showSpinner}
                      disabled={buttonDisable || !validateDepartmentSurvey(departmentData.survey, rawQuestionResponse)}
                    />
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <div className="w-100">
                <OfficerButton
                  type="submit"
                  applyFullWidth={'true'}
                  buttonName={t('Submit Feedback')}
                  color="officer"
                  variant="large"
                  showSpinnerProp={showSpinner}
                  disabled={buttonDisable || !validateDepartmentSurvey(departmentData.survey, rawQuestionResponse)}
                />
              </div>
            )}
          </OfficerCard>
        </form>
      </>
    )
  }

  return (
    <>
      <Hidden mdUp>
        <Box>{renderSurvey()}</Box>
      </Hidden>
      <Hidden smDown>
        <Box p={6}>{renderSurvey()}</Box>
      </Hidden>
    </>
  )
}

export default SurveyForm
