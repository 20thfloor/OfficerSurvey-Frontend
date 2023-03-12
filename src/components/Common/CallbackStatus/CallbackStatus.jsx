import { Box } from '@material-ui/core'
import { GreenChip, RedChip } from './CallbackStatusStyle'
import React from 'react'
import PropTypes from 'prop-types'

const CallbackStatus = ({ callback }) => {
  CallbackStatus.propTypes = {
    callback: PropTypes.any.isRequired
  }
  return (
    <Box display="flex" justifyContent="center">
      {callback.status === 'Requested' ? (
        <RedChip className="statusButton paused">Not Resolved</RedChip>
      ) : (
        <GreenChip className="statusButton">Resolved</GreenChip>
      )}
    </Box>
  )
}
export default CallbackStatus
