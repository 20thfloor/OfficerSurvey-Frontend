/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAPIWithoutAuth, postAPIWithoutAuth } from '../../../utils/api'
import { OfficerImage } from '../../Common'
import { Grid, Box, Hidden } from '@material-ui/core'
import { OfficerCard } from '../../Common'
import { ApplyBorders, SelectLanguage } from '../DepartmentPage/SurveyMultiStep/SurveyMutistepStyle'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { useTranslation } from 'react-i18next'
import SurveyForm from '../DepartmentPage/SurveyMultiStep/SurveyForm/SurveyForm'
import { OfficerDialog } from '../../Common'
import { addSurveyUrl } from '../../../utils/apiUrls'
import CheckImage from '../../../assets/check_box.png'
import Checkbox from '@material-ui/core/Checkbox'
import CitizenInfo from '../DepartmentPage/SurveyMultiStep/CitizenInfo/CitizenInfo'
import DepartmentHeader from '../../DepartmentHeader'
import './officerPageStyling.css'

const OfficerSurveyPage = () => {
  const { id } = useParams()
  const [officerProfilePicture, setOfficerProfilePicture] = useState('')
  const [officerBadgeNumber, setOfficerBadgeNumber] = useState('')
  const [officerFirstName, setOfficerFirstName] = useState('')
  const [officerLastName, setOfficerLastName] = useState('')
  const [selectedType, setSelectedType] = useState('en')
  const [departmentData, setDepartmentData] = useState('')
  const [shouldSubmitSurvey, setShouldSubmitSurvey] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [rating, setRating] = useState(5)
  const [openThankyou, setOpenThankyou] = useState(false)
  const [anonymous, setAnonymous] = useState(true)
  const [officerData, setOfficerData] = useState('')

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

  const { t, i18n: translator } = useTranslation()

  const fetchSurveyData = async () => {
    const res = await getAPIWithoutAuth(`officer/${id}/survey`)
    setOfficerData(res.data.data.data)
    setOfficerProfilePicture(res.data.data.data.user.profile_pic)
    setOfficerFirstName(res.data.data.data.first_name)
    setOfficerLastName(res.data.data.data.last_name)
    setOfficerBadgeNumber(res.data.data.data.badge_number)
    setDepartmentData(res.data.data.data.department)
  }
  const handleChange = event => {
    setSelectedType(event.target.value)
  }
  useEffect(() => {
    translator.changeLanguage(selectedType)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType])
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
  const handleOpenThankyou = () => {
    setOpenThankyou(true)
  }
  const handleChangeComment = event => {
    setSurveyyResponseData({
      ...surveyResponseData,
      comment: event.target.value
    })
  }
  const sortArray = array => {
    array.sort((a, b) => {
      return a.question - b.question
    })
    return array
  }
  useEffect(() => {
    fetchSurveyData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (departmentData) {
      setSurveyyResponseData({
        ...surveyResponseData,
        survey: departmentData.survey.id,
        officer: officerData.id
      })
    }
  }, [departmentData, officerData])
  const handlePrevious = () => {}
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
  // const handleCloseThankyou = () => {
  //   setOpenThankyou(false)
  //   setSurveyyResponseData({
  //     rating: 3,
  //     citizen: {
  //       first_name: '',
  //       last_name: '',
  //       phone: '',
  //       address: '',
  //       city: '',
  //       state: '',
  //       zip_code: ''
  //     }
  //   })

  //   setShouldSubmitSurvey(false)
  // }
  const handleChangeCheck = event => {
    if (event.target.checked) {
      setAnonymous(true)
    } else {
      setAnonymous(false)
    }
  }

  useEffect(() => {
    if (shouldSubmitSurvey) {
      submitSurvey()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [shouldSubmitSurvey])
  const handleCitizenData = obj => {
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

  const officerSurveyForm = () => {
    return (
      <div className='Main-servey'>
        <div>
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
        </div>
        <div>
          {departmentData !== '' ? (
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
              show={false}
            />
          ) : (
            ''
          )}
        </div>
        <div />
      </div>
    )
  }
  return (
    <>
    
    <div className="d-flex justify-content-center align-items-center flex-column">
      <div className="col-md-12 pt-3">
        <DepartmentHeader header={departmentData.header} />
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div>
          <Box display="flex">
            <OfficerImage
              width="100px"
              height="100px"
              imageStyle={{ borderRadius: '50%' }}
              borderRadius="50%"
              url={officerProfilePicture}
              alt={'officer Image'}
            />
          </Box>
        </div>
        <div>
          <div className="officerNameStyle">
            {officerFirstName}
            {officerLastName}
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="officerSurveyBadgeHeading">Badge number:</div>
          <div className="officerSurveyBadgeNumber">{officerBadgeNumber}</div>
        </div>
      </div>
      <div>
        <Hidden mdUp>
          <Box>{officerSurveyForm()}</Box>
        </Hidden>
        <Hidden smDown>
          <Box>{officerSurveyForm()}</Box>
        </Hidden>



        
        <Grid item xs={6} sm={6} className="d-flex">
          <OfficerDialog
            maxWidth={'xs'}
            open={openThankyou}
            content={
              <>
                <Box style={{ marginRight: '135px' }}>
                  <Box display="flex" flexDirection="row" justifyContent="center" marginBottom={3}>
                    <img src={CheckImage} width={50} height={50} alt={t('ThankYou text and tick')} />
                  </Box>
                  <p className="d-flex justify-content-center ">{t('Thank You for Submitting the Survey')}</p>
                </Box>
              </>
            }
          />
        </Grid>
      </div>
      <div className="col-md-12 citizenInfoBox">
        <div style={{ paddingLeft: '60px', paddingTop: '-25px' }}>
          <Checkbox name="checkedI" onChange={handleChangeCheck} color="primary" defaultChecked />
          <span>Anonymous</span>
        </div>
        {!anonymous ? (
          <div className="d-flex flex-column">
            <div className="officerNameStyle pl-4 ">Enter Your Information </div>
            <div className="col-md-12 citizenInfoStyle">
              <CitizenInfo
                type={selectedType}
                handleNext={handleCitizenData}
                handlePrevious={handlePrevious}
                surveyResponseData={surveyResponseData}
                show={false}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
    </>   
  )
}
export default OfficerSurveyPage
