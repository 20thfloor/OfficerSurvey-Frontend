/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { Grid } from '@material-ui/core'

import { getAPI } from '../../utils/api'
import Marker from './Marker'
import OfficerTable from '../Common/OfficerTable'
import OfficerButton from '../Common/OfficerButton'
import OfficerSearchBar from '../Common/OfficerSearchBar'
import { useHistory } from 'react-router-dom'
import { responseByZip } from '../../utils/apiUrls'
import { dateToLocalString } from '../../utils/helpers'
import { OfficerCard } from '../Common'
import { RedCircle, YellowCircle, GreenCircle, TableBody, MapHeading } from './MapStyle'
import { ViewSvg } from '../../utils/svgs'
import PropTypes from 'prop-types'

const SurveyMap = props => {
  SurveyMap.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const defaultProps = {
    center: {
      lat: 37.0902,
      lng: -95.7129
    },
    zoom: 4
  }

  const pageLimit = 10
  const [surveyResponse, setSurveyResponse] = useState({
    links: {
      next: null,
      previous: null
    },
    data: []
  })
  const [query, setQuery] = useState({
    page: 1,
    page_size: pageLimit
  })
  const [fetching, setFetching] = useState(true)
  const history = useHistory()
  const [zipCodeListData, setZipCodeListData] = useState([])
  const [zipCodes, setZipCodes] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const fetchZipCodesAPI = async () => {
    setFetching(true)
    var q = query
    if (searchValue !== '')
      q = {
        ...query,
        zip_code: searchValue
      }
    const response = await getAPI(responseByZip, q)
    const data = response.data.data
    if (!response.isError) {
      setFetching(false)
      setZipCodes(data.zip_code_list)
      setSurveyResponse(data)
    } else {
      props.notify(response.error.message, 'error')
    }
  }

  useEffect(() => {
    fetchZipCodesAPI()
  }, [query])

  const handleChangePage = newPage => {
    setQuery({
      ...query,
      page: newPage
    })
  }

  const handleOnClickZip = zip => {
    setSearchValue(zip.toString())
  }
  useEffect(() => {
    fetchZipCodesAPI()
  }, [searchValue])

  useEffect(() => {
    const list = []
    surveyResponse.data.map(surveyResponse => {
      const render = []
      render.push(
        <TableBody>
          {surveyResponse.first_name}
          &nbsp;
          {surveyResponse.last_name}
        </TableBody>
      )

      render.push(<TableBody>{dateToLocalString(surveyResponse.created_at)}</TableBody>)
      render.push(<TableBody>{surveyResponse.rating}</TableBody>)
      render.push(
        <TableBody>
          {surveyResponse.officer.first_name}
          &nbsp;
          {surveyResponse.officer.last_name}
        </TableBody>
      )

      render.push(<TableBody>{surveyResponse.officer.badge_number}</TableBody>)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="View"
            color="primary"
            variant="small"
            startIcon={<ViewSvg color="white" />}
            click={() => {
              history.push(`response-details/${surveyResponse.id}`)
            }}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setZipCodeListData(list)
  }, [surveyResponse])

  return (
    <div>
      <div className="d-flex justify-content-center py-2">
        <MapHeading>Location based engagement overall reviews by your zip codes</MapHeading>
      </div>
      <OfficerCard>
        <Grid container direction="row" justify="flex-start" spacing={5}>
          <Grid item xs={12} sm={12} md={4}>
            <OfficerSearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onSearchClick={null}
              placeholder="Search Zip Code"
              label="Search Zip Code"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <div className="d-flex justify-content-center pt-3">
              <RedCircle />
              <p className="px-2"> 1-2 rating</p>

              <YellowCircle />
              <p className="px-2">3-4 rating</p>

              <GreenCircle />
              <p className="px-2"> 5 rating</p>
            </div>
          </Grid>
        </Grid>
      </OfficerCard>

      <GoogleMapReact
        style={{ height: '70vh', position: 'relative' }}
        bootstrapURLKeys={{ key: 'AIzaSyDcpGAfaBR1uFQvki-3z46SOB883GSoTcU' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={map => ({ mapTypeId: map.MapTypeId.ROADMAP })}>
        {zipCodes.map((item, index) => (
          <Marker
            lat={item.latitude}
            lng={item.longitude}
            name={item.zip_code}
            rating={item.rating__avg}
            rating_count={item.rating__count}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={handleOnClickZip}
            color={item.rating__avg >= 4 ? 'green' : item.rating__avg < 4 && item.rating__avg > 2 ? 'yellow' : 'red'}
          />
        ))}
      </GoogleMapReact>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          {query.rating ? (
            <OfficerButton
              buttonName="Clear Filter"
              color="secondary"
              variant="contained"
              click={() => {
                var obj = query
                obj = delete obj.rating
                setQuery(obj)
              }}
              align="right"
              size="small"
            />
          ) : null}
        </Grid>
        <Grid item xs={12} sm={12}>
          <OfficerTable
            showSpinner={fetching}
            headers={['Citizen Name', 'Time', 'Rating', 'Officer Name', 'Badge Number', 'Action']}
            data={zipCodeListData}
            pagination
            onChangePage={handleChangePage}
            pageLimit={query.page_size}
            disableNext={surveyResponse.links.next == null}
            disablePrevious={surveyResponse.links.previous == null}
            totalCount={surveyResponse.total}
            page={query.page}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default SurveyMap
