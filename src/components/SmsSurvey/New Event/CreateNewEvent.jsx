import { Box, Grid, Input, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { OfficerAutocomplete, OfficerButton, OfficerDialog, OfficerInputField } from '../../Common'
import '../CreateEvent/CreateEventStyle.css'
import { CsvUploadSvg } from '../../../utils/svgs'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import CloseIcon from '@material-ui/icons/Close'
import checkmark from '../../../assets/checkmark.svg'
import checkmarkF from '../../../assets/checkmarkF.png'
import Papa from 'papaparse/papaparse.min'
import PropTypes from 'prop-types'
import { getAPI, postAPIFormDataWrapper } from '../../../utils/api'
import { addEventType, getEventType, smsSurveyUrl, uploadCsv } from '../../../utils/apiUrls'
import { createFormDataObject } from '../../../utils/helpers'
import { useSelector } from 'react-redux'
import { OfficerHeading } from '../../Officers/OfficerList/OfficerListStyle'

const CreateNewEvent = ({ fetchSmsSurveyAPI }) => {
  CreateNewEvent.propTypes = {
    fetchSmsSurveyAPI: PropTypes.func.isRequired
  }

  const dept_id = useSelector(state => state.user.user.department.id)

  const [focusEvent, setFocusEvent] = useState(false)
  const dispostion = ['Not Arrested', 'Arrested']
  const citizen_ship = ['Victim', 'Subject', 'Caller', 'Witness', 'Suspect']

  const [openDialog, setOpenDialog] = useState(false)

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const [eventTypeData, setEventTypeData] = useState({
    eventtype: '',
    department: dept_id
  })

  const [showSpinner, setShowSpinner] = useState(false)
  const [openUploadF, setOpenUploadF] = useState(false)
  const [csvFile, setCsvFile] = useState()
  const [showSpinnerEvent, setShowSpinnerEvent] = useState(false)
  const [getEvent, setGetEvent] = useState([])
  const [openCustomUpload, setOpenCustomUpload] = useState(false)
  const [smsSurveyData, setSmsSurveyData] = useState({
    dispostion: '',
    citizen_ship: '',
    event_name: '',
    from_field: '',
    event_type: '',
    department: dept_id
  })

  const handleCloseCustomUpload = () => {
    setOpenCustomUpload(false)
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

  useEffect(() => {
    fetchEventTypeAPI()
  }, [])

  const [isActive, setActive] = useState(false)
  const onClickDropdown = () => {
    setActive(!isActive)
  }

  const AddEvent = async e => {
    e.preventDefault()
    setShowSpinnerEvent(true)
    const formData = createFormDataObject(eventTypeData)
    const res = await postAPIFormDataWrapper(addEventType, formData)
    setSmsSurveyData({
      ...smsSurveyData,
      eventtype: res.data.data.id
    })
    if (!res.isError) {
      setShowSpinnerEvent(false)
      fetchEventTypeAPI()
    } else {
      setShowSpinnerEvent(false)
    }
  }

  useEffect(() => {
    setSmsSurveyData({
      department: dept_id
    })
    setEventTypeData({
      department: dept_id
    })
  }, [dept_id])

  const createSmsSurvey = async () => {
    setShowSpinner(true)
    const formData = createFormDataObject(smsSurveyData)
    const res = await postAPIFormDataWrapper(smsSurveyUrl, formData)
    if (!res.isError) {
      setShowSpinner(false)
      setOpenDialog(false)
      fetchSmsSurveyAPI()
    } else {
      setShowSpinner(false)
    }
  }

  const handleSmsSurveyChange = e => {
    setFocusEvent(false)
    const { value, name } = e.target
    setSmsSurveyData({
      ...smsSurveyData,
      [name]: value
    })
  }

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

  const handleCloseUploadF = () => {
    setOpenUploadF(false)
  }
  return (
    <div className="smsSurveyEventPopup">
      <Box display="flex" justifyContent="center" p={1} component={Grid} item>
        <div className="csv-sms-buttons mr-3">
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
        <OfficerButton
          startIcon={<AddCircleOutlineIcon />}
          buttonName="Create SMS Survey"
          color="primary"
          variant="large"
          click={handleClickOpen}
        />
      </Box>
      <Grid>
        <OfficerDialog
          open={openDialog}
          fullWidth
          maxWidth={'md'}
          onClose={handleClose}
          style={{ color: 'blue !important' }}
          title="Create SMS Survey "
          className="createEventPopupWrapper"
          actions={
            <>
              <div className="eventPopupButtonWrapper">
                <Box component={Grid} item>
                  <OfficerButton buttonName="Cancel" color="secondary" variant="small" click={handleClose} />
                </Box>
                <div className="pl-2">
                  <OfficerButton
                    showSpinnerProp={showSpinner}
                    click={createSmsSurvey}
                    buttonName="Create Event"
                    color="primary"
                    variant="large"
                  />
                </div>
              </div>
            </>
          }
          content={
            <>
              <CloseIcon className="closeIcon" onClick={handleClose} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                  <OfficerInputField
                    placeholder="Based on your interaction with our officer how would you rate the service?"
                    required
                    id="From Field"
                    type="text"
                    label="From"
                    name="from_field"
                    value={smsSurveyData.from_field}
                    onChange={handleSmsSurveyChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <OfficerInputField
                    placeholder="Please type your event Name"
                    required
                    id="Event Name"
                    type="text"
                    label="Event Name"
                    name="event_name"
                    value={smsSurveyData.event_name}
                    onChange={handleSmsSurveyChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={`selectFormDropdown ${isActive ? 'event-type' : ''}`}>
                  <OfficerAutocomplete
                    placeholder="Please type your event type"
                    id="Event Type"
                    type="text"
                    idTextField="event type"
                    label="Event Type"
                    name="event_type"
                    options={getEvent}
                    freeSolo
                    click={onClickDropdown}
                    focusElement={focusEvent}
                    onInputChange={(event, newInputValue) => {
                      setEventTypeData({
                        ...eventTypeData,
                        eventtype: newInputValue
                      })
                      setFocusEvent(true)
                    }}
                    onChange={(event, newValue) => {
                      if (newValue !== undefined && newValue != null) {
                        setSmsSurveyData({
                          ...smsSurveyData,
                          eventtype: newValue.id
                        })
                      }
                    }}
                    getOptionLabel={option => (option.eventtype ? option.eventtype : '')}
                    getOptionSelected={(option, value) => {
                      if (value === '') {
                        return true
                      } else if (value === option) {
                        return true
                      }
                    }}
                  />
                </Grid>
                <Grid className="uploadCsvBtn" item xs={12} sm={12} md={12}>
                  <OfficerButton
                    buttonName=" Add Event"
                    showSpinnerProp={showSpinnerEvent}
                    color="officer"
                    variant="medium"
                    align="center"
                    startIcon={<AddCircleOutlineIcon />}
                    click={AddEvent}
                  />
                </Grid>
                <Grid className="topSpaceHide" item xs={12} sm={6} md={6}>
                  <OfficerAutocomplete
                    label="Disposition"
                    id="Disposition"
                    options={dispostion}
                    placeholder="Not Arrested"
                    name="dispostion"
                    onChange={(event, newValue) => {
                      if (newValue !== undefined) {
                        setSmsSurveyData({
                          ...smsSurveyData,
                          dispostion: newValue
                        })
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
                <Grid className="topSpaceHide" item xs={12} sm={6} md={6}>
                  <OfficerAutocomplete
                    id="Citizen Role"
                    label="Citizen Role"
                    options={citizen_ship}
                    placeholder="Choose citizen role "
                    name="citizen_ship"
                    onChange={(event, newValue) => {
                      if (newValue !== undefined) {
                        setSmsSurveyData({
                          ...smsSurveyData,
                          citizen_ship: newValue
                        })
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
            </>
          }
        />
      </Grid>
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
  )
}

export default CreateNewEvent
