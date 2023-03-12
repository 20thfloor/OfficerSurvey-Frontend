import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { postAPIWithoutAuth } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { emailFormatVerification } from '../../../utils/helpers'
import { FormControl, Grid } from '@material-ui/core'
import { loginUrl } from '../../../utils/apiUrls'
import loginLogo from '../../../assets/login_logo.png'
import {
  setUserRefreshToken,
  setUserAccesssToken,
  setIsSuperUser,
  setIsSupervisor,
  setUserId,
  setPlan,
  setProfilePic,
  setTokenCreationTimeStamp
} from '../../../utils/localStorage'
import './LoginStyle.css'
import { Background, Secure, LoginDetail } from './LoginStyle'
import { OfficerCard, OfficerInputField } from '../../Common'
import { useDispatch } from 'react-redux'
import { setPlanRedux } from '../../../redux/actions'
import PropTypes from 'prop-types'

const Login = props => {
  Login.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const dispatch = useDispatch()

  const [showSpinnerLogin, setShowSpinnerLogin] = useState(false)
  const [body, setBody] = useState({ email: '', password: '' })
  const onChangeHandle = e => {
    const { name, value } = e.target
    setBody({
      ...body,
      [name]: name === 'email' ? value.toLowerCase().replace(/\s/g, '') : value
    })
  }
  const history = useHistory()

  const onClickLogin = async () => {
    setShowSpinnerLogin(true)
    const res = await postAPIWithoutAuth(loginUrl, body)
    const data = res.data.data
    if (!res.isError) {
      await setUserAccesssToken(data.access_token)
      await setTokenCreationTimeStamp()
      await setUserRefreshToken(data.refresh_token)
      await setUserId(data.data.id)
      await setIsSupervisor(data.data.is_supervisor)
      await setIsSuperUser(data.data.user.is_superuser)
      await setProfilePic(data.data.user.profile_pic)
      await setPlan(data.data.department.plan)
      dispatch(setPlanRedux(data.data.department.plan))

      if (data.data.department.plan === 'Employee') {
        history.push('employee-feedback')
      } else if (data.data.department.plan === 'Community') {
        history.push('community-feedback')
      } else {
        history.push('/dashboard')
      }
    } else {
      setShowSpinnerLogin(false)
      props.notify(res.error.message, 'error')
    }
  }

  // const onClickForgetPassword = () => {
  //   history.push(`/email-verification`)
  // }

  const handleKeypress = event => {
    if (event.key === 'Enter') {
      onClickLogin()
    }
  }

  return (
    <>
      <Background>
        <Grid container justify="center" className="height-100vh">
          <Grid item md={4} sm={10}>
            <div className="fullContainer">
              <img src={loginLogo} alt="OfficerLogo" className="mb-2 mt-3 officerLogo" />

              <OfficerCard pl="50px" pr="50px">
                <div className="d-flex flex-column w-100">
                  <Secure className="">Secure Agency Login</Secure>
                  <FormControl margin="normal" onKeyPress={handleKeypress}>
                    <OfficerInputField
                      id="login_email_field"
                      variant="outlined"
                      color="primary"
                      label="Enter Work Email"
                      placeholder="Enter Work Email"
                      type="email"
                      name="email"
                      value={body.email}
                      error={body.email.length > 0 && emailFormatVerification(body.email)}
                      onChange={onChangeHandle}
                    />
                  </FormControl>
                  <FormControl margin="normal" onKeyPress={handleKeypress}>
                    <OfficerInputField
                      id="login_password_field"
                      color="primary"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={body.password}
                      onChange={onChangeHandle}
                    />
                  </FormControl>
                  <OfficerButton
                    buttonName="Login"
                    color="officer"
                    variant="large"
                    click={onClickLogin}
                    showSpinnerProp={showSpinnerLogin}
                    disabled={body.email.length < 1 || body.password.length < 1}
                    applyFullWidth={'true'}
                  />

                  <Link to="email-verification" className="forgetPassword pt-3">
                    Forgot Password?
                  </Link>
                </div>
              </OfficerCard>
              <LoginDetail className="w-100 pt-3 pb-5 mb-3">
                We&apos;ve built privacy, end to end encryption and other security features into Officer Survey. Your
                agency information is never shared with anyone unless required by law.
              </LoginDetail>
            </div>
          </Grid>
        </Grid>
      </Background>
    </>
  )
}
export default Login
