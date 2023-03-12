/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'
import { Label, Input, TextArea } from './OfficerFieldStyle'
import PropTypes from 'prop-types'
const OfficerInputField = ({
  id,
  label,
  type,
  value,
  name,
  placeholder,
  onChange,
  error,
  required,
  className,
  min,
  max,
  maxLength,
  multiline,
  disabled,
  characterCount
}) => {
  OfficerInputField.defaultProps = {
    id,
    label: '',
    error: false,
    type: '',
    name: '',
    placeholder: '',
    required: false,
    className: '',
    value: '',
    min: '',
    max: '',
    maxLength: '',
    multiline: false,
    disabled: false,
    characterCount: false
  }

  OfficerInputField.propTypes = {
    id: PropTypes.any,
    label: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    maxLength: PropTypes.string,
    multiline: PropTypes.bool,
    disabled: PropTypes.bool,
    characterCount: PropTypes.bool
  }
  return (
    <div className="">
      <Label className="py-2 pl-2">{label}</Label>
      <br />

      {!multiline ? (
        <Input
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          error={error}
          required={required}
          className={className}
          min={min}
          max={max}
          disabled={disabled}
        />
      ) : (
        <TextArea
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          error={error}
          required={required}
          className={className}
          maxLength={maxLength}
          rows="5"
        />
      )}
      {characterCount ? (
        <div className="float-right">
          Max characters:
          {maxLength}({value.length})
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
export default OfficerInputField
