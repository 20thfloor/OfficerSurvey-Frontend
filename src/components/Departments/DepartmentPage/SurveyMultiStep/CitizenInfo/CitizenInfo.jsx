import React, { useEffect, useState } from 'react'
import { Grid, Box, Hidden } from '@material-ui/core'
import { StatesArray } from '../../../../../utils/Constants'
import { useTranslation } from 'react-i18next'
import { OfficerAutocomplete, OfficerCard, OfficerInputField } from '../../../../Common'
import PropTypes from 'prop-types'
import OfficerButton from '../../../../Common/OfficerButton'
import { allnumeric } from '../../../../../utils/helpers'

const CitizenInfo = ({ surveyResponseData, type, handlePrevious, handleNext, show }) => {
  CitizenInfo.propTypes = {
    surveyResponseData: PropTypes.any.isRequired,
    handlePrevious: PropTypes.any.isRequired,
    handleNext: PropTypes.any.isRequired,
    type: PropTypes.any.isRequired,
    show: PropTypes.bool.isRequired
  }
  const [newCitizenData, setNewCitizenData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  })
  const { t, i18n: translator } = useTranslation()

  const handleNewCitizenDataChange = e => {
    const { value, name } = e.target
    setNewCitizenData({
      ...newCitizenData,
      [name]: value
    })
    if (!show) {
      handleNext(newCitizenData)
    }
  }

  useEffect(() => {
    setNewCitizenData({
      ...surveyResponseData.citizen
    })
    translator.changeLanguage(type)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const renderCitizenInfo = () => {
    return (
      <>
        <OfficerCard>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <OfficerInputField
                placeholder={t('Enter First Name')}
                id="Enter First Name"
                required
                value={newCitizenData.first_name}
                type="text"
                label={t('First Name*')}
                name="first_name"
                onChange={handleNewCitizenDataChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OfficerInputField
                placeholder={t('Enter Last Name')}
                id="Enter Last Name"
                type="text"
                value={newCitizenData.last_name}
                label={t('Last Name (Optional)')}
                name="last_name"
                onChange={handleNewCitizenDataChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <OfficerInputField
                placeholder={t('Enter Address ')}
                type="text"
                id="Enter Address"
                value={newCitizenData.address}
                label={t('Address (Optional)')}
                name="address"
                onChange={handleNewCitizenDataChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <OfficerInputField
                placeholder={t('Enter City')}
                id="Enter City"
                type="text"
                value={newCitizenData.city}
                label={t('City (Optional)')}
                name="city"
                onChange={handleNewCitizenDataChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OfficerAutocomplete
                id="combo-box-citizen-state"
                options={StatesArray}
                value={newCitizenData.state}
                label={t('State (Optional)')}
                placeholder={'Enter State'}
                idTextfield="State"
                onChange={(event, newValue) => {
                  setNewCitizenData({
                    ...newCitizenData,
                    state: newValue
                  })
                }}
                getOptionLabel={option => (option ? option : '')}
                getOptionSelected={(option, value) => {
                  if (value === '') {
                    return true
                  } else if (value === option) {
                    return true
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <OfficerInputField
                placeholder={t('Enter Zip Code')}
                id="Enter Zid Code"
                type="number"
                value={newCitizenData.zip_code}
                label={t('Zip Code (Optional)')}
                name="zip_code"
                onChange={handleNewCitizenDataChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <OfficerInputField
                placeholder={t('Enter Phone Number')}
                id="Enter Phone Number"
                type="text"
                value={newCitizenData.phone}
                label={t('Phone Number (Optional)')}
                name="phone"
                onChange={handleNewCitizenDataChange}
              />
            </Grid>
          </Grid>
          {show ? (
            <Grid container>
              <Grid item xs={6} sm={6}>
                <Box mt={4}>
                  <OfficerButton
                    buttonName={t('Previous')}
                    color="secondary"
                    variant="small"
                    align="left"
                    click={() => handlePrevious()}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Box mt={4}>
                  <OfficerButton
                    buttonName={t('Next')}
                    color="black"
                    variant="small"
                    align="right"
                    click={() => handleNext(newCitizenData)}
                    disabled={
                      newCitizenData.first_name < 1 ||
                      (newCitizenData.zip_code ? newCitizenData.zip_code.length !== 5 : false) ||
                      (newCitizenData.phone ? !allnumeric(newCitizenData.phone) : false)
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            ''
          )}
        </OfficerCard>
      </>
    )
  }

  return (
    <>
      <Hidden mdUp>
        <Box>{renderCitizenInfo()}</Box>
      </Hidden>
      <Hidden smDown>
        <Box p={6}>{renderCitizenInfo()}</Box>
      </Hidden>
    </>
  )
}

export default CitizenInfo
