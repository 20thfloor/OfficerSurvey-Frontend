/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react/jsx-one-expression-per-line
import { Grid, Input } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import DefaultProfilePic from '../../../assets/default_profile_pic.png'
import loginLogo from '../../../assets/login_logo.png'
import { getAPIWithoutAuth, postAPIFormDataWrapper } from '../../../utils/api'
import { departmentWithDistrict, signUpUrl } from '../../../utils/apiUrls'
import { StatesArray } from '../../../utils/Constants'
import { clearLocalStorage, createFormDataObject, emailFormatVerification, allnumeric } from '../../../utils/helpers'
import { OfficerAutocomplete, OfficerCard, OfficerInputField } from '../../Common'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerLoader from '../../Common/OfficerLoader'
import { Background, Create, Department, ImageUploadDiv } from './SignupStyle'
import PropTypes from 'prop-types'

const SignupOfficer = props => {
  SignupOfficer.propTypes = {
    notify: PropTypes.func.isRequired
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
  const [showSpinner, setShowSpinner] = useState(false)
  const [isFetching, setFetching] = useState(true)
  const history = useHistory()

  const [departmenWithDistricts, setDepartmentWithDistricts] = useState({
    departent: {
      name: ''
    }
  })
  const [imgSrc, setImgSrc] = useState()
  const { signupId } = useParams()
  const fetchDistrictsAPI = async () => {
    const response = await getAPIWithoutAuth(`${departmentWithDistrict}${signupId}`)
    if (!response.isError) {
      setFetching(false)
      setDepartmentWithDistricts(response.data.data.data)
    } else {
      setFetching(false)
      props.notify(response.error.message, 'error')
    }
  }

  useEffect(() => {
    fetchDistrictsAPI()
  }, [])

  const createOfficer = async () => {
    setShowSpinner(true)
    const formData = createFormDataObject(newOfficerData)
    const res = await postAPIFormDataWrapper(`${signUpUrl}${departmenWithDistricts.departent.id}/`, formData)

    if (!res.isError) {
      setShowSpinner(false)
      props.notify(res.data.data.message, 'success')
      await clearLocalStorage()
      history.push('/')
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

  return (
    <>
      <Background>
        <OfficerLoader isFetching={isFetching}>
          <Grid container justify="center">
            <Grid item md={4} sm={10}>
              <div className="fullContainer">
                <img src={loginLogo} alt="Officer Logo" width="275px" height="57px" className="pl-4" />
                <Department>Department :{departmenWithDistricts.departent.name}</Department>

                <OfficerCard pl="50px" pr="50px">
                  <div className="d-flex flex-column w-100">
                    <Create className="pt-2 "> Create an account</Create>

                    <label>
                      <ImageUploadDiv className="px-5 py-3 my-4">
                        <img
                          src={imgSrc ? imgSrc : DefaultProfilePic}
                          height={120}
                          width={120}
                          alt="SignUp Officer Img"
                        />
                        {!imgSrc ? 'Select Image' : ''}
                        <Input
                          type="file"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          style={{ display: 'none' }}
                          placeholder="No file choosen"
                          name="profile_pic"
                          onChange={handleNewOfficerDataChange}
                        />
                      </ImageUploadDiv>
                    </label>

                    <OfficerInputField
                      placeholder="Enter First Name*"
                      id="Enter First Name"
                      required
                      type="text"
                      name="first_name"
                      value={newOfficerData.first_name}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerInputField
                      placeholder="Enter Last Name*"
                      required
                      id="Enter Last Name"
                      type="text"
                      name="last_name"
                      value={newOfficerData.last_name}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerInputField
                      placeholder="Enter Work Email*"
                      id="Enter Work Email"
                      required
                      type="text"
                      name="email"
                      value={newOfficerData.email}
                      onChange={handleNewOfficerDataChange}
                      error={emailFormatVerification(newOfficerData.email)}
                    />
                    <OfficerInputField
                      placeholder="Enter Password*"
                      id="Enter Password"
                      required
                      type="password"
                      name="password"
                      value={newOfficerData.password}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerInputField
                      placeholder="Enter Badge Number*"
                      required
                      id="Enter Badge Number"
                      name="badge_number"
                      value={newOfficerData.badge_number}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerInputField
                      placeholder="Enter Work Phone Number"
                      id="Enter Work Phone Number"
                      type="text"
                      name="phone"
                      value={newOfficerData.phone}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerInputField
                      placeholder="Enter Work Address"
                      id="Enter Work Address"
                      type="text"
                      name="address"
                      value={newOfficerData.address}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerInputField
                      placeholder="Enter City"
                      id="Enter City"
                      type="text"
                      name="city"
                      value={newOfficerData.city}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerAutocomplete
                      id="combo-box-signup-state"
                      options={StatesArray}
                      onChange={(event, newValue) => {
                        if (newValue !== undefined) {
                          if (newValue)
                            setNewOfficerData({
                              ...newOfficerData,
                              state: newValue
                            })
                          else
                            setNewOfficerData({
                              ...newOfficerData,
                              state: ''
                            })
                        }
                      }}
                      getOptionLabel={option => (option ? option : '')}
                      placeholder="Select State"
                      idTextfield="Select State"
                    />
                    <OfficerInputField
                      placeholder="Enter Zip Code"
                      id="Enter Zip Code"
                      type="number"
                      name="zip_code"
                      value={newOfficerData.zip_code}
                      onChange={handleNewOfficerDataChange}
                    />
                    <OfficerAutocomplete
                      id="combo-box-signup-assignment"
                      options={departmenWithDistricts.districts}
                      placeholder="Select Assignment"
                      idTextfield="Select District"
                      onChange={(event, newValue) => {
                        if (newValue !== undefined) {
                          if (newValue)
                            setNewOfficerData({
                              ...newOfficerData,
                              district: newValue.id
                            })
                        }
                      }}
                      getOptionLabel={option => (option.name ? option.name : '')}
                    />
                    <div className="py-3">
                      <OfficerButton
                        buttonName="Sign Up"
                        color="officer"
                        variant="large"
                        click={createOfficer}
                        showSpinnerProp={showSpinner}
                        align="center"
                        disabled={
                          newOfficerData.first_name.length < 1 ||
                          newOfficerData.last_name.length < 1 ||
                          newOfficerData.badge_number.length < 1 ||
                          newOfficerData.email.length < 1 ||
                          (newOfficerData.zip_code ? newOfficerData.zip_code.length !== 5 : false) ||
                          (newOfficerData.phone ? !allnumeric(newOfficerData.phone) : false)
                        }
                        applyFullWidth={'true'}
                      />
                    </div>
                  </div>
                </OfficerCard>
              </div>
            </Grid>
          </Grid>
        </OfficerLoader>
      </Background>
    </>
  )
}

export default SignupOfficer
