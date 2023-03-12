import { Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getIsSupervisor } from '../../../utils/localStorage'
import { GreenChip, RedChip } from './SurveyStatusStyle'
import PropTypes from 'prop-types'

const SurveyStatus = ({ surveyResponse }) => {
  SurveyStatus.propTypes = {
    surveyResponse: PropTypes.any.isRequired
  }
  const [isSupervisor, setIsSupervisor] = useState(false)

  const setup = async () => {
    const supervisor = await getIsSupervisor()
    await setIsSupervisor(supervisor)
  }
  useEffect(() => {
    setup()
  }, [])
  return (
    <Box display="flex" justifyContent="center">
      {isSupervisor ? (
        surveyResponse.request_change && !surveyResponse.changed_by_supervisor ? (
          <RedChip> Appealed</RedChip>
        ) : surveyResponse.request_change && surveyResponse.changed_by_supervisor ? (
          <GreenChip>Approved</GreenChip>
        ) : (
          <GreenChip>Review Received</GreenChip>
        )
      ) : surveyResponse.request_change && !surveyResponse.changed_by_supervisor ? (
        <RedChip> Appealed</RedChip>
      ) : surveyResponse.request_change && surveyResponse.changed_by_supervisor ? (
        <GreenChip>Reviewed</GreenChip>
      ) : (
        <GreenChip>Review Received</GreenChip>
      )}
    </Box>
  )
}
export default SurveyStatus
