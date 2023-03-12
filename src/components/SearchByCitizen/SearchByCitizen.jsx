/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getAPI } from '../../utils/api'
import OfficerButton from '../Common/OfficerButton/OfficerButton'
import OfficerSearchBar from '../Common/OfficerSearchBar/OfficerSearchBar'
import OfficerTable from '../Common/OfficerTable'
import { useHistory } from 'react-router-dom'
import SurveyStatus from '../Common/SurveyStatus/SurveyStatus'
import { surveyResponseUrl } from '../../utils/apiUrls'
import { dateToLocalString } from '../../utils/helpers'
import { OfficerCard } from '../Common'
import { SearchCitizenHeading, TableBody } from './CitizenSearchStyle'
import { ViewSvg } from '../../utils/svgs'
const SearchByCitizen = () => {
  const pageLimit = 15
  const [searchValue, setSearchValue] = useState('')
  const [officerListData, setOfficerListData] = useState([])
  const [citizens, setCitizens] = useState([])
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [page, setPage] = useState(1)
  const [surveyResponseCitizen, setSurveyResponseCitizen] = useState({
    links: {
      next: null,
      previous: null
    }
  })
  const history = useHistory()
  const fetchCitizenAPI = async () => {
    const body = {
      page: page,
      page_size: pageLimit,
      citizen_name: searchValue
    }
    setTableLoadSpinner(true)
    const response = await getAPI(surveyResponseUrl, body)
    const data = response.data.data
    if (!response.isError) {
      setTableLoadSpinner(false)
      setCitizens(data.data)
      setSurveyResponseCitizen(data)
    }
  }
  useEffect(() => {
    fetchCitizenAPI()
  }, [])
  useEffect(() => {
    fetchCitizenAPI()
  }, [page])
  useEffect(() => {
    searchValue === '' ? fetchCitizenAPI() : setPage(1)
  }, [searchValue])
  const handleChangePage = newPage => {
    setPage(newPage)
  }

  useEffect(() => {
    const list = []
    citizens.map(district => {
      const render = []
      render.push(
        <TableBody>
          {district.officer.first_name}
          &nbsp;
          {district.officer.last_name}
        </TableBody>
      )
      render.push(
        <TableBody>
          {district.first_name}
          &nbsp;
          {district.last_name}
        </TableBody>
      )

      render.push(<TableBody>{dateToLocalString(district.created_at)}</TableBody>)
      render.push(<TableBody>{district.rating}</TableBody>)
      render.push(<SurveyStatus surveyResponse={district} />)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="View"
            color="secondary"
            variant="small"
            startIcon={<ViewSvg color="#323C47" />}
            click={() => {
              history.push(`response-details/${district.id}`)
            }}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }, [citizens])

  return (
    <div className="search_citizen">
      <SearchCitizenHeading className=" d-flex justify-content-center py-3">
        Search reviews by citizens name
      </SearchCitizenHeading>
      <OfficerCard>
        <Grid container direction="row" justify="flex-start" spacing={5}>
          <Grid item xs={12} sm={12} md={4}>
            <OfficerSearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onSearchClick={fetchCitizenAPI}
              placeholder="Search reviews by citizen's name"
              label="Search reviews by citizen's name"
            />
          </Grid>
        </Grid>
      </OfficerCard>
      <OfficerTable
        showSpinner={tableLoadSpinner}
        headers={['Officer', 'Citizen Name', 'Date & Time', 'Rating', 'Status', 'Action']}
        data={officerListData}
        pagination
        onChangePage={handleChangePage}
        pageLimit={pageLimit}
        disableNext={surveyResponseCitizen.links.next == null}
        disablePrevious={surveyResponseCitizen.links.previous == null}
        totalCount={surveyResponseCitizen.total}
        page={page}
      />
    </div>
  )
}
export default SearchByCitizen
