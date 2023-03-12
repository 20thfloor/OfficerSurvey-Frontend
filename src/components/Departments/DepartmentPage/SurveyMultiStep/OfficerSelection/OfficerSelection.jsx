/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import OfficerSearchBar from '../../../../Common/OfficerSearchBar'
import OfficerTable from '../../../../Common/OfficerTable'
import { getAPIWithoutAuth } from '../../../../../utils/api'
import OfficerButton from '../../../../Common/OfficerButton'
import OfficerImage from '../../../../Common/OfficerImage'
import { searchOfficerUrl } from '../../../../../utils/apiUrls'
import { useTranslation } from 'react-i18next'
import { SearchbarDiv } from './OfficerSelectionStyle'
import PropTypes from 'prop-types'

const OfficerSelection = ({ type, departmentData, handleNext }) => {
  OfficerSelection.propTypes = {
    type: PropTypes.any.isRequired,
    departmentData: PropTypes.any.isRequired,
    handleNext: PropTypes.any.isRequired
  }
  const [officersData, setOfficersData] = useState([])
  const [officersResponse, setOfficersResponse] = useState([])
  const [searchOfficer, setSearchOfficer] = useState('')
  const [tableLoadSpinner, setTableLoadSpinner] = useState(false)
  const { t, i18n: translator } = useTranslation()

  useEffect(() => {
    translator.changeLanguage(type)
  }, [type])

  const fetchOfficersAPI = async () => {
    setTableLoadSpinner(true)
    const response = await getAPIWithoutAuth(`${searchOfficerUrl}${departmentData.id}`, {
      search: searchOfficer
    })
    if (!response.isError) {
      setTableLoadSpinner(false)
      setOfficersResponse(response.data.data.data)
    } else {
      setTableLoadSpinner(false)
    }
  }

  useEffect(() => {
    const list = []
    officersResponse.map(officerResponse => {
      const render = []
      render.push(
        <div align="center">
          <OfficerImage url={officerResponse.user.profile_pic} alt={officerResponse.badge_number + '-img'} />
        </div>
      )
      render.push(
        <p align="center">
          {officerResponse.first_name}
          &nbsp;
          {officerResponse.last_name}
        </p>
      )

      render.push(<p align="center">{officerResponse.badge_number}</p>)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName={t('Select')}
            color="black"
            variant="small"
            endIcon={<ArrowForwardIcon />}
            click={() => handleNext(officerResponse)}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficersData(list)
  }, [officersResponse])

  return (
    <>
      <div className=" d-flex justify-content-center align-items-center ">
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item xs={12} sm={12} md={5}>
            <SearchbarDiv className="my-2">
              <OfficerSearchBar
                searchValue={searchOfficer}
                setSearchValue={setSearchOfficer}
                onSearchClick={fetchOfficersAPI}
                placeholder={t('Enter Officer’s Name or Badge #')}
                label={t('Enter Officer’s Name or Badge #')}
              />
            </SearchbarDiv>
          </Grid>
        </Grid>
      </div>
      <OfficerTable
        showSpinner={tableLoadSpinner}
        headers={[t('Profile Picture'), t('Officer Name'), t('Badge Number'), t('Action')]}
        headerColor="#000000"
        data={officersData}
        emptyPlaceholder={t('Search for Officers')}
        color="#ffffff !important"
      />
    </>
  )
}

export default OfficerSelection
