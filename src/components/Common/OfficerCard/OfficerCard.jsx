import React from 'react'
import './OfficerCard.css'
import PropTypes from 'prop-types'

const OfficerCard = ({ shouldFullHeight, ml, mr, mt, mb, pl, pr, pt, pb, h, children }) => {
  OfficerCard.defaultProps = {
    ml: '',
    mr: '',
    mt: '',
    mb: '',
    h: '',
    pl: '',
    pr: '',
    pb: '',
    pt: '',
    shouldFullHeight: false
  }
  OfficerCard.propTypes = {
    shouldFullHeight: PropTypes.any,
    ml: PropTypes.any,
    mr: PropTypes.any,
    mt: PropTypes.any,
    mb: PropTypes.any,
    pl: PropTypes.any,
    pr: PropTypes.any,
    pt: PropTypes.any,
    pb: PropTypes.any,
    h: PropTypes.any,
    children: PropTypes.any.isRequired
  }
  return (
    <div
      className={shouldFullHeight ? 'fullHeight bodyWithoutPadding' : 'bodyWithoutPadding'}
      style={{
        marginLeft: ml ? ml : '0px',
        marginRight: mr ? mr : '0px',
        marginTop: mt ? mt : '15px',
        marginBottom: mb ? mb : '15px',
        paddingLeft: pl ? pl : '25px',
        paddingRight: pr ? pr : '25px',
        paddingTop: pt ? pt : '25px',
        paddingBottom: pb ? pb : '25px',
        height: h ? h : null
      }}>
      {children}
    </div>
  )
}
export default OfficerCard
