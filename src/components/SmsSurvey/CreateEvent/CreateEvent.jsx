/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { OfficerAutocomplete, OfficerButton, OfficerDialog, OfficerInputField } from '../../Common'
import { OfficerHeading } from '../../Officers/OfficerList/OfficerListStyle'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
import './CreateEventStyle.css'
import checkmarkF from '../../../assets/checkmarkF.png'
import { createFormDataObject } from '../../../utils/helpers'
import { addEventType, smsSurveyUrl } from '../../../utils/apiUrls'
import { postAPIFormDataWrapper } from '../../../utils/api'
import { useSelector } from 'react-redux'

const CreateEvent = ({ fetchSmsSurveyAPI, fetchEventTypeAPI, getEvent }) => {
  CreateEvent.propTypes = {
    fetchSmsSurveyAPI: PropTypes.func.isRequired,
    getEvent: PropTypes.func.isRequired,
    fetchEventTypeAPI: PropTypes.func.isRequired
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

  const [openUploadF, setOpenUploadF] = useState(false)
  const [eventType, setEventType] = useState({
    eventtype: '',
    department: dept_id
  })

  useEffect(() => {
    setSmsSurveyData({
      department: dept_id
    })
    setEventType({
      department: dept_id
    })
  }, [dept_id])

  const handleCloseUploadF = () => {
    setOpenUploadF(false)
  }

  const [showSpinner, setShowSpinner] = useState(false)
  const [showSpinnerEvent, setShowSpinnerEvent] = useState(false)
  const [smsSurveyData, setSmsSurveyData] = useState({
    event_type: '',
    dispostion: '',
    citizen_ship: '',
    event_name: '',
    from_field: '',
    department: dept_id
  })

  useEffect(() => {
    fetchEventTypeAPI()
  }, [])

  const AddEvent = async () => {
    setShowSpinnerEvent(true)
    const formData = createFormDataObject(eventType)
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

  const [isActive, setActive] = useState(false)
  const onClickDropdown = () => {
    setActive(!isActive)
  }

  return (
    <div className="smsSurveyEventPopup">
      <Box display="flex" justifyContent="center" p={1} component={Grid} item>
        <div className="officerButtonBox" onClick={handleClickOpen}>
          <OfficerButton buttonName="Create Event" color="primary" variant="large" />
        </div>
      </Box>
      <Grid className="eventDialogContent">
        <OfficerDialog
          open={openDialog}
          fullWidth
          maxWidth={'md'}
          onClose={handleClose}
          style={{ color: 'blue !important' }}
          title="Create SMS Survey"
          className="createEventPopupWrapper"
          actions={
            <>
              <div className="eventPopupButtonWrapper">
                <OfficerButton buttonName="Cancel" color="secondary" variant="large" click={handleClose} />
                <div className="pl-2">
                  <OfficerButton
                    showSpinnerProp={showSpinner}
                    click={createSmsSurvey}
                    buttonName="Create Event"
                    color="primary"
                    variant="large"
                  />
                  <Grid>
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
                              <OfficerButton
                                click={handleCloseUploadF}
                                buttonName="Close"
                                color="danger"
                                variant="large"
                              />
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
                          </div>
                        </>
                      }
                    />
                  </Grid>
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
                    label="Event Type"
                    name="eventtype"
                    options={getEvent}
                    freeSolo
                    click={onClickDropdown}
                    focusElement={focusEvent}
                    onInputChange={(event, newInputValue) => {
                      setEventType({
                        ...eventType,
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
                    value={smsSurveyData.dispostion}
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
                    value={smsSurveyData.citizen_ship}
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
    </div>
  )
}

export default CreateEvent
