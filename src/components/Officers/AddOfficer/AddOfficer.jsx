import React, { useEffect, useState } from 'react'
import { Box, Grid, Switch } from '@material-ui/core'
import PropTypes from 'prop-types'
import { getAPI, postAPIFormDataWrapper } from '../../../utils/api'
import { StatesArray } from '../../../utils/Constants'
import OfficerButton from '../../Common/OfficerButton'
import OfficerDialog from '../../Common/OfficerDialog'
import DefaultProfilePic from '../../../assets/default_profile_pic.png'
import { createFormDataObject } from '../../../utils/helpers'
import { emailFormatVerification, allnumeric } from '../../../utils/helpers'
import { districtUrl, officersListUrl } from '../../../utils/apiUrls'
import { OfficerAutocomplete, OfficerCard, OfficerImageUpload, OfficerInputField } from '../../Common'
import './AddOfficerStyle.css'

const AddOfficer = props => {
  AddOfficer.propTypes = {
    notify: PropTypes.any.isRequired,
    updateCallBackProp: PropTypes.func.isRequired
  }
  const [newOfficerData, setNewOfficerData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    badge_number: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    is_supervisor: false
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const [districts, setDistricts] = useState([])
  const [imgSrc, setImgSrc] = useState()

  const fetchDistrictsAPI = async () => {
    const response = await getAPI(districtUrl)
    !response.isError && setDistricts(response.data.data.data)
  }

  useEffect(() => {
    fetchDistrictsAPI()
  }, [])

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const createOfficer = async () => {
    setShowSpinner(true)
    const formData = createFormDataObject(newOfficerData)
    const res = await postAPIFormDataWrapper(officersListUrl, formData)
    if (!res.isError) {
      setShowSpinner(false)
      setOpenDialog(false)
      props.updateCallBackProp()
      props.notify(res.data.data.message, 'success')
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }
  const handleNewOfficerDataChange = e => {
    const { value, name, files } = e.target
    setNewOfficerData({
      ...newOfficerData,
      [name]: name === 'profile_pic' ? files[0] : name === 'email' ? value.toLowerCase().replace(/\s/g, '') : value
    })
    if (name === 'profile_pic') {
      var file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      // eslint-disable-next-line no-restricted-syntax
      reader.onloadend = function () {
        setImgSrc([reader.result])
      }
    }
  }

  const onRequiredSwitchChange = (item, checked) => {
    setNewOfficerData({
      ...newOfficerData,
      is_supervisor: checked
    })
  }

  return (
    <div>
      <Box display="flex" p={1} component={Grid} item>
        <OfficerButton buttonName="Add Officer" color="primary" variant="medium" click={handleClickOpen} />
      </Box>
      <Grid>
        <OfficerDialog
          open={openDialog}
          fullWidth
          className="model-officerdailog"
          maxWidth={'md'}
          onClose={handleClose}
          style={{ color: 'blue !important' }}
          title="Add Officer"
          actions={
            <>
              <div className="py-3 d-flex">
                <OfficerButton
                  buttonName="Add Officer"
                  color="secondary"
                  variant="medium"
                  click={createOfficer}
                  showSpinnerProp={showSpinner}
                  disabled={
                    newOfficerData.first_name.length < 1 ||
                    newOfficerData.last_name.length < 1 ||
                    newOfficerData.badge_number.length < 1 ||
                    newOfficerData.password.length < 1 ||
                    (newOfficerData.zip_code ? newOfficerData.zip_code.length !== 5 : false) ||
                    (newOfficerData.phone ? !allnumeric(newOfficerData.phone) : false)
                  }
                />
                <div className="pl-2">
                  <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleClose} />
                </div>
              </div>
            </>
          }
          content={
            <>
              <Grid container direction="column" justify="center" alignItems="center">
                <Grid item xs={12} sm={8}>
                  <OfficerCard>
                    <OfficerImageUpload
                      src={imgSrc ? imgSrc : DefaultProfilePic}
                      alt="Officer Img for Add Officer"
                      type="file"
                      placeholder="No file choosen"
                      name="profile_pic"
                      onChange={handleNewOfficerDataChange}
                      imgSrcAlt="Select Image"
                    />
                  </OfficerCard>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter First Name"
                    required
                    id="Enter First Name"
                    type="text"
                    label="Enter First Name *"
                    name="first_name"
                    value={newOfficerData.first_name}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Last Name"
                    id="Enter Last Name"
                    required
                    type="text"
                    label="Enter Last Name *"
                    name="last_name"
                    value={newOfficerData.last_name}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Email Address"
                    id="Enter Email Address"
                    required
                    type="text"
                    label="Enter Email Address *"
                    name="email"
                    value={newOfficerData.email}
                    onChange={handleNewOfficerDataChange}
                    error={newOfficerData.email.length > 0 && emailFormatVerification(newOfficerData.email)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Password"
                    id="Enter Password"
                    required
                    type="password"
                    label="Enter Password *"
                    name="password"
                    value={newOfficerData.password}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Badge Number"
                    id="Enter Badge Number"
                    required
                    label="Enter Badge Number  *"
                    name="badge_number"
                    value={newOfficerData.badge_number}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    id="Enter Phone Number"
                    placeholder="Enter Phone Number"
                    type="text"
                    label="Enter Phone Number"
                    name="phone"
                    value={newOfficerData.phone}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <OfficerInputField
                    placeholder="Enter Address"
                    id="Enter Address"
                    type="text"
                    label="Enter Address"
                    name="address"
                    value={newOfficerData.address}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <OfficerInputField
                    placeholder="Enter City"
                    id="Enter City"
                    type="text"
                    label=" Enter City"
                    name="city"
                    value={newOfficerData.city}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <OfficerAutocomplete
                    id="combo-box-add-officer-state"
                    options={StatesArray}
                    label="State"
                    idTextField="State"
                    placeholder="Enter State"
                    onChange={(event, newValue) => {
                      if (newValue !== undefined) {
                        setNewOfficerData({
                          ...newOfficerData,
                          state: newValue
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
                <Grid item xs={12} sm={4}>
                  <OfficerInputField
                    placeholder="Enter Zip Code"
                    id="Enter Zip Code"
                    type="number"
                    label="Enter Zip Code"
                    name="zip_code"
                    value={newOfficerData.zip_code}
                    onChange={handleNewOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerAutocomplete
                    id="combo-box-add-officer-assignment"
                    options={districts}
                    idTextField="Precinct/District"
                    label="Select District"
                    placeholder="Enter District"
                    onChange={(event, newValue) => {
                      if (newValue !== undefined && newValue != null) {
                        setNewOfficerData({
                          ...newOfficerData,
                          district: newValue.id
                        })
                      }
                    }}
                    getOptionLabel={option => (option.name ? option.name : '')}
                    getOptionSelected={(option, value) => {
                      if (value === '') {
                        return true
                      } else if (value === option) {
                        return true
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Switch
                    onChange={onRequiredSwitchChange}
                    name="checked"
                    color="primary"
                    value={newOfficerData.is_supervisor}
                    checked={newOfficerData.is_supervisor}
                  />
                  <p>(Make this Officer Supervisor)</p>
                </Grid>
              </Grid>
            </>
          }
        />
      </Grid>
    </div>
  )
}

export default AddOfficer
