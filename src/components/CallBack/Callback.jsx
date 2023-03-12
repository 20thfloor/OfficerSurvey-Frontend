/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
import { Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getAPI, putAPIWrapper } from '../../utils/api'
import OfficerButton from '../Common/OfficerButton/OfficerButton'
import OfficerTable from '../Common/OfficerTable'
import CloseIcon from '@material-ui/icons/Close'
import { useHistory } from 'react-router-dom'
import CallbackStatus from '../Common/CallbackStatus'
import { callBackUrl } from '../../utils/apiUrls'
import OfficerImage from '../Common/OfficerImage'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import OfficerDialog from '../Common/OfficerDialog'
import { dateToLocalString } from '../../utils/helpers'
import { CallbackHeading, TableBody } from './CallbackStyle'
import { OfficerAutocomplete, OfficerInputField } from '../Common'
import PropTypes from 'prop-types'
import { OfficerHeading } from '../Officers/OfficerList/OfficerListStyle'
import { TextArea } from '../Common/OfficerInputField/OfficerFieldStyle'
import { NotesSvg, ReviewSvg } from '../../utils/svgs'

const CallBack = props => {
  CallBack.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const status = [
    { name: 'Resolved', value: 'Reviewed' },
    { name: 'Not Resolved', value: 'Requested' }
  ]
  const pageLimit = 15
  const [comment, setComment] = useState([])
  const [officerListData, setOfficerListData] = useState([])
  const [showPostSpinner, setShowPostSpinner] = useState(false)
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [count, setCount] = useState('')
  const [page, setPage] = useState(1)
  const [callBackData, setCallbackData] = useState({
    links: {
      next: null,
      previous: null
    },
    data: []
  })
  // const [callBack, setCallback] = useState({
  //   survey: {
  //     officer: {
  //       first_name: "",
  //       last_name: "",
  //     },
  //     notes: [],
  //   },
  // })
  const [callbackId, setCallbackId] = useState()
  const [newData, setNewData] = useState({
    notes: '',
    status: null
  })
  const history = useHistory()
  const fetchCitizenAPI = async () => {
    setTableLoadSpinner(true)
    const response = await getAPI(callBackUrl, {
      page: page,
      page_size: pageLimit
    })
    if (!response.isError) {
      setTableLoadSpinner(false)
      setCallbackData(response.data.data)
    }
  }

  useEffect(() => {
    fetchCitizenAPI()
  }, [])
  useEffect(() => {
    fetchCitizenAPI()
  }, [page])

  const handleChangePage = newPage => {
    setPage(newPage)
  }
  const handleClose = () => {
    setOpenDialog(false)
  }

  const [openComment, setOpenComment] = useState(false)

  const handleOpenComment = () => {
    setOpenComment(true)
  }

  const handleCloseComment = () => {
    setOpenComment(false)
  }

  const [contactDetail, setContactDetail] = useState([])
  const [openContact, setOpenContact] = useState(false)

  const handleOpenContactDetail = () => {
    setOpenContact(true)
  }

  const handleCloseContactDetail = () => {
    setOpenContact(false)
  }

  useEffect(() => {
    const list = []
    callBackData.data.map(callback => {
      const render = []
      render.push(
        <OfficerImage
          url={callback.survey.officer.user.profile_pic}
          alt={callback.survey.officer.badge_number + '-img'}
        />
      )
      render.push(
        <TableBody>
          {callback.survey.officer.first_name}
          &nbsp;
          {callback.survey.officer.last_name}
        </TableBody>
      )
      render.push(
        <TableBody>
          {callback.survey.officer.badge_number}
          <br />
          <span className="callBackDate">{dateToLocalString(callback.created_at)}</span>
        </TableBody>
      )

      render.push(
        <TableBody>
          {callback.survey.first_name}
          &nbsp;
          {callback.survey.last_name}
          <span className="btn-width-auto contactButton">
            <OfficerButton
              buttonName="contact"
              color="black"
              variant="small"
              click={() => {
                handleOpenContactDetail(callBackData.id)
                setContactDetail(callback.survey)
              }}
            />
          </span>
        </TableBody>
      )
      render.push(
        <TableBody>
          <span className="read-survey">
            <OfficerButton
              buttonName="Read"
              color="black"
              variant="small"
              click={() => {
                handleOpenComment()
                setComment(callback)
                setContactDetail(callback.survey)
              }}
            />
          </span>
        </TableBody>
      )
      render.push(
        <Grid direction="row" className="btn-width-auto" container alignItems="center" justifyContent="space-evenly">
          <OfficerButton
            buttonName=""
            color="primary"
            variant="small"
            click={() => {
              history.push(`/response-details/${callback.survey.id}`)
            }}
            startIcon={<ReviewSvg />}
          />
        </Grid>
      )
      render.push(
        callback.notes && callback.notes.length > 0 ? (
          <Grid direction="row" className="btn-width-auto" container alignItems="center" justifyContent="space-evenly">
            <OfficerButton
              startIcon={<NotesSvg />}
              buttonName=""
              color="officer"
              variant="small"
              click={() => {
                history.push(`call-back/${callback.id}`)
              }}
            />
          </Grid>
        ) : (
          <Grid direction="row" className="btn-width-auto" container alignItems="center" justifyContent="space-evenly">
            <OfficerButton
              startIcon={<AddCircleOutlineIcon />}
              buttonName=""
              color="grey"
              variant="small"
              click={() => {
                setCallbackId(callback.id)
                setOpenDialog(true)
              }}
            />
          </Grid>
        )
      )
      render.push(<CallbackStatus callback={callback} />)
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }, [callBackData])

  const changeStatus = async id => {
    setShowPostSpinner(true)
    const response = await putAPIWrapper(`${callBackUrl}${id}/`, newData)
    if (!response.isError) {
      setShowPostSpinner(false)
      setOpenDialog(false)
      // setCallback(response.data.data.data)
      props.notify(response.data.data.message, 'success')
      history.push(`call-back/${id}`)
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
    setCount(value.length)
  }

  return (
    <>
      <div className="surveyTableWrapper CallBackWrapper">
        <div className="p-2">
          <CallbackHeading className="pl-4">Citizens requesting a callback</CallbackHeading>
          <OfficerTable
            showSpinner={tableLoadSpinner}
            headers={[
              'Profile Picture',
              'Officer',
              'Badge#/Time',
              'Citizen',
              'Comment',
              'Review Survey',
              'Notes',
              'Status'
            ]}
            data={officerListData}
            pagination
            onChangePage={handleChangePage}
            pageLimit={pageLimit}
            disableNext={callBackData.links.next == null}
            disablePrevious={callBackData.links.previous == null}
            totalCount={callBackData.total}
            page={page}
          />
        </div>
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
                click={() => changeStatus(callbackId)}
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
                  maxLength={400}
                />
                <p className="float-right pt-3">
                  Max characters 400 :(
                  {count})
                </p>
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
        <div>
          <OfficerDialog
            open={openComment}
            onClose={handleCloseComment}
            style={{ color: 'blue !important' }}
            className="readCommentPopupWrapper"
            actions={
              <div>
                <OfficerButton buttonName="Close" color="secondary" variant="small" click={handleCloseComment} />
              </div>
            }
            content={
              <>
                <div className="sec-heading-title">
                  <OfficerHeading>
                    {contactDetail.first_name}
                    &nbsp; Comment
                  </OfficerHeading>
                  <CloseIcon className="closeIcon" onClick={handleCloseComment} />
                </div>
                <TextArea type="text" value={comment.comment} disabled />
              </>
            }
          />
        </div>
        <div>
          <OfficerDialog
            open={openContact}
            onClose={handleCloseContactDetail}
            style={{ color: 'blue !important' }}
            className="contact-details-wrap"
            title="Contact Info"
            actions={
              <div className="close-btn-wrap">
                <OfficerButton buttonName="Close" color="secondary" variant="small" click={handleCloseContactDetail} />
              </div>
            }
            content={
              <>
                <CloseIcon className="closeIcon" onClick={handleCloseContactDetail} />
                <OfficerInputField
                  required
                  id="Name"
                  type="text"
                  disabled
                  label="Name"
                  name="first_name"
                  value={`${contactDetail.first_name}${contactDetail.last_name}`}
                />
                <OfficerInputField
                  required
                  id="Email"
                  type="text"
                  label="Email"
                  disabled
                  name="email"
                  value={contactDetail.officer ? contactDetail.officer.user.email : undefined}
                />
                <OfficerInputField
                  required
                  id="Phone"
                  type="text"
                  disabled
                  label="Phone"
                  name="phone"
                  value={contactDetail.phone}
                />
              </>
            }
          />
        </div>
      </div>
    </>
  )
}
export default CallBack
