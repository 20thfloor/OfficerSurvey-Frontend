import React, { useState } from 'react'
import { Grid, FormControl } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton'
import { postAPIWithoutAuth } from '../../../utils/api'
import { useHistory, Link } from 'react-router-dom'
import { emailFormatVerification } from '../../../utils/helpers'
import { resetPasswordUrl } from '../../../utils/apiUrls'
import { Background, ForgetPassword } from './EmailVerificationStyle'
import loginLogo from '../../../assets/login_logo.png'
import { OfficerCard, OfficerInputField } from '../../Common'
import '../Login/LoginStyle.css'
import PropTypes from 'prop-types'

const EmailConfirmation = props => {
  EmailConfirmation.propTypes = {
    notify: PropTypes.func.isRequired
  }

  const [emailConfirmationData, setEmailConfirmationData] = useState({
    email: ''
  })
  const [showSpinner, setShowSpinner] = useState(false)

  const history = useHistory()
  const onClickSend = async () => {
    const body = {
      email: emailConfirmationData.email.toLowerCase().replace(/\s/g, '')
    }
    setShowSpinner(true)
    const res = await postAPIWithoutAuth(resetPasswordUrl, body)
    if (!res.isError) {
      setShowSpinner(false)
      props.notify(res.data.data.message, 'success')
      history.push(`/set-password/${emailConfirmationData.email}`)
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }
  const handleEmailConfirmationDataChange = e => {
    const { value, name } = e.target
    setEmailConfirmationData({
      ...emailConfirmationData,
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
                <ForgetPassword> Email Confirmation</ForgetPassword>

                <div className="d-flex flex-column w-100">
                  <FormControl margin="normal">
                    <OfficerInputField
                      id="Enter Email"
                      label="Enter Email"
                      placeholder="Enter Email "
                      name="email"
                      value={emailConfirmationData.email}
                      onChange={handleEmailConfirmationDataChange}
                      error={emailFormatVerification(emailConfirmationData.email)}
                    />
                  </FormControl>
                  <OfficerButton
                    buttonName="Send"
                    color="officer"
                    variant="large"
                    click={onClickSend}
                    showSpinnerProp={showSpinner}
                    disabled={emailConfirmationData.email < 1}
                    applyFullWidth={'true'}
                  />

                  <Link to="login" className="backToLogin pt-3">
                    Back To Login
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
export default EmailConfirmation
