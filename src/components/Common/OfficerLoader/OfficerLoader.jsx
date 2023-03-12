import React from 'react'
import { Grid, CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'

const OfficerLoader = ({ isFetching, children }) => {
  OfficerLoader.defaultProps = {
    isFetching: false
  }

  OfficerLoader.propTypes = {
    children: PropTypes.any.isRequired,
    isFetching: PropTypes.any
  }
  return (
    <>
      {isFetching ? (
        <Grid container direction="row" justify="center" alignItems="center">
          <CircularProgress variant="indeterminate" style={{ color: 'primary' }} />
        </Grid>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
export default OfficerLoader
