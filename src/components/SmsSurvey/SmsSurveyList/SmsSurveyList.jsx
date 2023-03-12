/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PropTypes from 'prop-types'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import React, { useEffect, useState } from 'react'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline'
import { deleteAPIWrapper, patchAPIWrapper } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerDialog from '../../Common/OfficerDialog'
import OfficerTable from '../../Common/OfficerTable'
import CloseIcon from '@material-ui/icons/Close'
import { smsSurveyUrl } from '../../../utils/apiUrls'
import { OfficerHeading, TableBody } from '../../Officers/OfficerList/OfficerListStyle'
import CreateNewEvent from '../New Event/CreateNewEvent'
import UpdateEvent from '../UpdateEvent.jsx/UpdateEvent'
import { createFormDataObject } from '../../../utils/helpers'

const OfficerList = ({ setSmsSurvey, smsSurvey, tableLoadSpinner, fetchSmsSurveyAPI }) => {
  OfficerList.propTypes = {
    setSmsSurvey: PropTypes.func.isRequired,
    smsSurvey: PropTypes.any.isRequired,
    tableLoadSpinner: PropTypes.func.isRequired,
    fetchSmsSurveyAPI: PropTypes.func.isRequired
  }

  const handleChangePage = newPage => {
    setPage(newPage)
  }
  const pageLimit = 15
  const [page, setPage] = useState(1)
  const [officerListData, setOfficerListData] = useState([])
  const [showSpinnerOfficer, setshowSpinnerOfficer] = useState(false)
  const [openDeleteOfficer, setOpenDeleteSmsSurveys] = useState(false)
  const [currentSelectedSmsSurveys, setCurrentSelectedSmsSurveys] = useState({})
  const [openDialog, setOpenDialog] = useState(false)

  const handleClickOpen = smsSurveys => {
    setCurrentSelectedSmsSurveys(smsSurveys)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleActive = async (id, smsSurveys) => {
    try {
      const formData = createFormDataObject({
        status: !smsSurveys.status,
        event_name: smsSurveys.event_name,
        eventtype: smsSurveys.eventtype.id
      })
      const res = await patchAPIWrapper(`/${smsSurveyUrl}${smsSurveys.id}/`, formData)
      if (res) {
        fetchSmsSurveyAPI()
      }
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    const list = []
    smsSurvey.data.map(smsSurveys => {
      const render = []
      render.push(<TableBody>{smsSurveys.eventtype.eventtype}</TableBody>)
      render.push(<TableBody>{smsSurveys.smssend}</TableBody>)
      render.push(
        <TableBody>
          {smsSurveys.smssend !== 0 ? Math.floor((smsSurveys.sms_click_count / smsSurveys.smssend) * 100) + '%' : '--'}
        </TableBody>
      )
      render.push(
        <TableBody>
          {smsSurveys.smssend !== 0 ? Math.ceil((smsSurveys.sms_submit_count / smsSurveys.smssend) * 100) + '%' : '--'}
        </TableBody>
      )
      render.push(
        <TableBody className={smsSurveys.status ? 'statusButton' : 'statusButton paused'}>
          {smsSurveys.status ? 'Activated' : 'Pause'}
        </TableBody>
      )
      render.push(
        <div className="actionBtnWrapper" align="center">
          <Grid spacing={1} display="flex" justifyContent="center" direction="row" container>
            <>
              <Box component={Grid} item>
                <OfficerButton
                  buttonName="Edit"
                  color="secondary"
                  variant="small"
                  startIcon={<EditIcon />}
                  click={() => handleClickOpen(smsSurveys)}
                />
              </Box>
              <Box component={Grid} item>
                {smsSurveys.status ? (
                  <OfficerButton
                    buttonName="Pause"
                    color="officer"
                    variant="small"
                    startIcon={<PauseCircleOutlineIcon />}
                    click={() => handleActive(smsSurveys.id, smsSurveys)}
                  />
                ) : (
                  <OfficerButton
                    buttonName="Activate"
                    color="primary"
                    variant="small"
                    startIcon={<PlayCircleOutlineIcon />}
                    click={() => handleActive(smsSurveys.id, smsSurveys)}
                  />
                )}
              </Box>
              <Box component={Grid} item>
                <OfficerButton
                  buttonName="Delete"
                  color="danger"
                  variant="small"
                  startIcon={<DeleteIcon />}
                  click={() => handleOpenDeleteSmsSurvey(smsSurveys)}
                />
              </Box>
            </>
          </Grid>
        </div>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }, [smsSurvey])

  const onClickDeleteOfficer = async () => {
    setshowSpinnerOfficer(true)
    const res = await deleteAPIWrapper(`${smsSurveyUrl}${currentSelectedSmsSurveys.id}`)
    if (!res.isError) {
      const updatedOfficersList = smsSurvey.data.filter(smsSurveys => smsSurveys.id !== currentSelectedSmsSurveys.id)
      setSmsSurvey(updatedOfficersList)
      setshowSpinnerOfficer(false)
      setOpenDeleteSmsSurveys(false)
      fetchSmsSurveyAPI()
    } else setshowSpinnerOfficer(false)
  }

  const handleOpenDeleteSmsSurvey = smsSurveys => {
    setCurrentSelectedSmsSurveys(smsSurveys)
    setOpenDeleteSmsSurveys(true)
  }
  const handleCloseDeleteSmsSurveys = () => {
    setOpenDeleteSmsSurveys(false)
  }

  return (
    <div className="surveyTableWrapper">
      <div className="flex-space-between sec-heading-title">
        <OfficerHeading>All SMS Surveys</OfficerHeading>
        <CreateNewEvent fetchSmsSurveyAPI={fetchSmsSurveyAPI} />
      </div>
      <OfficerTable
        showSpinner={tableLoadSpinner}
        headers={['Event Type', 'SMS Sent', 'Click Rate', 'Submit Rate', 'Status', '']}
        data={officerListData}
        pagination
        onChangePage={handleChangePage}
        pageLimit={pageLimit}
        disableNext={smsSurvey.links.next == null}
        disablePrevious={smsSurvey.links.previous == null}
        totalCount={smsSurvey.total}
        page={page}
      />
      {openDialog && (
        <UpdateEvent
          openDialog={openDialog}
          handleClose={handleClose}
          currentSelectedSmsSurveys={currentSelectedSmsSurveys}
          setOpenDialog={setOpenDialog}
          fetchSmsSurveyAPI={fetchSmsSurveyAPI}
        />
      )}
      <OfficerDialog
        open={openDeleteOfficer}
        onClose={handleCloseDeleteSmsSurveys}
        style={{ color: 'blue !important' }}
        className="createEventPopupDeleteWrapper"
        actions={
          <>
            <div className="d-flex">
              <div className="pr-3">
                <OfficerButton
                  buttonName="cancel"
                  color="secondary"
                  variant="large"
                  click={handleCloseDeleteSmsSurveys}
                />
              </div>
              <OfficerButton
                buttonName="Delete"
                color="danger"
                variant="large"
                click={onClickDeleteOfficer}
                showSpinnerProp={showSpinnerOfficer}
              />
            </div>
          </>
        }
        content={
          <>
            <CloseIcon className="closeIcon" onClick={handleCloseDeleteSmsSurveys} />
            <p className="d-flex justify-content-center">
              Are you sure that you want
              <br />
              delete this survey?
            </p>
          </>
        }
      />
    </div>
  )
}
export default OfficerList
