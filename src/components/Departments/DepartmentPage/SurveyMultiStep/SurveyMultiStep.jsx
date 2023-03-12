/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import OfficerDialog from '../../../Common/OfficerDialog/OfficerDialog'
import OfficerSelection from './OfficerSelection'
import SurveyForm from './SurveyForm'
import CitizenInfo from './CitizenInfo'
import { Box, Grid, Hidden, Typography } from '@material-ui/core'
import OfficerButton from '../../../Common/OfficerButton'
import { postAPIWithoutAuth } from '../../../../utils/api'
import CheckImage from '../../../../assets/check_box.png'
import { addSurveyUrl } from '../../../../utils/apiUrls'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { useTranslation } from 'react-i18next'
import '../SurveyMultiStep/SurveyMultiStepStyle.css'
import { ApplyBorders, SelectLanguage } from './SurveyMutistepStyle'
import { OfficerCard } from '../../../Common'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    width: '80%'
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

const SurveyMultiForm = ({ departmentData }) => {
  SurveyMultiForm.propTypes = {
    departmentData: PropTypes.any.isRequired
  }
  const classes = useStyles()
  const [openThankyou, setOpenThankyou] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedType, setSelectedType] = useState('en')
  const { t, i18n: translator } = useTranslation()
  const [shouldSubmitSurvey, setShouldSubmitSurvey] = useState(false)

  const getSteps = () => {
    return [t('Select Officer'), t('Enter Your Info'), t('Fill Survey Form')]
  }
  const steps = getSteps()
  const [surveyResponseData, setSurveyyResponseData] = useState({
    rating: 5,
    citizen: {
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: ''
    },
    comment: ''
  })
  const [showSpinner, setShowSpinner] = useState(false)
  const [rating, setRating] = useState(5)

  const submitSurvey = async () => {
    setShowSpinner(true)

    const res = await postAPIWithoutAuth(addSurveyUrl, surveyResponseData)
    setSurveyyResponseData({ ...surveyResponseData, rating: 5 })
    if (!res.isError) {
      setShowSpinner(false)
      handleOpenThankyou()
    }
    setShowSpinner(false)
  }

  const handleNext = obj => {
    if (activeStep === 0) {
      setSurveyyResponseData({
        ...surveyResponseData,
        survey: departmentData.survey.id,
        officer: obj.id
      })
    }
    if (activeStep === 1) {
      setSurveyyResponseData({
        ...surveyResponseData,
        citizen: {
          first_name: obj.first_name,
          last_name: obj.last_name,
          phone: obj.phone,
          address: obj.address,
          city: obj.city,
          state: obj.state,
          zip_code: obj.zip_code
        }
      })
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handlePrevious = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const sortArray = array => {
    array.sort((a, b) => {
      return a.question - b.question
    })
    return array
  }

  const handleFinish = async rawQuestionResponse => {
    let array = []
    for (const key in rawQuestionResponse) {
      array.push(rawQuestionResponse[key])
    }
    array = sortArray(array)

    setShouldSubmitSurvey(true)
    setSurveyyResponseData({
      ...surveyResponseData,
      questions_responses: array
    })
  }

  const handleRating = rating => {
    setSurveyyResponseData({
      ...surveyResponseData,
      rating: rating
    })
    setRating(rating)
  }

  const handleChangeComment = event => {
    setSurveyyResponseData({
      ...surveyResponseData,
      comment: event.target.value
    })
  }
  const handleOpenThankyou = () => {
    setOpenThankyou(true)
  }
  const handleCloseThankyou = () => {
    setOpenThankyou(false)
    setActiveStep(0)
    setSurveyyResponseData({
      rating: 3,
      citizen: {
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: ''
      }
    })
    setShouldSubmitSurvey(false)
  }

  useEffect(() => {}, [surveyResponseData])

  useEffect(() => {
    if (shouldSubmitSurvey) {
      submitSurvey()
    }
  }, [shouldSubmitSurvey])
  const handleChange = event => {
    setSelectedType(event.target.value)
  }
  useEffect(() => {
    translator.changeLanguage(selectedType)
  }, [selectedType])

  const renderMultiStep = () => {
    return (
      <>
        <OfficerCard pl="0px" pr="0px" pt="0px" pb="0px">
          <Grid container direction="row">
            <Grid item xs={12} sm={12} className="d-flex">
              <Box display="flex" justifyContent="center" width="100%" alignItems="center" my={2}>
                <ApplyBorders className="p-2 d-flex align-items-center justify-content-around">
                  <SelectLanguage>Select Language:</SelectLanguage>
                  <Select
                    className="pb-0"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={selectedType}
                    onChange={handleChange}
                    style={{ color: '#323C47', fontWeight: '500' }}>
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'ko'}>Korean</MenuItem>
                    <MenuItem value={'ar'}>Arabic</MenuItem>
                    <MenuItem value={'es'}>Spanish</MenuItem>
                    <MenuItem value={'fr'}>French</MenuItem>
                    <MenuItem value={'zh-CN'}>Chinese</MenuItem>
                  </Select>
                </ApplyBorders>
              </Box>
            </Grid>
          </Grid>
        </OfficerCard>

        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>All steps completed</Typography>
            </div>
          ) : (
            <div>
              {activeStep === 0 ? (
                <OfficerSelection type={selectedType} departmentData={departmentData} handleNext={handleNext} />
              ) : activeStep === 1 ? (
                <CitizenInfo
                  type={selectedType}
                  handleNext={handleNext}
                  handlePrevious={handlePrevious}
                  surveyResponseData={surveyResponseData}
                  show
                />
              ) : activeStep === 2 ? (
                <SurveyForm
                  type={selectedType}
                  handleFinish={handleFinish}
                  handlePrevious={handlePrevious}
                  handleChangeComment={handleChangeComment}
                  departmentData={departmentData}
                  handleRating={handleRating}
                  showSpinner={showSpinner}
                  rating={rating}
                  comment={surveyResponseData.comment}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <Hidden mdUp>
        <Box>{renderMultiStep()}</Box>
      </Hidden>
      <Hidden smDown>
        <Box>{renderMultiStep()}</Box>
      </Hidden>
      <OfficerDialog
        open={openThankyou}
        onClose={handleCloseThankyou}
        actions={<OfficerButton buttonName="OK" color="black" variant="small" click={handleCloseThankyou} />}
        content={
          <>
            <Box>
              <Box display="flex" flexDirection="row" justifyContent="center" marginBottom={3}>
                <img src={CheckImage} width={50} height={50} alt={t('ThankYou text and tick')} />
              </Box>
              <p className="d-flex justify-content-center">{t('Thank You for Submitting the Survey')}</p>
            </Box>
          </>
        }
      />
    </>
  )
}

export default SurveyMultiForm
