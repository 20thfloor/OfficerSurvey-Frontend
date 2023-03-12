import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { postAPIWithoutAuth } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import {
  setUserRefreshToken,
  setUserAccesssToken,
  setIsSuperUser,
  setIsSupervisor,
  setProfilePic
} from '../../../utils/localStorage'
import { emailFormatVerification } from '../../../utils/helpers'
import { TextField, FormControl, Grid, Box, Typography } from '@material-ui/core'
import LoginBackground from '../../../assets/login_background.jpg'
import loginLogo from '../../../assets/logo.png'
import { adminLogin } from '../../../utils/apiUrls'
import PropTypes from 'prop-types'
const AdminLogin = props => {
  AdminLogin.propTypes = {
    notify: PropTypes.func.isRequired
  }
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
    const res = await postAPIWithoutAuth(adminLogin, body)
    const data = res.data.data
    if (!res.isError) {
      await setUserAccesssToken(data.access_token)
      await setUserRefreshToken(data.refresh_token)
      await setIsSupervisor(data.data.is_supervisor)
      await setIsSuperUser(data.data.user.is_superuser)
      await setProfilePic(data.data.user.profile_pic)
      history.push('/admin-dashboard')
    } else {
      setShowSpinnerLogin(false)
      props.notify(res.error.message, 'error')
    }
  }
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${LoginBackground})`,
          height: '100vh',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: 'flex'
        }}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Box bgcolor="white" borderRadius={18} p={2} pl={4} pr={4} display="flex" flexDirection="column">
            <img src={loginLogo} alt="OfficerLogo" width="275px" height="57px" />
            <Typography variant="h4" component="h1" align="center">
              Admin Login
            </Typography>
            <Typography variant="body2">Please enter your email and password to login</Typography>
            <FormControl margin="normal">
              <TextField
                id="Enter Email address"
                variant="outlined"
                color="primary"
                label="Enter Email address"
                fullWidth
                placeholder="Enter your email address"
                type="email"
                name="email"
                error={body.email.length < 1 && emailFormatVerification(body.email)}
                onChange={onChangeHandle}
              />
            </FormControl>
            <FormControl margin="normal">
              <TextField
                variant="outlined"
                id="Enter Password"
                color="primary"
                label="Enter Password"
                fullWidth
                placeholder="Enter your password"
                type="password"
                name="password"
                onChange={onChangeHandle}
              />
            </FormControl>
            <Box marginBottom={2}>
              <OfficerButton
                buttonName="Login"
                color="primary"
                size="large"
                variant="contained"
                click={onClickLogin}
                showSpinnerProp={showSpinnerLogin}
                fullWidth
              />
            </Box>
          </Box>
        </Grid>
      </div>
    </>
  )
}
export default AdminLogin
