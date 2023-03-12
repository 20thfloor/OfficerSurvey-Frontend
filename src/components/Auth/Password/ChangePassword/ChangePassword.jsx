import { Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { postAPIWrapper } from '../../../../utils/api'
import { MESSAGES } from '../../../../utils/Constants/messages'
import { OfficerInputField } from '../../../Common'
import OfficerButton from '../../../Common/OfficerButton'
import { PasswordHeading } from './ChangePasswordStyle'
import PropTypes from 'prop-types'

const ChangePassword = props => {
  ChangePassword.propTypes = {
    notify: PropTypes.func.isRequired
  }

  const [changePasswordData, setChangePasswordData] = useState({
    oldpassword: '',
    newpassword: ''
  })
  const [showSpinner, setShowSpinner] = useState(false)
  const history = useHistory()

  const onClickSubmit = async () => {
    setShowSpinner(true)
    const res = await postAPIWrapper('change-password/', {
      password: changePasswordData.oldpassword,
      new_password: changePasswordData.newpassword
    })
    if (!res.isError) {
      setShowSpinner(false)
      props.notify(MESSAGES.PASSWORD_CHANGED, 'success')
      history.push('/')
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }

  const handleChangePasswordDataChange = e => {
    const { value, name } = e.target
    setChangePasswordData({
      ...changePasswordData,
      [name]: value
    })
  }
  return (
    <>
      <PasswordHeading className="d-flex justify-content-center py-3">Change Password</PasswordHeading>
      <div className="d-flex justify-content-center align-item-center">
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <OfficerInputField
              id="Old Password"
              label="Current Password"
              placeholder="Current Password"
              name="oldpassword"
              value={changePasswordData.oldpassword}
              onChange={handleChangePasswordDataChange}
              type="password"
            />

            <OfficerInputField
              id="New Password"
              label="New Password"
              placeholder="New Password"
              name="newpassword"
              type="password"
              value={changePasswordData.newpassword}
              onChange={handleChangePasswordDataChange}
            />

            <OfficerInputField
              label="New Password"
              id="Confirm Password"
              placeholder="Re enter New Password"
              name="confirmpassword"
              type="password"
              value={changePasswordData.confirmpassword}
              onChange={handleChangePasswordDataChange}
            />
          </Grid>
        </Grid>
      </div>
      <div className="pt-4 d-flex justify-content-center align-item-center">
        <Grid item xs={12} sm={8}>
          <div className="d-flex justify-content-end">
            <OfficerButton
              buttonName="Change Password"
              color="officer"
              variant="large"
              align="center"
              click={onClickSubmit}
              showSpinnerProp={showSpinner}
              disabled={
                changePasswordData.oldpassword < 1 ||
                changePasswordData.newpassword < 1 ||
                changePasswordData.newpassword !== changePasswordData.confirmpassword
              }
            />
          </div>
        </Grid>
      </div>
    </>
  )
}
export default ChangePassword
