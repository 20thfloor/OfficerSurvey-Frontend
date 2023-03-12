import React from 'react'
import { Dialog } from '@material-ui/core'
import { Box } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const OfficerDialog = ({ fullWidth, className, maxWidth, open, onClose, title, content, style, actions }) => {
  OfficerDialog.defaultProps = {
    fullWidth: false,
    style: null,
    maxWidth: 'md',
    className: '',
    title: '',
    open: false,
    onClose: () => null
  }
  OfficerDialog.propTypes = {
    fullWidth: PropTypes.any,
    className: PropTypes.string,
    maxWidth: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.any.isRequired,
    style: PropTypes.any,
    actions: PropTypes.any.isRequired
  }
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      onBackdropClick="false"
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      className={className}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title" style={style}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box minWidth={500}>{content}</Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  )
}
export default OfficerDialog
