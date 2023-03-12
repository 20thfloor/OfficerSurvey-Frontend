/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@material-ui/core/Box'
import React, { useEffect, useState } from 'react'
import { getAPI, putAPIWrapper } from '../../../utils/api'
import { useHistory, useParams } from 'react-router-dom'
import OfficerLoader from '../../Common/OfficerLoader'
import { Grid } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton'
import { callBackUrl } from '../../../utils/apiUrls'
import PropTypes from 'prop-types'
import CloseIcon from '@material-ui/icons/Close'
import './callBackStyles.css'
import { dateToLocalString } from '../../../utils/helpers'
import { Notes, DateChip, ReviewedBy, CallbackNotes } from '../CallbackStyle'
import { OfficerAutocomplete, OfficerCard, OfficerDialog } from '../../Common'
import { TextArea } from '../../Common/OfficerInputField/OfficerFieldStyle'

const CallBackDetail = props => {
  CallBackDetail.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const status = [
    { name: 'Resolved', value: 'Reviewed' },
    { name: 'Not Resolved', value: 'Requested' }
  ]

  const [showSpinner, setShowSpinner] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [showPostSpinner, setShowPostSpinner] = useState(false)
  const [newData, setNewData] = useState({
    notes: '',
    status: null
  })
  const [callBackData, setCallbackData] = useState({
    survey: {
      officer: {
        first_name: '',
        last_name: ''
      },
      notes: []
    }
  })

  const history = useHistory()
  const { callbackId } = useParams()

  const handleClose = () => {
    setOpenDialog(false)
  }

  const fetchCallBackAPI = async () => {
    setShowSpinner(true)
    const response = await getAPI(`${callBackUrl}${callbackId}`)
    if (!response.isError) {
      setShowSpinner(false)
      setCallbackData(response.data.data.data)
    }
  }
  useEffect(() => {
    fetchCallBackAPI()
  }, [])

  const changeStatus = async id => {
    setShowPostSpinner(true)
    const response = await putAPIWrapper(`${callBackUrl}${id}/`, newData)
    if (!response.isError) {
      setShowPostSpinner(false)
      setOpenDialog(false)
      // setCallback(response.data.data.data)
      props.notify(response.data.data.message, 'success')
      // history.push(`call-back/${id}`)
    } else {
      setShowPostSpinner(false)
      props.notify(response.error.message, 'error')
    }
  }

  const handleNoteChange = e => {
    const { value } = e.target
    setNewData({
      ...newData,
      notes: value
    })
  }

  return (
    <div className="py-2">
      <OfficerLoader isFetching={showSpinner}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6} sm={6}>
            <CallbackNotes className="d-flex justify-content-end align-items-center pt-3">Callback Notes</CallbackNotes>
          </Grid>
          <Grid item xs={6} sm={6} className="add-notes-review-survey">
            <div className="add-notes-survey mr-2">
              <OfficerButton
                buttonName="Add Notes"
                color="officer"
                variant="medium"
                align="right"
                click={() => {
                  setOpenDialog(true)
                }}
              />
            </div>
            <OfficerButton
              buttonName="Review Survey"
              color="primary"
              variant="medium"
              align="right"
              click={() => {
                history.push(`/response-details/${callBackData.survey.id}`)
              }}
            />
          </Grid>
        </Grid>
        <Box p={2} display="flex" flexDirection="column" alignItems="center">
          <Grid container>
            <Grid item xs={12} sm={12}>
              {callBackData &&
                callBackData.notes &&
                callBackData.notes.map((item, count) => (
                  <div key={`count-callback${count + 2}`}>
                    <Grid container>
                      <Grid item xs={12} sm={12}>
                        <div className="d-flex justify-content-start  pt-3 pb-1">
                          <DateChip>{dateToLocalString(item.created_at)} </DateChip>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <OfficerCard>
                          <Notes>{item.notes_by_supervivor}</Notes>
                        </OfficerCard>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <div className="d-flex justify-content-end">
                          <ReviewedBy>
                            ~ {item.reviewed_by_supervisor.first_name && item.reviewed_by_supervisor.first_name}{' '}
                            {item.reviewed_by_supervisor.last_name && item.reviewed_by_supervisor.last_name}
                          </ReviewedBy>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={3} />
                    </Grid>
                  </div>
                ))}
            </Grid>
          </Grid>
        </Box>
      </OfficerLoader>
      <OfficerDialog
        open={openDialog}
        onClose={handleClose}
        title="Update Callback Status"
        className="callbackContentWrapper"
        actions={
          <div className="eventPopupButtonWrapper">
            <div className="">
              <OfficerButton buttonName="Cancel" color="secondary" variant="small" click={handleClose} />
            </div>
            <OfficerButton
              buttonName="Add"
              color="primary"
              variant="small"
              click={() => {
                changeStatus(callbackId)
                setTimeout(() => {
                  fetchCallBackAPI()
                }, 2000)
              }}
              showSpinnerProp={showPostSpinner}
              disabled={!newData.notes}
            />
          </div>
        }
        content={
          <Grid container spacing={3}>
            <CloseIcon className="closeIcon" onClick={handleClose} />
            <Grid item xs={12} sm={12}>
              <TextArea
                placeholder="Enter Notes"
                required
                id="Notes"
                type="text"
                name="first_name"
                onChange={handleNoteChange}
                value={newData.notes}
              />
            </Grid>
            <Grid className="dropdownCustomField" item xs={12} sm={12}>
              <OfficerAutocomplete
                id="combo-box-callback-status"
                options={status}
                label="Status *"
                placeholder="Enter Status"
                getOptionLabel={option => (option.name ? option.name : '')}
                onChange={(event, newValue) => {
                  if (newValue !== undefined) {
                    if (newValue)
                      setNewData({
                        ...newData,
                        status: newValue.value,
                        status_show: newData.name
                      })
                  }
                }}
              />
            </Grid>
          </Grid>
        }
      />
    </div>
  )
}
export default CallBackDetail
