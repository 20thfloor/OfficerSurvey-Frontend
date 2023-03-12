import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'

const Auth = ({ children }) => {
  Auth.propTypes = {
    children: PropTypes.any.isRequired
  }
  return (
    <>
      {children}
      <Grid item xs={12} sm={4}>
        <Box
          position="static"
          display="flex"
          flexDirection="column"
          height="100%"
          bgcolor="#00349A"
          p={5}
          justifyContent="center"
          style={{ color: 'white', textAlign: 'left' }}>
          <Typography variant="h4" gutterBottom component="h1" style={{ fontWeight: 'bold' }}>
            Focus on what matters the most
          </Typography>
          <Typography gutterBottom component="p">
            Officer survey is the world&apos;s first platform that allows citizens to provide feedback after every
            dispatched call. Work more effectively to determine the cause of the problems, so you can deliver impactful
            results based on data.
          </Typography>
        </Box>
      </Grid>
    </>
  )
}
export default Auth
