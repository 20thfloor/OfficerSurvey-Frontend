import React from 'react'
import Image from 'material-ui-image'
import PropTypes from 'prop-types'

const OfficerImage = ({ url, alt, width, height, borderRadius }) => {
  OfficerImage.defaultProps = {
    alt: '',
    height: '',
    borderRadius: '',
    width: ''
  }
  OfficerImage.propTypes = {
    url: PropTypes.any.isRequired,
    alt: PropTypes.string,
    height: PropTypes.string,
    borderRadius: PropTypes.string,
    width: PropTypes.string
  }
  return (
    <Image
      src={url}
      alt={alt}
      imageStyle={{
        width: width ? width : 65,
        height: height ? height : 65,
        borderRadius: borderRadius ? borderRadius : 50
      }}
      style={{
        paddingTop: 0,
        width: width ? width : 65,
        height: height ? height : 65,
        background: 'transparent'
      }}
    />
  )
}
export default OfficerImage
