import React from 'react'
import { TextField } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import ClearIcon from '@material-ui/icons/Clear'
import PropTypes from 'prop-types'

const OfficerSearchBar = ({ placeholder, label, searchValue, setSearchValue, onSearchClick }) => {
  OfficerSearchBar.defaultProps = {
    placeholder: '',
    searchValue: '',
    onSearchClick: () => null,
    label: ''
  }

  OfficerSearchBar.propTypes = {
    placeholder: PropTypes.string,
    searchValue: PropTypes.string,
    setSearchValue: PropTypes.any.isRequired,
    onSearchClick: PropTypes.func,
    label: PropTypes.string
  }
  return (
    // <Box p={3} marginBottom={1} component={Paper}>
    <TextField
      variant="outlined"
      color="primary"
      fullWidth
      placeholder={placeholder}
      name="search"
      id="Search Bar"
      size="medium"
      label={label}
      value={searchValue}
      onChange={event => setSearchValue(event.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment>
            {searchValue.length > 0 ? (
              <IconButton title="Clear" onClick={() => setSearchValue('')}>
                <ClearIcon />
              </IconButton>
            ) : null}
            <IconButton title="Search" onClick={onSearchClick}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
    // </Box>
  )
}
export default OfficerSearchBar
