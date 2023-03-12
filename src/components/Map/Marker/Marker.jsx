import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import PropTypes from 'prop-types'
import './Marker.css'
import { Box } from '@material-ui/core'

const Marker = ({ color, rating, rating_count, name, onClick }) => {
  Marker.propTypes = {
    color: PropTypes.any.isRequired,
    rating: PropTypes.any.isRequired,
    rating_count: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }
  //const { color } = props

  const ZipCodeTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9'
    }
  }))(Tooltip)

  return (
    <>
      <ZipCodeTooltip
        title={
          <>
            <p>
              Rating:
              {rating}
              <br />
              Total Reviews:
              {rating_count}
              <br />
              Zip Code:
              {name}
            </p>
          </>
        }>
        <Box className="marker" style={{ backgroundColor: color, cursor: 'pointer' }} onClick={() => onClick(name)} />
      </ZipCodeTooltip>
    </>
  )
}

export default Marker
