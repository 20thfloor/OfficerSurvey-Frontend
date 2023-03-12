import React, { useState } from 'react'
import { Grid, Box } from '@material-ui/core'
import OfficerButton from '../Common/OfficerButton/OfficerButton'
import DefaultProfilePic from '../../assets/default_profile_pic.png'
import { postAPIFormDataWrapper } from '../../utils/api'
import { createFormDataObject } from '../../utils/helpers'
import { supportUrl } from '../../utils/apiUrls'
import { SupportHeading } from './SupportStyle'
import { OfficerCard, OfficerImageUpload, OfficerInputField } from '../Common'
import PropTypes from 'prop-types'

const Support = props => {
  Support.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [imgSrc, setImgSrc] = useState()
  const [showSpinner, setShowSpinner] = useState(false)

  const [supportData, setSupportData] = useState({
    issue: '',
    message: '',
    picture: {}
  })
  const onClickSubmit = async () => {
    setShowSpinner(true)
    const formData = createFormDataObject(supportData)
    const res = await postAPIFormDataWrapper(supportUrl, formData)
    if (!res.isError) {
      setShowSpinner(false)
      const supportData = { issue: '', message: '', picture: {} }
      setSupportData(supportData)
      props.notify(res.data.data.message, 'success')
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }
  const handleSupportDataChange = e => {
    const { value, name, files } = e.target
    setSupportData({
      ...supportData,
      [name]: name === 'picture' ? files[0] : value
    })
    if (name === 'picture') {
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
      <SupportHeading className="d-flex justify-content-center">Hi! How can we help?</SupportHeading>
      <Box p={3}>
        <Grid container direction="column">
          <Grid item xs={12} sm={8}>
            <OfficerInputField
              id="Type Issue Here"
              variant="outlined"
              color="primary"
              label="What problem are you facing?"
              fullWidth
              placeholder="Type Problem Here"
              type="comment"
              name="issue"
              value={supportData.issue}
              onChange={handleSupportDataChange}
            />

            <OfficerInputField
              variant="outlined"
              color="primary"
              label=" Please provide us with as much information as possible so we can
              help you."
              fullWidth
              id="Type Message Here"
              placeholder="Type Information Here"
              type="message"
              name="message"
              value={supportData.message}
              onChange={handleSupportDataChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <OfficerCard>
              <OfficerImageUpload
                src={imgSrc ? imgSrc : DefaultProfilePic}
                alt="Select Img for Support Form"
                type="file"
                style={{ display: 'none' }}
                placeholder="No file choosen"
                name="picture"
                onChange={handleSupportDataChange}
                imgSrcAlt="Select Image"
              />
            </OfficerCard>
          </Grid>
          <Grid item xs={12} sm={12}>
            <div className="pt-2">
              <OfficerButton
                buttonName="Submit Support Ticket"
                color="officer"
                variant="large"
                align="left"
                click={onClickSubmit}
                showSpinnerProp={showSpinner}
                disabled={supportData.issue < 1 || supportData.message < 1}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default Support
