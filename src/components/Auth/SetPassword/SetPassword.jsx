import React, { useState } from 'react'
import { Grid, FormControl } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton'
import loginLogo from '../../../assets/login_logo.png'
import { postAPIWithoutAuth } from '../../../utils/api'
import { useParams, useHistory, Link } from 'react-router-dom'
import { setPassword } from '../../../utils/apiUrls'
import { Background, Reset } from './SetPasswordStyle'
import { OfficerCard, OfficerInputField } from '../../Common'
import '../Login/LoginStyle.css'
import PropTypes from 'prop-types'

const SetPassword = props => {
  SetPassword.propTypes = {
    notify: PropTypes.func.isRequired
  }

  const [passwordData, setPasswordData] = useState({
    code: '',
    newpassword: ''
  })
  const [showSpinner, setShowSpinner] = useState(false)
  const history = useHistory()

  const { emailAddress } = useParams()

  const onClickSend = async () => {
    const body = {
      email: emailAddress,
      password: passwordData.newpassword,
      code: passwordData.code
    }
    setShowSpinner(true)
    const res = await postAPIWithoutAuth(setPassword, body)
    if (!res.isError) {
      setShowSpinner(false)

      props.notify(res.data.data.message, 'success')
      history.push('/')
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }
  const handleSetPasswordDataChange = e => {
    const { value, name } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value
    })
  }
  return (
    <>
      <Background>
        <Grid container justify="center">
          <Grid item md={4} sm={10}>
            <div className="fullContainer">
              <img src={loginLogo} alt="OfficerLogo" className="mb-2 mt-3 officerLogo" />

              <OfficerCard pl="50px" pr="50px">
                <div className="d-flex flex-column w-100">
                  <Reset> Reset Password</Reset>

                  <FormControl margin="normal">
                    <OfficerInputField
                      label="Verification Code"
                      id="Enter Verification Code"
                      placeholder="Enter Verification Code"
                      name="code"
                      value={passwordData.code}
                      onChange={handleSetPasswordDataChange}
                    />
                  </FormControl>

                  <FormControl margin="normal">
                    <OfficerInputField
                      label="New Password"
                      id="Type New Password"
                      placeholder="Type New Password"
                      name="newpassword"
                      value={passwordData.newpassword}
                      onChange={handleSetPasswordDataChange}
                      type="password"
                    />
                  </FormControl>
                  <div className="my-2">
                    <OfficerButton
                      buttonName="Reset"
                      color="officer"
                      variant="large"
                      click={onClickSend}
                      showSpinnerProp={showSpinner}
                      disabled={passwordData.code < 1 || passwordData.newpassword < 1}
                      applyFullWidth={'true'}
                    />
                  </div>
                  <Link to="/" className="backToLogin pt-3">
                    Back to Login
                  </Link>
                </div>
              </OfficerCard>
            </div>
          </Grid>
        </Grid>
      </Background>
    </>
  )
}
export default SetPassword
