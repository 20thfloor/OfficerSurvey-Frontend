/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Box, Grid, Switch } from '@material-ui/core'
import { useParams, useHistory } from 'react-router-dom'
import { getAPI, putAPIFormDataWrapper } from '../../../utils/api'
import { StatesArray } from '../../../utils/Constants'
import OfficerButton from '../../Common/OfficerButton'
import DefaultProfilePic from '../../../assets/default_profile_pic.png'
import { emailFormatVerification } from '../../../utils/helpers'
import { createFormDataObject, allnumeric } from '../../../utils/helpers'
import { getUserId, getIsSupervisor, setProfilePic } from '../../../utils/localStorage'
import OfficerLoader from '../../Common/OfficerLoader/OfficerLoader'
import { officersUrl, districtUrl, officersListUrl } from '../../../utils/apiUrls'
import { OfficerAutocomplete, OfficerCard, OfficerImageUpload, OfficerInputField } from '../../Common'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../redux/actions'

const UpdateOfficer = props => {
  const dispatch = useDispatch()

  UpdateOfficer.propTypes = {
    notify: PropTypes.func.isRequired
  }

  const [officerData, setOfficerData] = useState({
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
    district: '',
    profile_pic: DefaultProfilePic,
    is_profile_pic_change: false,
    is_supervisor: false
  })
  const [showSpinner, setShowSpinner] = useState(false)
  const [fetchingUpdate, setFetchingUpdate] = useState(false)
  const [districts, setDistricts] = useState([])
  const [selectedDirtcict, setSelectedDistrict] = useState({ id: '', name: '' })
  const history = useHistory()
  const [imgSrc, setImgSrc] = useState()
  let { updateIdOfficer } = useParams()
  const fetchOfficerDetails = async () => {
    const localOfficer = await getUserId()
    if (updateIdOfficer === undefined) {
      updateIdOfficer = localOfficer
      const supervisor = await getIsSupervisor()
      setOfficerData({ ...officerData, is_supervisor: supervisor })
    }
    setFetchingUpdate(true)
    const response = await getAPI(`${officersUrl}${updateIdOfficer}`)
    const data = response.data.data.data
    if (!response.isError) {
      setFetchingUpdate(false)
      setOfficerData({
        email: data.user.email,
        first_name: data.first_name,
        last_name: data.last_name,
        badge_number: data.badge_number,
        address: data.address,
        phone: data.phone,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        district_name: data.district ? data.district.name : '',
        district: data.district ? data.district.id : null,
        profile_pic: data.user.profile_pic,
        is_supervisor: data.is_supervisor
      })
      setSelectedDistrict(data.district)
    }
  }

  const fetchDistrictsAPI = async () => {
    const response = await getAPI(districtUrl)
    setDistricts(response.data.data.data)
  }

  useEffect(() => {
    fetchOfficerDetails()
    fetchDistrictsAPI()
  }, [])

  const onRequiredSwitchChange = (item, checked) => {
    setOfficerData({
      ...officerData,
      is_supervisor: checked
    })
  }
  const updateOfficer = async () => {
    setShowSpinner(true)
    let is_profile = false
    const user = await getUserId()
    if (updateIdOfficer === undefined) {
      is_profile = true
      updateIdOfficer = user
    }
    const formData = createFormDataObject(officerData)
    const res = await putAPIFormDataWrapper(`/${officersListUrl}${updateIdOfficer}/`, formData)
    if (!res.isError) {
      setShowSpinner(false)
      if (is_profile) {
        await setProfilePic(res.data.data.data.user.profile_pic)
        dispatch(
          setUser({
            first_name: officerData.first_name,
            last_name: officerData.last_name,
            user: { profile_pic: res.data.data.data.user.profile_pic }
          })
        )
        props.notify('Profile Updated', 'success')
        history.push('/dashboard')
      } else {
        props.notify(res.data.data.message, 'success')
        history.push('/officers')
      }
    } else {
      props.notify(res.error.message, 'error')
      setShowSpinner(false)
    }
  }
  const handleOfficerDataChange = e => {
    const { value, name, files } = e.target
    setOfficerData({
      ...officerData,
      [name]: name === 'profile_pic' ? files[0] : name === 'email' ? value.toLowerCase().replace(/\s/g, '') : value,
      is_profile_pic_change: name === 'profile_pic' ? true : false
    })
    if (name === 'profile_pic') {
      var file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = function () {
        setImgSrc([reader.result])
      }
    }
  }

  return (
    <>
      <div>
        <OfficerLoader isFetching={fetchingUpdate}>
          <Grid container justify="center" alignItems="flex-start">
            <Grid item sm={12} md={4}>
              <OfficerCard>
                <OfficerImageUpload
                  src={imgSrc ? imgSrc : DefaultProfilePic}
                  alt="Update Officer Img : "
                  type="file"
                  placeholder="No file choosen"
                  name="profile_pic"
                  onChange={handleOfficerDataChange}
                  imgSrcAlt="Select Image"
                />
              </OfficerCard>
            </Grid>
          </Grid>
          <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
            <Box borderRadius={18} p={4} display="flex" flexDirection="column" width="100%">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter First Name"
                    id="Enter First Name"
                    required
                    type="text"
                    label="First Name"
                    name="first_name"
                    value={officerData.first_name}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Last Name"
                    required
                    id="Enter Last Name"
                    type="text"
                    label="Last Name"
                    name="last_name"
                    value={officerData.last_name}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Badge Number"
                    required
                    id="Enter Badge Number"
                    label="Badge Number"
                    name="badge_number"
                    value={officerData.badge_number}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Email"
                    id="Enter Email"
                    required
                    type="text"
                    label="Work Email Address"
                    name="email"
                    value={officerData.email}
                    onChange={handleOfficerDataChange}
                    error={officerData.email.length > 0 && emailFormatVerification(officerData.email)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Address"
                    id="Enter Address"
                    type="text"
                    label="Work Address"
                    name="address"
                    value={officerData.address}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter City"
                    id="Enter City"
                    type="text"
                    label="City"
                    name="city"
                    value={officerData.city}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <OfficerAutocomplete
                    id="combo-box-update-officer-state"
                    options={StatesArray}
                    label="State"
                    idTextField="State"
                    placeholder="Enter State"
                    value={officerData.state}
                    onChange={(event, newValue) => {
                      if (newValue !== undefined) {
                        if (newValue)
                          setOfficerData({
                            ...officerData,
                            state: newValue
                          })
                        else
                          setOfficerData({
                            ...officerData,
                            state: ''
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

                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Zip Code"
                    id="Enter Zip Code"
                    type="number"
                    label="Zip Code"
                    name="zip_code"
                    value={officerData.zip_code}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <OfficerInputField
                    placeholder="Enter Phone Number"
                    id="Enter Phone Number"
                    type="text"
                    label="Phone Number"
                    name="phone"
                    value={officerData.phone}
                    onChange={handleOfficerDataChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <OfficerAutocomplete
                    id="combo-box-update-district"
                    options={districts}
                    idTextField="District"
                    label="Assignment"
                    placeholder="Enter Assignment"
                    value={selectedDirtcict}
                    onChange={(event, newValue) => {
                      if (newValue !== undefined) {
                        if (newValue)
                          setOfficerData({
                            ...officerData,
                            district: newValue.id
                          })
                        else
                          setOfficerData({
                            ...officerData,
                            district: ''
                          })
                      }
                    }}
                    getOptionLabel={option => (option ? option.name : '')}
                    getOptionSelected={() => {
                      return true
                    }}
                  />
                </Grid>
                {updateIdOfficer === undefined ? (
                  <Grid container item xs={12} sm={6} direction="column">
                    <Switch
                      onChange={onRequiredSwitchChange}
                      name="checked"
                      color="primary"
                      checked={officerData.is_supervisor}
                      value={officerData.is_supervisor}
                      disabled
                    />
                    <p>Allow Admin Access</p>
                  </Grid>
                ) : (
                  <Grid container item xs={12} sm={6} direction="column">
                    <Switch
                      onChange={onRequiredSwitchChange}
                      name="checked"
                      color="primary"
                      checked={officerData.is_supervisor}
                      value={officerData.is_supervisor}
                    />
                    <p>(Make this Officer Supervisor)</p>
                  </Grid>
                )}
              </Grid>
              <div className="d-flex justify-content-end">
                <OfficerButton
                  buttonName="Save"
                  color="officer"
                  variant="small"
                  click={updateOfficer}
                  showSpinnerProp={showSpinner}
                  disabled={
                    !officerData.first_name ||
                    !officerData.last_name ||
                    !officerData.badge_number ||
                    !officerData.email ||
                    emailFormatVerification(officerData.email) ||
                    (officerData.zip_code ? officerData.zip_code.length !== 5 : false) ||
                    (officerData.phone ? !allnumeric(officerData.phone) : false)
                  }
                />
              </div>
            </Box>
          </Grid>
        </OfficerLoader>
      </div>
    </>
  )
}
export default UpdateOfficer
