import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { putAPIWrapper, getAPI } from '../../../utils/api'
import { officersDepartmentUrl } from '../../../utils/apiUrls'
import { TriggersHeading } from '../TriggersStyle'
import { OfficerCard, OfficerInputField } from '../../Common'
import PropTypes from 'prop-types'

const TriggerSetting = props => {
  TriggerSetting.propTypes = {
    callBackProp: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }
  const [triggerSettingData, setTriggerSettingData] = useState({
    no_of_days: 0,
    trigger_rating: 0
  })
  const [showSpinner, setShowSpinner] = useState(false)
  const onClickSave = async () => {
    setShowSpinner(true)
    const res = await putAPIWrapper(officersDepartmentUrl, triggerSettingData)
    if (!res.isError) {
      setShowSpinner(false)
      props.notify(res.data.data.message, 'success')
      props.callBackProp()
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }

  const handleTriggerDataChange = e => {
    const { value, name } = e.target
    setTriggerSettingData({
      ...triggerSettingData,
      [name]: value
    })
  }
  const fetchDepartmentAPI = async () => {
    const response = await getAPI(officersDepartmentUrl)
    const data = response.data.data.data
    if (!response.isError) {
      setTriggerSettingData({
        no_of_days: data.no_of_days,
        trigger_rating: data.trigger_rating
      })
    }
  }
  useEffect(() => {
    fetchDepartmentAPI()
  }, [])
  return (
    <>
      <TriggersHeading className="d-flex justify-content-center pt-3">Early Intervention Setting</TriggersHeading>
      <OfficerCard>
        <Grid container direction="row" justify="space-around" spacing={3}>
          <Grid item xs={12} sm={12} md={5}>
            <OfficerInputField
              label="Number Of Days"
              id="Number Of Days"
              placeholder="Number Of Days"
              type="number"
              name="no_of_days"
              onChange={handleTriggerDataChange}
              value={triggerSettingData.no_of_days}
              min={'0'}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <OfficerInputField
              label="Rating"
              placeholder="Rating"
              id="Rating"
              type="number"
              name="trigger_rating"
              onChange={handleTriggerDataChange}
              value={triggerSettingData.trigger_rating}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <div className="pt-5 ">
              <OfficerButton
                buttonName="Save"
                color="officer"
                variant="small"
                click={onClickSave}
                disabled={triggerSettingData.no_of_days < 1 && triggerSettingData.trigger_rating < 1}
                showSpinnerProp={showSpinner}
              />
            </div>
          </Grid>
        </Grid>
      </OfficerCard>
    </>
  )
}

export default TriggerSetting
