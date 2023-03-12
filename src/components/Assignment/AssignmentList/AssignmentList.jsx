import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { postAPIWrapper, putAPIWrapper, deleteAPIWrapper, getAPI } from '../../../utils/api'
import OfficerTable from '../../Common/OfficerTable'
import OfficerDialog from '../../Common/OfficerDialog'
import { districtUrl } from '../../../utils/apiUrls'
import { AssignmntHeading, TableBody, UpdateHeading } from './AssignmentStyle'
import { OfficerInputField } from '../../Common'
import { DeleteSvg, EditSvg } from '../../../utils/svgs'
import PropTypes from 'prop-types'

const AssignmentList = props => {
  const [districts, setDistricts] = useState([])

  const [districtListData, setDistrictListData] = useState([])
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [showSpinnerDistrict, setshowSpinnerDistrict] = useState(false)
  const [open, setOpen] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [addDistrict, setAddDistrict] = useState('')
  const [updateDistrict] = useState('')
  const [currentSelectedDistrict, setCurrentSelectedDistrict] = useState({})

  const fetchDistrictsAPI = async () => {
    setTableLoadSpinner(true)
    const response = await getAPI(districtUrl)
    if (!response.isError) {
      setTableLoadSpinner(false)
      setDistricts(response.data.data.data)
    }
  }

  useEffect(() => {
    fetchDistrictsAPI()
  }, [])

  AssignmentList.propTypes = {
    notify: PropTypes.func.isRequired
  }

  useEffect(() => {
    const list = []
    districts.map(district => {
      const render = []

      render.push(<TableBody>{district.name}</TableBody>)
      render.push(
        <div className="d-flex justify-content-center">
          <div className="pr-2">
            <OfficerButton
              buttonName="Update"
              color="secondary"
              variant="small"
              startIcon={<EditSvg color="#323C47" />}
              click={() => handleOpenUpdate(district)}
            />
          </div>
          <OfficerButton
            buttonName="Delete"
            color="danger"
            variant="small"
            startIcon={<DeleteSvg color="white" />}
            click={() => handleOpenDelete(district)}
          />
        </div>
      )
      list.push(render)
      return list
    })
    setDistrictListData(list)
  }, [districts])
  const onClickAdd = async () => {
    setshowSpinnerDistrict(true)
    const res = await postAPIWrapper(districtUrl, {
      name: addDistrict
    })
    if (!res.isError) {
      const districtsUpdated = [...districts, res.data.data.data]
      setDistricts(districtsUpdated)
      setshowSpinnerDistrict(false)
      setOpen(false)
      props.notify(res.data.data.message, 'success')
    } else {
      props.notify(res.error.message, 'error')
    }
  }
  const onClickUpdate = async () => {
    setshowSpinnerDistrict(true)
    const res = await putAPIWrapper(`/${districtUrl}${currentSelectedDistrict.id}/`, {
      name: currentSelectedDistrict.name
    })
    if (!res.isError) {
      const updatedDistrict = res.data.data.data
      const updatedDistrictsList = districts.map(district =>
        district.id === updatedDistrict.id ? updatedDistrict : district
      )
      setDistricts(updatedDistrictsList)
      setshowSpinnerDistrict(false)
      setOpenUpdate(false)
      props.notify(res.data.data.message, 'success')
    } else {
      props.notify(res.error.message, 'error')
    }
  }
  const onClickDelete = async () => {
    setshowSpinnerDistrict(true)
    const res = await deleteAPIWrapper(`/${districtUrl}/${currentSelectedDistrict.id}/`)
    if (!res.isError) {
      const updatedDistrictsList = districts.filter(district => district.id !== currentSelectedDistrict.id)
      setDistricts(updatedDistrictsList)
      setshowSpinnerDistrict(false)
      setOpenDelete(false)
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
  const handleOpenUpdate = district => {
    setCurrentSelectedDistrict(district)
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const handleOpenDelete = district => {
    setCurrentSelectedDistrict(district)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }
  return (
    <div>
      <AssignmntHeading className="d-flex justify-content-center">Assignment</AssignmntHeading>
      <div className="d-flex justify-content-end mb-2">
        <OfficerButton buttonName="Add Assignment" color="primary" variant="medium" click={handleOpen} />
      </div>
      <Grid container direction="row">
        <Grid item xs={12} sm={12}>
          <OfficerTable showSpinner={tableLoadSpinner} headers={['Name', 'Action']} data={districtListData} />
        </Grid>
      </Grid>
      <OfficerDialog
        open={open}
        onClose={handleClose}
        style={{ color: 'blue !important' }}
        actions={
          <div className="pb-3 d-flex">
            <OfficerButton
              buttonName="Add"
              color="secondary"
              variant="small"
              click={onClickAdd}
              disabled={addDistrict.length < 3}
              showSpinnerProp={showSpinnerDistrict}
            />
            <div className="px-3">
              <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleClose} />
            </div>
          </div>
        }
        content={
          <>
            <UpdateHeading> Add Assignment</UpdateHeading>

            <OfficerInputField
              placeholder="Enter Assignment Name"
              id="Enter District Name"
              name="district"
              value={addDistrict}
              onChange={event => setAddDistrict(event.target.value)}
              error={addDistrict.length > 0 && addDistrict.length < 3}
              label="Enter Assignment Name"
            />
          </>
        }
      />
      <OfficerDialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        style={{ color: 'blue !important' }}
        actions={
          <div className="pb-3 d-flex">
            <OfficerButton
              buttonName="Update"
              color="secondary"
              variant="small"
              click={onClickUpdate}
              showSpinnerProp={showSpinnerDistrict}
              disabled={currentSelectedDistrict.length < 3}
            />
            <div className="px-3">
              <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleCloseUpdate} />
            </div>
          </div>
        }
        content={
          <>
            <UpdateHeading> Update Assignment</UpdateHeading>
            <div className="w-100">
              <OfficerInputField
                variant="outlined"
                color="primary"
                placeholder="Enter Assignment Name"
                id="Enter District Name"
                name="district"
                label="Enter Assignment Name"
                value={currentSelectedDistrict.name}
                onChange={event =>
                  setCurrentSelectedDistrict({
                    ...currentSelectedDistrict,
                    name: event.target.value
                  })
                }
                error={updateDistrict.length > 0 && updateDistrict.length < 3}
              />
            </div>
          </>
        }
      />
      <OfficerDialog
        open={openDelete}
        onClose={handleCloseDelete}
        style={{ color: 'blue !important' }}
        actions={
          <div className="pb-3 d-flex pt-2">
            <OfficerButton
              buttonName="Yes"
              color="secondary"
              variant="small"
              click={onClickDelete}
              showSpinnerProp={showSpinnerDistrict}
            />
            <div className="px-3">
              <OfficerButton buttonName="No" color="danger" variant="small" click={handleCloseDelete} />
            </div>
          </div>
        }
        content={
          <>
            <UpdateHeading> Delete Assignment</UpdateHeading>

            <p className="d-flex justify-content-center">
              Do you want to delete &apos;
              {currentSelectedDistrict.name}
              &apos; district?
            </p>
          </>
        }
      />
    </div>
  )
}
export default AssignmentList
