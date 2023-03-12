import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box } from '@material-ui/core'
import './OfficerButton.css'
import PropTypes from 'prop-types'
import { propTypes } from 'react-bootstrap/esm/Image'

const OfficerButton = ({
  color,
  variant,
  applyFullWidth,
  align,
  showSpinnerProp,
  styleSpn,
  click,
  disabled,
  width,
  startIcon,
  buttonName
}) => {
  OfficerButton.defaultProps = {
    showSpinnerProp: false,
    styleSpn: PropTypes.any,
    applyFullWidth: false,
    startIcon: propTypes.any,
    width: '',
    disabled: false,
    align: '',
    click: () => {}
  }
  OfficerButton.propTypes = {
    showSpinnerProp: PropTypes.bool,
    align: PropTypes.any,
    styleSpn: PropTypes.any,
    applyFullWidth: PropTypes.any,
    color: PropTypes.any.isRequired,
    variant: PropTypes.any.isRequired,
    click: PropTypes.func,
    startIcon: PropTypes.any,
    width: PropTypes.any,
    disabled: PropTypes.bool,
    buttonName: PropTypes.string.isRequired
  }
  const selectColor = () => {
    const backgroundColor =
      color === 'primary'
        ? 'primaryButton'
        : color === 'secondary'
        ? 'secondaryButton'
        : color === 'danger'
        ? 'dangerButton'
        : color === 'grey'
        ? 'greyButton'
        : color === 'officer'
        ? 'officerButton'
        : color === 'black'
        ? 'blackButton'
        : ''

    return backgroundColor
  }

  const selectSize = () => {
    const size =
      variant === 'small'
        ? 'smallButton'
        : variant === 'medium'
        ? 'mediumButton'
        : variant === 'large'
        ? 'largeButton'
        : variant === 'extraLarge'
        ? 'extraLarge'
        : ''

    return size
  }

  const applyWidth = () => {
    const width = applyFullWidth ? 'fullWidth' : ''
    return width
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent={align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'}>
      {showSpinnerProp ? (
        <CircularProgress style={{ ...styleSpn, color: 'primary' }} />
      ) : (
        <button
          onClick={click}
          className={`${selectColor()} ${selectSize()} ${applyWidth()}`}
          disabled={disabled}
          style={{
            width: width ? width : '',
            opacity: disabled ? 0.5 : 1
          }}>
          {startIcon}
          {buttonName}
        </button>
      )}
    </Box>
  )
}
export default OfficerButton
