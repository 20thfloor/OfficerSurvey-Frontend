/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Box, Tabs, Tab } from '@material-ui/core'
import { BASE_URL, getAPI, postAPIWrapper, deleteAPIWrapper, putAPIWrapper } from '../../../utils/api'
import { useParams, useHistory } from 'react-router-dom'
import OfficerTable from '../../Common/OfficerTable/OfficerTable'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerImage from '../../Common/OfficerImage/OfficerImage'
import OfficerDountGraph from '../../Common/OfficerDountGraph'
import OfficerDistributedBarGraph from '../../Common/OfficerDistributedBarGraph'
import { convertDateToFormatedString, dateToLocalString } from '../../../utils/helpers'
import DateRangeSelector from '../../Common/DateRangeSelector'
import { getUserId, getIsSupervisor } from '../../../utils/localStorage'
import SurveyStatus from '../../Common/SurveyStatus/SurveyStatus'
import OfficerDialog from '../../Common/OfficerDialog'
import './officerDetails-styles.css'
import {
  surveyResponseOfficerUrl,
  officersUrl,
  officerLogsUrl,
  notesUrl,
  updateNotesUrl,
  officerNotesUrl,
  addOfficerNotesUrl
} from '../../../utils/apiUrls'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { setStartDate, setEndDate } from '../../../redux/actions'
import { OfficerCard, OfficerInputField, StarMarker } from '../../Common'
import {
  TableBody,
  ExportBtnExternal,
  PublicScore,
  ProfileName,
  PublicSentiment,
  PublicScoreText,
  NotesHeading,
  Add,
  StarText,
  StarDiv
} from './OfficerDetailsStyle'
import { DeleteSvg, EditSvg } from '../../../utils/svgs'
import PropTypes from 'prop-types'
import { QRCodeCanvas } from 'qrcode.react'
import { Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  TabPanel.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    index: PropTypes.any.isRequired
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const OfficerDetails = props => {
  OfficerDetails.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const pageLimit = 5
  const [officerData, setOfficerData] = useState({
    links: {
      next: null,
      previous: null
    },
    data: [],
    pie_chart: []
  })

  const startDate = useSelector(state => state.date.start_date)
  const endDate = useSelector(state => state.date.end_date)
  const [query, setQuery] = useState({
    page: 1,
    page_size: pageLimit,
    start_date: convertDateToFormatedString(startDate),
    end_date: convertDateToFormatedString(endDate)
  })
  const dispatch = useDispatch()

  const [officerTableData, setOfficerTableData] = useState([])
  const [officerLogData, setOfficerLogData] = useState([])
  const [notesData, setNotesData] = useState([])
  const [notes, setNotes] = useState([])
  const [avgRating, setAvgRating] = useState([])
  const [fetching, setFetching] = useState(true)
  const [createdAt, setCreatedAt] = useState([])
  const [selectedRating, setSelectedRating] = useState(-1)
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [showSpinnerNotes, setShowSpinnerNotes] = useState(false)
  const [inputNotes, setInputNotes] = useState('')
  const [officerLog, setOfficerLog] = useState([])
  const [value, setValue] = React.useState(0)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [officerSurveyId, setOfficerSurveyId] = useState('')
  const [officerProfile, setOfficerProfile] = useState({
    user: {
      profile_pic: ''
    }
  })
  const [selectedNote, setSelectedNotes] = useState({})
  const [open, setOpen] = useState(false)
  const [percentage, setPercentage] = useState()
  const [modalShow, setModalShow] = React.useState(false)

  let { detailIdOfficer } = useParams()
  const history = useHistory()
  const fetchOfficerDetails = async () => {
    const detailsOfficerId = await getUserId()
    //let detailsOfficerId = await getLocalStorageUserId()
    detailIdOfficer === undefined && (detailIdOfficer = detailsOfficerId)
    setFetching(true)
    setTableLoadSpinner(true)
    const response = await getAPI(`${surveyResponseOfficerUrl}${detailIdOfficer}`, query, {
      date_now: moment().utc().format('MM-DD-YYYY HH:mm a')
    })
    const data = response.data.data
    if (!response.isError) {
      const temp = (data.avg_rating * 100) / 5
      setPercentage(temp.toFixed(0))
      setTableLoadSpinner(false)
      setFetching(false)
      setOfficerData(data)
      const RatingArray = data.line_graph.map(item => item.rating__avg)
      const DateArray = data.line_graph.map(item => item.created_at__date.substring(0, 10))
      setAvgRating(RatingArray)
      setCreatedAt(DateArray)
    }
  }
  const Color = ['#F4CB5F', '#66AEC0', '#9654F7', '#DD4D41', '#7EDABC', '#61AC6D']

  const fetchOfficer = async () => {
    const officerId = await getUserId()
    if (detailIdOfficer === undefined) {
      detailIdOfficer = officerId
    }
    const res = await getAPI(`${officersUrl}${detailIdOfficer}`)
    if (!res.isError) {
      setOfficerProfile(res.data.data.data)
      setOfficerSurveyId(res.data.data.data.link)
    }
  }
  const fetchOfficerLogs = async () => {
    const res = await getAPI(`${officerLogsUrl}${detailIdOfficer}`)

    !res.isError && setOfficerLog(res.data.data.data)
  }

  const fetchNotes = async () => {
    const supervisor = await getIsSupervisor()
    if (supervisor === true) {
      const res = await getAPI(`${officerNotesUrl}/${detailIdOfficer}/`)
      !res.isError && setNotesData(res.data.data.data)
    } else {
      const res = await getAPI(`${notesUrl}/`)
      !res.isError && setNotesData(res.data.data.data)
    }
  }

  const addNotes = async () => {
    const supervisor = await getIsSupervisor()
    setShowSpinnerNotes(true)
    if (supervisor === true) {
      const res = await postAPIWrapper(`${addOfficerNotesUrl}/${detailIdOfficer}`, {
        notes: inputNotes
      })
      if (!res.isError) {
        const notesUpdated = [res.data.data.data, ...notesData]
        setNotesData(notesUpdated)
        setShowSpinnerNotes(false)
        setOpen(false)
        props.notify(res.data.data.message, 'success')
      } else {
        props.notify(res.error.message, 'error')
      }
    } else {
      const res = await postAPIWrapper(notesUrl, {
        notes: inputNotes
      })
      if (!res.isError) {
        const notesUpdated = [...notesData, res.data.data.data]
        setNotesData(notesUpdated)
        setShowSpinnerNotes(false)
        setOpen(false)
        props.notify(res.data.data.message, 'success')
      } else {
        props.notify(res.error.message, 'error')
      }
    }
  }

  const deleteNotes = async () => {
    setShowSpinnerNotes(true)
    const res = await deleteAPIWrapper(`${notesUrl}/${selectedNote.id}`)
    if (!res.isError) {
      const updatedNotesList = notesData.filter(note => note.id !== selectedNote.id)
      setNotesData(updatedNotesList)
      setShowSpinnerNotes(false)
      setOpenDelete(false)
      props.notify(res.data.data.message, 'success')
    } else {
      props.notify(res.error.message, 'error')
    }
  }

  const updateNotes = async () => {
    setShowSpinnerNotes(true)
    const res = await putAPIWrapper(`${updateNotesUrl}${selectedNote.id}`, {
      notes: selectedNote.notes
    })
    if (!res.isError) {
      const NotesList = res.data.data.data
      const updatedNotesList = notesData.map(note => (note.id === NotesList.id ? NotesList : note))
      setNotesData(updatedNotesList)
      setShowSpinnerNotes(false)
      setOpenUpdate(false)
      props.notify(res.data.data.message, 'success')
    } else {
      props.notify(res.error.message, 'error')
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenDelete = note => {
    setSelectedNotes(note)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const handleOpenUpdate = note => {
    setSelectedNotes(note)
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }

  useEffect(() => {
    fetchOfficer()
    fetchOfficerLogs()
    fetchNotes()
  }, [])

  useEffect(() => {
    if (selectedRating === -1) {
      var obj = query
      delete obj.rating
      setQuery({ ...obj })
    } else {
      setQuery({
        ...query,
        rating: selectedRating
      })
    }
  }, [selectedRating])

  useEffect(() => {
    if (query.start_date) fetchOfficerDetails()
  }, [query])

  useEffect(() => {
    const list = []

    officerData.data.map(surveyResponse => {
      const render = []
      render.push(
        <TableBody>
          {surveyResponse.first_name}&nbsp;{surveyResponse.last_name}
        </TableBody>
      )

      render.push(<TableBody>{dateToLocalString(surveyResponse.created_at)}</TableBody>)
      render.push(<TableBody>{surveyResponse.rating}</TableBody>)
      render.push(<SurveyStatus surveyResponse={surveyResponse} />)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="View"
            color="secondary"
            variant="small"
            click={() => {
              history.push(`/response-details/${surveyResponse.id}`)
            }}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerTableData(list)
  }, [officerData])

  useEffect(() => {
    const notesList = []
    notesData.map(note => {
      const render = []
      render.push(<TableBody>{note.notes_by.first_name + '  ' + note.notes_by.last_name}</TableBody>)
      render.push(<TableBody>{dateToLocalString(note.created_at)}</TableBody>)
      render.push(<TableBody>{note.notes}</TableBody>)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="Update"
            color="secondary"
            variant="small"
            startIcon={<EditSvg color="#323C47" />}
            click={() => handleOpenUpdate(note)}
          />
        </Grid>
      )
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="Delete"
            color="danger"
            variant="small"
            startIcon={<DeleteSvg color="white" />}
            click={() => handleOpenDelete(note)}
          />
        </Grid>
      )
      notesList.push(render)
      return notesList
    })
    setNotes(notesList)
  }, [notesData])
  const downloadQR = () => {
    const canvas = document.getElementById('123456')
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'qr.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  useEffect(() => {
    const list_logs = []

    officerLog.map(logs => {
      const render = []
      render.push(<TableBody>{dateToLocalString(logs.created_at)}</TableBody>)
      render.push(<TableBody>{logs.in_training ? 'Acknowledged' : 'Reviewed'}</TableBody>)
      render.push(
        <TableBody>
          {logs.supervisor.first_name && logs.supervisor.first_name}
          {''}
          {logs.supervisor.last_name && logs.supervisor.last_name}
        </TableBody>
      )
      list_logs.push(render)
      return list_logs
    })
    setOfficerLogData(list_logs)
  }, [officerLog])

  const handleChangePage = newPage => {
    setQuery({
      ...query,
      page: newPage
    })
  }

  const onDateSelect = (startDate, endDate) => {
    dispatch(setStartDate(startDate))
    dispatch(setEndDate(endDate))

    const startDateStr = convertDateToFormatedString(startDate)
    const endDateStr = convertDateToFormatedString(endDate)

    if (startDateStr === endDateStr) {
      return
    }

    setQuery({
      ...query,
      start_date: startDateStr,
      end_date: endDateStr
    })
  }
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const getTabClass = index => {
    let tabClass = ''
    tabClass = value === index ? 'tabClass tabclassColorOne' : 'tabClass tabclassColorTwo'

    return tabClass
  }

  return (
    <>
      <Grid container direction="row" component="div" spacing={1}>
        <Grid item xs={12} sm={12}>
          <OfficerCard>
            <div className="d-flex align-items-center">
              <Box p={2} component={Grid} item sm={3}>
                <Box display="flex">
                  <OfficerImage
                    width="70px"
                    height="70px"
                    imageStyle={{ borderRadius: '50%' }}
                    borderRadius="50%"
                    url={officerProfile.user.profile_pic}
                    alt={officerProfile.badge_number + '-img'}
                  />
                  <Box alignSelf="center" ml={2}>
                    {officerProfile.first_name && (
                      <ProfileName>
                        {officerProfile.first_name} &nbsp;
                        {officerProfile.last_name}
                      </ProfileName>
                    )}
                    {officerProfile.badge_number && <ProfileName>{officerProfile.badge_number}</ProfileName>}
                  </Box>
                </Box>
              </Box>
              <Box p={2} component={Grid} item sm={9}>
                <div className="d-flex">
                  <Tabs value={value} onChange={handleChange} indicatorColor="primary">
                    <Tab label="Performance" className={getTabClass(0)} />
                    <Tab label="Early Intervention" className={getTabClass(1)} />
                    <Tab label="Notes" className={getTabClass(2)} />
                  </Tabs>
                  <div>
                    <div>
                      <DropdownButton id="dropdown-basic-button" title="Link">
                        <CopyToClipboard
                          text={`${process.env.REACT_APP_DEPLOYED_LINK}/officer-survey/${officerSurveyId}`}>
                          <Dropdown.Item>Copy Link</Dropdown.Item>
                        </CopyToClipboard>
                        <Dropdown.Item onClick={() => setModalShow(true)}>Download QR Code</Dropdown.Item>
                      </DropdownButton>
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </OfficerCard>

          <Box component={Grid} item xs={12} display="flex" flexDirection="row" justifyContent="space-between">
            {query.rating ? (
              <Box p={2} component={Grid} item xs={12}>
                <OfficerButton
                  buttonName="Clear Filter"
                  color="secondary"
                  variant="medium"
                  click={() => {
                    setSelectedRating(-1)
                  }}
                />
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>

      <TabPanel value={value} index={0}>
        <Grid container direction="row" component="div" spacing={1}>
          <Grid item xs={12} sm={8}>
            <OfficerTable
              showSpinner={tableLoadSpinner}
              headers={['Citizen Name', 'Time', 'Rating', 'Status', 'Action']}
              data={officerTableData}
              pagination
              onChangePage={handleChangePage}
              pageLimit={query.page_size}
              disableNext={officerData.links.next == null}
              disablePrevious={officerData.links.previous == null}
              totalCount={officerData.total}
              page={query.page}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{ height: '85%' }}>
              <DateRangeSelector onDateSelect={onDateSelect} startDate={startDate} endDate={endDate} />
              <OfficerCard pt="8px" pb="8px" pl="8px" pr="8px" shouldFullHeight>
                <div className="d-flex justify-content-between align-items-center">
                  <PublicSentiment>Public Sentiment Score</PublicSentiment>
                  <ExportBtnExternal>
                    <a
                      className="exportButtonInternal"
                      href={`${BASE_URL}export-data/${detailIdOfficer}/?start_date=${query.start_date}&end_date=${
                        query.end_date
                      }&hours=${moment().utcOffset()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download>
                      Export Data
                    </a>
                  </ExportBtnExternal>
                </div>
                <hr style={{ marginTop: '8px', marginBottom: '4px' }} />
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    {officerData && officerData.avg_rating > 0 ? (
                      <OfficerDountGraph
                        isFetching={fetching}
                        list={officerData.pie_chart}
                        onSelect={setSelectedRating}
                        percent={percentage}
                      />
                    ) : (
                      <div className="d-flex justify-content-around align-items-center donut-chart">
                        <strong>0%</strong>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <div className="d-flex justify-content-around h-100">
                      <div>
                        <PublicScoreText>NPS Score</PublicScoreText>
                        <PublicScore>{officerData.avg_rating}</PublicScore>
                      </div>
                      <div>
                        <PublicScoreText>Total Responses</PublicScoreText>
                        <PublicScore>{officerData.total}</PublicScore>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <div className="d-flex justify-content-around mt-2">
                  <StarDiv>
                    <StarMarker color="#E90005" />
                    <StarText>1 Star</StarText>
                  </StarDiv>
                  <StarDiv>
                    <StarMarker color="#FA9729" />
                    <StarText>2 Star</StarText>
                  </StarDiv>
                  <StarDiv>
                    <StarMarker color="#FBBD0D" />
                    <StarText>3 Star</StarText>
                  </StarDiv>
                  <StarDiv>
                    <StarMarker color="#90D04F" />
                    <StarText>4 Star</StarText>
                  </StarDiv>
                  <StarDiv>
                    <StarMarker color="#14A352" />
                    <StarText>5 Star</StarText>
                  </StarDiv>
                </div>
              </OfficerCard>
            </div>
          </Grid>

          <Grid item xs={12} sm={12}>
            <OfficerCard>
              <Grid item xs={12} sm={12}>
                <div
                  className="d-flex justify-content-center align-items-center pt-5 pb-5"
                  style={{ height: '36px', fontWeight: '700', fontSize: '24px', fontFamily: 'Poppins' }}>
                  Trends
                </div>
                <OfficerDistributedBarGraph
                  seriesName={''}
                  xaxisList={avgRating}
                  colors={Color}
                  categories={createdAt}
                  tickAmount={11}
                  min={0}
                  max={5}
                  floating={false}
                  decimalsInFloat
                />
              </Grid>
            </OfficerCard>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container direction="row" component="div" spacing={1}>
          <Grid item xs={12} sm={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <OfficerTable
                showSpinner={tableLoadSpinner}
                headers={['Date', 'Training Status', 'Supervisor']}
                data={officerLogData}
              />
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box display="flex" justifyContent="space-between">
          <NotesHeading>Notes</NotesHeading>
          <Box display="flex" alignItems="center">
            <Box display="flex" justifyContent="center" className="exportNotesButtonExternal ">
              <a
                className="exportButtonLink"
                href={`${BASE_URL}get-pdf/${detailIdOfficer}?hours=${moment().utcOffset()}`}
                target="_blank"
                rel="noopener noreferrer"
                download>
                EXPORT DATA
              </a>
            </Box>
            <OfficerButton buttonName="Add Notes" color="primary" variant="small" click={handleOpen} />
          </Box>
        </Box>
        <Grid item xs={12} lg={12} sm={12}>
          <OfficerTable
            showSpinner={tableLoadSpinner}
            headers={['Posted By', 'Posted On', 'Note', 'Edit', 'Delete']}
            data={notes}
          />
        </Grid>
        <OfficerDialog
          open={open}
          onClose={handleClose}
          actions={
            <>
              <div className="pb-3 d-flex">
                <OfficerButton
                  buttonName="Add"
                  color="secondary"
                  variant="small"
                  click={addNotes}
                  disabled={inputNotes.length < 3}
                  showSpinnerProp={showSpinnerNotes}
                />
                <div className="px-3">
                  <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleClose} />
                </div>
              </div>
            </>
          }
          content={
            <>
              <Add>Add Note</Add>
              <OfficerInputField
                placeholder="Enter Notes"
                id="enter-notes"
                name="notes"
                value={inputNotes}
                onChange={event => setInputNotes(event.target.value)}
                error={inputNotes.length > 0 && inputNotes.length < 3}
                label="Enter Notes"
                multiline
              />
            </>
          }
        />
        <OfficerDialog
          open={openDelete}
          onClose={handleCloseDelete}
          actions={
            <>
              <div className="pb-3 d-flex">
                <OfficerButton
                  buttonName="Yes"
                  color="secondary"
                  variant="small"
                  click={deleteNotes}
                  showSpinnerProp={showSpinnerNotes}
                />
                <div className="px-3">
                  <OfficerButton buttonName="No" color="danger" variant="small" click={handleCloseDelete} />
                </div>
              </div>
            </>
          }
          content={
            <>
              <Add>Delete Note</Add>

              <p className="d-flex justify-content-center">Do you want to delete Note?</p>
            </>
          }
        />
        <OfficerDialog
          open={openUpdate}
          onClose={handleCloseUpdate}
          actions={
            <>
              <div className="pb-3 d-flex">
                <OfficerButton
                  buttonName="Update"
                  color="secondary"
                  variant="small"
                  click={updateNotes}
                  showSpinnerProp={showSpinnerNotes}
                  disabled={selectedNote.length < 3}
                />
                <div className="px-3">
                  <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleCloseUpdate} />
                </div>
              </div>
            </>
          }
          content={
            <>
              <Add>Update Note</Add>

              <OfficerInputField
                placeholder="Enter Notes"
                id="enter-notes"
                name="notes"
                label="Enter Notes"
                value={selectedNote.notes}
                onChange={event =>
                  setSelectedNotes({
                    ...selectedNote,
                    notes: event.target.value
                  })
                }
              />
            </>
          }
        />
      </TabPanel>
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={modalShow}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <QRCodeCanvas
              value={`${process.env.REACT_APP_DEPLOYED_LINK}/officer-survey/${officerSurveyId}`}
              id="123456"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>
            <div onClick={downloadQR}> Download </div>
          </Button>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default OfficerDetails
