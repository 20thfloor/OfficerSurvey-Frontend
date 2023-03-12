import React from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import './StarMarker.css'

const StarMarker = ({ color }) => {
  StarMarker.propTypes = {
    color: PropTypes.string.isRequired
  }
  const backGroundColor = color

  return <Box className="markerClass" style={{ backgroundColor: backGroundColor }} />
}

export default StarMarker
