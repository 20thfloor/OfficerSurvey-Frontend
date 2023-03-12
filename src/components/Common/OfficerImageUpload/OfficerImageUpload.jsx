/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react'
import { Input } from '@material-ui/core'
import PropTypes from 'prop-types'

const OfficerImageUpload = props => {
  OfficerImageUpload.propTypes = {
    src: PropTypes.any.isRequired,
    imgSrcAlt: PropTypes.any.isRequired,
    alt: PropTypes.any.isRequired,
    type: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.any.isRequired
  }
  const [imgSrc] = useState(null)

  return (
    <>
      <label>
        <div className=" d-flex">
          <img src={props.src} height={120} width={120} alt={props.alt} style={{ 'object-fit': 'contain' }} />
          <div className="pl-3  d-flex justify-content-center align-items-center ">
            {!imgSrc ? props.imgSrcAlt : ''}
          </div>
          <Input
            type={props.type}
            variant="outlined"
            fullWidth
            style={{ display: 'none' }}
            placeholder={props.placeholder}
            name={props.name}
            onChange={props.onChange}
          />
        </div>
      </label>
    </>
  )
}
export default OfficerImageUpload
