import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton'
import OfficerDialog from '../OfficerDialog'
import { DateRangePicker } from 'react-date-range'
import { convertDateToFormatedString } from '../../../utils/helpers'
import PropTypes from 'prop-types'

const DateRangeSelector = ({ startDate, onDateSelect, endDate }) => {
  DateRangeSelector.propTypes = {
    startDate: PropTypes.any.isRequired,
    onDateSelect: PropTypes.any.isRequired,
    endDate: PropTypes.any.isRequired
  }
  const [openDialog, setOpenDialog] = useState(false)
  // const [dateRange, setDateRange] = useState("")

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleSelect = ranges => {
    onDateSelect(ranges.selection.startDate, ranges.selection.endDate)
    // let startDateStr = convertDateToFormatedString(ranges.selection.startDate)
    // let endDateStr = convertDateToFormatedString(ranges.selection.endDate)
    // setDateRange(startDateStr + " - " + endDateStr)
  }

  return (
    <div>
      <OfficerButton
        buttonName={convertDateToFormatedString(startDate) + ' - ' + convertDateToFormatedString(endDate)}
        color="officer"
        variant="large"
        width="100%"
        click={handleClickOpen}
      />
      <Grid>
        <OfficerDialog
          open={openDialog}
          onClose={handleClose}
          title="Date Selector"
          actions={
            <>
              <OfficerButton buttonName="Close" color="secondary" variant="small" click={handleClose} />
            </>
          }
          content={
            <DateRangePicker
              dateDisplayFormat="MM/dd/yyyy"
              ranges={[
                {
                  startDate: startDate,
                  endDate: endDate,
                  key: 'selection'
                }
              ]}
              onChange={handleSelect}
            />
          }
        />
      </Grid>
    </div>
  )
}

export default DateRangeSelector
