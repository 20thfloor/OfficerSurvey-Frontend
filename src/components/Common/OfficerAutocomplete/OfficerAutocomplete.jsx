import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'
import './Autocomplete.css'
import { Label } from './AutocompleteStyle'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const OfficerAutocomplete = ({
  id,
  disabled,
  freeSolo,
  value,
  options,
  getOptionLabel,
  onChange,
  label,
  required,
  type,
  idTextfield,
  name,
  placeholder,
  getOptionSelected,
  onInputChange,
  focusElement
}) => {
  const [autoCompleteDefaultValue, setAutoCompleteDefaultVlaue] = useState(value)
  useEffect(() => {
    setAutoCompleteDefaultVlaue(value)
  }, [value])
  const CssTextField = withStyles({
    root: {
      '& fieldset': {
        borderColor: '#dedede',
        borderRadius: '12px',
        boxSizing: 'border-box',
        paddingLeft: '15px'
      }
    }
  })(TextField)

  OfficerAutocomplete.defaultProps = {
    disabled: false,
    freeSolo: false,
    value: undefined,
    label: '',
    idTextfield: '',
    inputValue: '',
    name: '',
    focusElement: false,
    onInputChange: () => {
      return
    },
    type: '',
    required: false,
    getOptionLabel: () => {
      return
    },
    getOptionSelected: () => {
      return
    }
  }

  OfficerAutocomplete.propTypes = {
    id: PropTypes.any.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    freeSolo: PropTypes.any,
    options: PropTypes.array.isRequired,
    getOptionLabel: PropTypes.any,
    onChange: PropTypes.any.isRequired,
    onInputChange: PropTypes.any.isRequired,
    label: PropTypes.string,
    idTextfield: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string,
    inputValue: PropTypes.any,
    name: PropTypes.string,
    getOptionSelected: PropTypes.any,
    focusElement: PropTypes.any
  }

  return (
    <div className="">
      <Autocomplete
        id={id}
        disabled={disabled}
        options={options}
        value={autoCompleteDefaultValue}
        getOptionLabel={getOptionLabel}
        getOptionSelected={getOptionSelected}
        onChange={onChange}
        freeSolo={freeSolo}
        onInputChange={onInputChange}
        renderInput={params => (
          <>
            <Label className="py-2 pl-2">{label}</Label>
            <CssTextField
              {...params}
              id={idTextfield}
              name={name}
              className="input"
              variant="outlined"
              required={required}
              autoFocus={focusElement}
              placeholder={placeholder}
              type={type}
            />
          </>
        )}
      />
    </div>
  )
}
export default OfficerAutocomplete
