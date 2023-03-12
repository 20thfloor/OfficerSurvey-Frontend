/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'
import { Divider, Box } from '@material-ui/core'

const MainFooter = () => {
  return (
    <>
      <Box p={2}>
        <Divider variant="middle" />
        <p className="d-flex justify-content-center">
          <span>Copyright</span>© 2020
        </p>
      </Box>
    </>
  )
}
export default MainFooter
