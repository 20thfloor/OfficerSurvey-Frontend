import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, Paper } from '@material-ui/core'
import Error_Here from '../../assets/404_Error.jpg'

const PageNotFound = () => {
  return (
    <>
      <Grid>
        <Box display="flex" justifyContent="center">
          <Box>
            <img src={Error_Here} alt="Error Img " />
          </Box>
        </Box>
        <Box justifyContent="center" display="flex">
          <Box component={Paper} p={2} elevation={4}>
            <Link to="/">Go Back to Home </Link>
          </Box>
        </Box>
      </Grid>
    </>
  )
}
export default PageNotFound
