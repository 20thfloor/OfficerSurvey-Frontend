import React from 'react'
import { Box } from '@material-ui/core'
import './DepartmentHeader.css'
import { OfficerCard } from '../Common'
import PropTypes from 'prop-types'

const DepartmentHeader = ({ imgSrc, header }) => {
  DepartmentHeader.defaultProps = {
    imgSrc: null
  }
  DepartmentHeader.propTypes = {
    imgSrc: PropTypes.any,
    header: PropTypes.any.isRequired
  }
  return (
    <div>
      <Box display="flex">
        <OfficerCard mt="0px" mb="0px">
          <img src={imgSrc !== null ? imgSrc : header} className="image" alt="header img" style={{ width: '100%' }} />
        </OfficerCard>
      </Box>
    </div>
  )
}
export default DepartmentHeader
