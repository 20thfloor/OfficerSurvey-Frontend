import React from 'react'
import { Switch, Grid, Box } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import IconButton from '@material-ui/core/IconButton'
import { OfficerInputField } from '../../../../Common'
import PropTypes from 'prop-types'

const AddChoice = ({
  hideSwitch,
  value,
  onChangeChoice,
  onChangeSwitch,
  checked,
  onChangePlaceholder,
  onRemoveChoice,
  show_comment_box,
  id
}) => {
  AddChoice.propTypes = {
    hideSwitch: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    onChangeChoice: PropTypes.any.isRequired,
    onChangeSwitch: PropTypes.any,
    checked: PropTypes.any,
    onChangePlaceholder: PropTypes.any.isRequired,
    onRemoveChoice: PropTypes.any.isRequired,
    show_comment_box: PropTypes.any,
    id: PropTypes.any
  }
  AddChoice.defaultProps = {
    id: '',
    checked: false,
    show_comment_box: false,
    onChangeSwitch: () => {}
  }
  return (
    <Grid container spacing={6}>
      {hideSwitch ? (
        <Grid item sm={10} xs={12}>
          <OfficerInputField
            placeholder="Enter Choice"
            type="text"
            label="Enter Choice"
            id={id}
            name="choice"
            value={value}
            onChange={onChangeChoice}
          />
        </Grid>
      ) : (
        <Grid item sm={4} xs={12}>
          <OfficerInputField
            placeholder="Enter Choice"
            type="text"
            label="Enter Choice"
            name="choice"
            value={value}
            onChange={onChangeChoice}
            id={id}
          />
        </Grid>
      )}

      {hideSwitch ? (
        ''
      ) : (
        <Grid item sm={2} xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Switch
              onChange={onChangeSwitch}
              checked={checked}
              color="primary"
              name="checked"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </Box>
        </Grid>
      )}

      {hideSwitch ? (
        ''
      ) : (
        <Grid item sm={4} xs={12}>
          {show_comment_box ? (
            <OfficerInputField
              placeholder="Enter Comment Placeholder"
              type="text"
              label="Enter Comment Placeholder"
              id="Enter Comment Placeholder"
              name="comment"
              onChange={onChangePlaceholder}
            />
          ) : (
            ''
          )}
        </Grid>
      )}

      <Grid item sm={2} xs={12}>
        <Box display="flex" justifyContent="center" alignItems="flex-end" height="100%">
          <IconButton aria-label="delete" title="Clear" onClick={onRemoveChoice} color="primary">
            <CancelIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AddChoice
