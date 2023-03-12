/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { getAPI, patchAPIWrapper } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton'
import PropTypes from 'prop-types'
import { getEventType, smsSurveyUrl } from '../../../utils/apiUrls'
import { OfficerAutocomplete, OfficerDialog, OfficerInputField, OfficerLoader } from '../../Common'
import CloseIcon from '@material-ui/icons/Close'
import { createFormDataObject } from '../../../utils/helpers'

const UpdateEvent = ({ currentSelectedSmsSurveys, setOpenDialog, fetchSmsSurveyAPI, openDialog, handleClose }) => {
  UpdateEvent.propTypes = {
    currentSelectedSmsSurveys: PropTypes.func.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
    fetchSmsSurveyAPI: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
  }

  const dispostion = ['Not Arrested', 'Arrested']
  const citizen_ship = ['Victim', 'Subject', 'Caller', 'Witness', 'Suspect']

  const [surveyData, setSurveyData] = useState({
    eventtype: '',
    dispostion: '',
    citizen_ship: '',
    event_name: '',
    from_field: ''
  })

  const [showSpinner, setShowSpinner] = useState(false)
  const [fetchingUpdate, setFetchingUpdate] = useState(false)
  const [eventTypeData, setEventTypeData] = useState({ id: '', eventtype: '' })

  const fetchSurveyDetails = async () => {
    const response = await getAPI(`${smsSurveyUrl}${currentSelectedSmsSurveys.id}`)
    if (!response.isError) {
      setFetchingUpdate(false)
      setSurveyData({
        event_type_name: currentSelectedSmsSurveys.eventtype.eventtype
          ? currentSelectedSmsSurveys.eventtype.eventtype
          : '',
        eventtype: currentSelectedSmsSurveys.eventtype.eventtype ? currentSelectedSmsSurveys.eventtype.id : null,
        dispostion: currentSelectedSmsSurveys.dispostion,
        citizen_ship: currentSelectedSmsSurveys.citizen_ship,
        event_name: currentSelectedSmsSurveys.event_name,
        from_field: currentSelectedSmsSurveys.from_field,
        status: currentSelectedSmsSurveys.status
      })
      const newToDo = {
        eventtype: (delete currentSelectedSmsSurveys.eventtype['department'], currentSelectedSmsSurveys.eventtype)
      }
      setEventTypeData(newToDo.eventtype)
    }
  }

  const [getEvent, setGetEvent] = useState([])

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
    fetchSurveyDetails()
  }, [])

  const updateOfficer = async () => {
    setShowSpinner(true)
    const formData = createFormDataObject(surveyData)
    const res = await patchAPIWrapper(`/${smsSurveyUrl}${currentSelectedSmsSurveys.id}/`, formData)
    if (!res.isError) {
      setShowSpinner(false)
      setOpenDialog(false)
      fetchSmsSurveyAPI()
    } else {
      setShowSpinner(false)
    }
  }

  const handlesurveyDataChange = e => {
    const { value, name } = e.target
    setSurveyData({
      ...surveyData,
      [name]: value
    })
  }

  return (
    <>
      <div>
        <OfficerLoader isFetching={fetchingUpdate}>
          <OfficerDialog
            open={openDialog}
            fullWidth
            className="createEventPopupWrapper"
            maxWidth={'md'}
            onClose={handleClose}
            title="Edit SMS Survey"
            actions={
              <>
                <div className="eventPopupButtonWrapper">
                  <div className="cancel-btn">
                    <OfficerButton buttonName="Cancel" color="secondary" variant="medium" click={handleClose} />
                  </div>

                  <div className="pl-2">
                    <OfficerButton
                      showSpinnerProp={showSpinner}
                      click={updateOfficer}
                      buttonName="Save"
                      color="primary"
                      variant="medium"
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
                      id="Event Name"
                      type="text"
                      label="From"
                      name="from_field"
                      value={surveyData.from_field}
                      onChange={handlesurveyDataChange}
                    />
                    <OfficerInputField
                      placeholder="Please type your event Name"
                      required
                      id="Event Name"
                      type="text"
                      label="Event Name"
                      name="event_name"
                      value={surveyData.event_name}
                      onChange={handlesurveyDataChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <OfficerAutocomplete
                      placeholder="Please type your event type"
                      id="Event Type"
                      required
                      options={getEvent}
                      label="Event Type"
                      value={eventTypeData}
                      onChange={(event, newValue) => {
                        if (newValue !== undefined) {
                          if (newValue)
                            setSurveyData({
                              ...surveyData,
                              eventtype: newValue.id
                            })
                          else
                            setSurveyData({
                              ...surveyData,
                              eventtype: ''
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
                  <Grid item xs={12} sm={6} md={6}>
                    <OfficerAutocomplete
                      label="Disposition"
                      id="Disposition"
                      options={dispostion}
                      placeholder="Not Arrested"
                      value={surveyData.dispostion}
                      onChange={(event, newValue) => {
                        if (newValue !== undefined) {
                          if (newValue)
                            setSurveyData({
                              ...surveyData,
                              dispostion: newValue
                            })
                          else
                            setSurveyData({
                              ...surveyData,
                              dispostion: ''
                            })
                        }
                      }}
                      getOptionLabel={option => (option ? option : '')}
                      getOptionSelected={() => {
                        return true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <OfficerAutocomplete
                      label="Citizen Role"
                      id="Citizen Role"
                      placeholder="Choose citizen role "
                      options={citizen_ship}
                      value={surveyData.citizen_ship}
                      onChange={(event, newValue) => {
                        if (newValue !== undefined) {
                          if (newValue)
                            setSurveyData({
                              ...surveyData,
                              citizen_ship: newValue
                            })
                          else
                            setSurveyData({
                              ...surveyData,
                              citizen_ship: ''
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
        </OfficerLoader>
      </div>
    </>
  )
}
export default UpdateEvent
