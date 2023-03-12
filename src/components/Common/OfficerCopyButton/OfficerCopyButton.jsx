import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CopyButton, CopyButtonWhite } from './OfficerButtonStyle'
import PropTypes from 'prop-types'

import Tooltip from '@material-ui/core/Tooltip'
const OfficerCopyButton = ({ text, notify, color }) => {
  OfficerCopyButton.propTypes = {
    notify: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.any
  }
  OfficerCopyButton.defaultProps = {
    color: ''
  }

  return (
    <div>
      {!color ? (
        <CopyToClipboard text={text} onCopy={() => notify('Copied', 'success', 1000)}>
          <Tooltip title={'Click here to copy'} arrow>
            <CopyButton>Copy</CopyButton>
          </Tooltip>
        </CopyToClipboard>
      ) : (
        <CopyToClipboard text={text} onCopy={() => notify('Copied', 'success', 1000)}>
          <Tooltip title={'Click here to copy'} arrow>
            <CopyButtonWhite>Copy</CopyButtonWhite>
          </Tooltip>
        </CopyToClipboard>
      )}
    </div>
  )
}
export default OfficerCopyButton
