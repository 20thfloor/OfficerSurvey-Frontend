import React, { useEffect, useState } from 'react'
import CreateEvent from '../CreateEvent/CreateEvent'
import { OfficerHeading } from '../../Officers/OfficerList/OfficerListStyle'
import { OfficerButton, OfficerCard, OfficerDialog } from '../../Common'
import survey_not from '../../../assets/survey_not.png'
import { SurveysWrapper } from './SurveyListStyle'
import './SurveyListStyle.css'
import CloseIcon from '@material-ui/icons/Close'
import checkmark from '../../../assets/checkmark.svg'
import SmsSurveyList from './SmsSurveyList'
import Papa from 'papaparse/papaparse.min'
import checkmarkF from '../../../assets/checkmarkF.png'
import { CsvUploadSvg } from '../../../utils/svgs'
import { Button, Grid, Input } from '@material-ui/core'
import { getAPI, postAPIFormDataWrapper } from '../../../utils/api'
import { getEventType, smsSurveyListUrl, uploadCsv } from '../../../utils/apiUrls'

const SurveyList = () => {
  SurveyList.propTypes = {}

  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [openUploadF, setOpenUploadF] = useState(false)
  const [csvFile, setCsvFile] = useState()
  const [getEvent, setGetEvent] = useState([])
  const [openCustomUpload, setOpenCustomUpload] = useState(false)
  const [smsSurvey, setSmsSurvey] = useState({
    links: {
      next: null,
      previous: null
    },
    data: []
  })
  const fetchSmsSurveyAPI = async () => {
    setTableLoadSpinner(true)
    const response = await getAPI(smsSurveyListUrl, null, true)
    if (!response.isError) {
      setTableLoadSpinner(false)
      setSmsSurvey(response.data.data)
    }
  }
  const fetchEventTypeAPI = async () => {
    const response = await getAPI(getEventType, null, true)
    if (!response.isError) {
      var newData = []
      const data = response.data.data.data
      const MAX_PER_PAGE = 10
      const pageCount = Math.ceil(response.data.data.total / MAX_PER_PAGE)
      if (pageCount >= 1) {
        for (let pageI = 1; pageI <= pageCount; pageI++) {
          const fetchPagePromise = await getAPI(getEventType + '?page=' + pageI, null, true)
          const allData = fetchPagePromise.data.data.data
          setGetEvent(prev => [...prev, ...allData])
        }
      }
      data.map(item => {
        delete item.department
        return (newData = [...newData, item])
      })
    }
  }

  const handleCloseUploadF = () => {
    setOpenUploadF(false)
  }

  useEffect(() => {
    fetchSmsSurveyAPI()
  }, [])

  const checkIfImageFile = value => {
    if (value.type === 'csv') {
      return true
    }
    return false
  }

  const handleFileUpload = e => {
    const value = e.target.files[0]
    if (value.type === 'text/csv') {
      checkIfImageFile(value)
      Papa.parse(value, {
        header: true,
        complete: async results => {
          const res = await postAPIFormDataWrapper(uploadCsv, results.data)
          if (!res.isError) {
            setOpenCustomUpload(true)
            fetchEventTypeAPI()
          }
        }
      })
    } else {
      setOpenUploadF(true)
      setCsvFile('')
    }
  }
  const handleCloseCustomUpload = () => {
    setOpenCustomUpload(false)
  }

  return (
    <div className="surveyMainWrapper">
      <div>
        {smsSurvey.data && smsSurvey.data.length > 0 ? (
          <div>
            <SmsSurveyList
              smsSurvey={smsSurvey}
              tableLoadSpinner={tableLoadSpinner}
              setSmsSurvey={setSmsSurvey}
              fetchSmsSurveyAPI={fetchSmsSurveyAPI}
            />
          </div>
        ) : (
          <div>
            <div className="main-screen-upload">
              <OfficerHeading>All SMS Surveys</OfficerHeading>
              <div className="csv-sms-buttons">
                <Button>
                  <Input
                    type="file"
                    color="primary"
                    fullWidth
                    accept="text/csv"
                    value={csvFile}
                    placeholder="No file choosen"
                    starticon={<CsvUploadSvg />}
                    onChange={handleFileUpload}
                  />
                  Upload CSV
                  <CsvUploadSvg />
                </Button>
              </div>
            </div>
            <OfficerCard>
              <SurveysWrapper>
                <img src={survey_not} alt="OfficerLogo" className="mb-3 officerLogo" />
                <h5 className="surveysHeading mb-3">You have not created any SMS Surveys</h5>
                <p className="secContent">Create An event to send SMS Surveys.</p>
                <CreateEvent
                  fetchSmsSurveyAPI={fetchSmsSurveyAPI}
                  fetchEventTypeAPI={fetchEventTypeAPI}
                  getEvent={getEvent}
                  setGetEvent={getEvent}
                />
              </SurveysWrapper>
            </OfficerCard>
            <Grid>
              <OfficerDialog
                open={openCustomUpload}
                fullWidth
                maxWidth={'md'}
                onClose={handleCloseCustomUpload}
                style={{ color: 'blue !important' }}
                className="createEventPopupWrapperInner"
                actions={
                  <>
                    <div className="eventPopupButtonWrapper">
                      <div className="pl-2">
                        <OfficerButton
                          buttonName="Continue"
                          color="primary"
                          variant="large"
                          click={handleCloseCustomUpload}
                        />
                      </div>
                    </div>
                  </>
                }
                content={
                  <>
                    <CloseIcon className="closeIcon" />
                    <div className="upload-content">
                      <img src={checkmark} alt="OfficerLogo" className="officerLogo" />
                      <OfficerHeading>Upload Successfully</OfficerHeading>
                    </div>
                  </>
                }
              />
            </Grid>
          </div>
        )}
      </div>
      <OfficerDialog
        open={openUploadF}
        fullWidth
        maxWidth={'md'}
        onClose={handleCloseUploadF}
        style={{ color: 'blue !important' }}
        className="createEventPopupWrapperInner"
        actions={
          <>
            <div className="eventPopupButtonWrapper">
              <div className="pl-2">
                <OfficerButton click={handleCloseUploadF} buttonName="Close" color="danger" variant="large" />
              </div>
            </div>
          </>
        }
        content={
          <>
            <CloseIcon className="closeIcon" onClick={handleCloseUploadF} />
            <div className="upload-content">
              <img src={checkmarkF} alt="OfficerLogo" className="mb-3 officerLogo" />
              <OfficerHeading>Upload failed</OfficerHeading>
              <span>Please select correct file type</span>
            </div>
          </>
        }
      />
    </div>
  )
}

export default SurveyList
