/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container, Grid, Paper, TextField, Typography } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getAPI } from '../../utils/api'
import OfficerButton from '../Common/OfficerButton/OfficerButton'
import OfficerTable from '../Common/OfficerTable/OfficerTable'
import DateRangeSelector from '../Common/DateRangeSelector'
import moment from 'moment'
import { convertDateToFormatedString, dateToLocalString } from '../../utils/helpers'
import Autocomplete from '@material-ui/lab/Autocomplete'
import OfficerLineGraph from '../Common/OfficerLineGraph'
import OfficerDountGraph from '../Common/OfficerDountGraph'
import SurveyStatus from '../Common/SurveyStatus/SurveyStatus'
import BackspaceIcon from '@material-ui/icons/Backspace'
import { adminSurveyByDepartment, adminDistrictByDepartment, adminDepartments } from '../../utils/apiUrls'

const AdminDashboard = () => {
  const pageLimit = 15
  const [avgRating, setAvgRating] = useState([])
  const [fetching, setFetching] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState({})
  const [selectedRating, setSelectedRating] = useState(-1)
  const [createdDate, setCreatedDate] = useState([])
  const [endDate, setEndDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const dateOffset = 24 * 60 * 60 * 1000 * 10
  const history = useHistory()
  const [tableLoadSpinner, setTableLoadSpinner] = useState(false)
  const [officerListData, setOfficerListData] = useState([])
  const [districts, setDistricts] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [surveyResponsesByDepartment, setSurveyResponsesByDepartment] = useState({
    links: {
      next: null,
      previous: null
    },
    data: [],
    total: 0,
    pie_chart: [],
    avg_rating: 0
  })
  const [query, setQuery] = useState({})

  useEffect(() => {
    setup()
    fetchDepartmentsAPI()
    fetchDistrictsAPI()
  }, [selectedDepartment])

  useEffect(() => {
    if (query.start_date) fetchSurveyResponsesByDepartment()
  }, [query])

  useEffect(() => {
    if (selectedRating === -1) {
      var obj = query
      delete obj.rating
      setQuery({ ...obj })
    } else {
      setQuery({
        ...query,
        rating: selectedRating
      })
    }
  }, [selectedRating])

  useEffect(() => {
    const list = []
    surveyResponsesByDepartment.data.map(surveyResponse => {
      const render = []
      render.push(
        <p align="center">
          {surveyResponse.officer.first_name}
          {surveyResponse.officer.last_name}
        </p>
      )
      render.push(
        <p align="center">
          {surveyResponse.first_name}
          {surveyResponse.last_name}
        </p>
      )

      render.push(<p align="center">{dateToLocalString(surveyResponse.created_at)}</p>)
      render.push(<p align="center">{surveyResponse.rating}</p>)
      render.push(<SurveyStatus surveyResponse={surveyResponse} />)
      render.push(
        <Grid
          // direction="row"
          container
          alignItems="center"
          justify="space-evenly">
          <Container direction="row">
            <OfficerButton
              buttonName="View"
              color="default"
              size="small"
              variant="contained"
              align="center"
              startIcon={<VisibilityIcon />}
              click={() => {
                history.push(`response-details/${surveyResponse.id}`, query)
              }}
            />
          </Container>
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }, [surveyResponsesByDepartment])

  const setup = async () => {
    const date = new Date()
    date.setTime(endDate.getTime() - dateOffset)
    await setStartDate(date)
    setQuery({
      page: 1,
      page_size: pageLimit,
      start_date: convertDateToFormatedString(date),
      end_date: convertDateToFormatedString(endDate)
    })
  }
  const fetchSurveyResponsesByDepartment = async () => {
    if (selectedDepartment) {
      setTableLoadSpinner(true)
      setFetching(true)
      const response = await getAPI(`${adminSurveyByDepartment}${selectedDepartment}`, query, {
        date_now: moment().utc().format('MM-DD-YYYY HH:mm a')
      })
      const data = response.data.data
      if (!response.isError) {
        setTableLoadSpinner(false)
        setFetching(false)
        setSurveyResponsesByDepartment(data)
        const arr_rating = data.line_graph.map(item => item.rating__avg)
        const arr_date = data.line_graph.map(item => item.created_at__date.substring(0, 10))
        setAvgRating(arr_rating)
        setCreatedDate(arr_date)
      }
    }
  }

  const fetchDistrictsAPI = async () => {
    if (selectedDepartment) {
      const response = await getAPI(`${adminDistrictByDepartment}${selectedDepartment}`)
      !response.isError && setDistricts(response.data.data.data)
    }
  }
  const fetchDepartmentsAPI = async () => {
    const response = await getAPI(adminDepartments)

    !response.isError && setDepartments(response.data.data.data)
  }

  const handleChangePage = newPage => {
    setQuery({
      ...query,
      page: newPage
    })
  }
  const onDateSelect = (startDate, endDate) => {
    setStartDate(startDate)
    setEndDate(endDate)
    const startDateStr = convertDateToFormatedString(startDate)
    const endDateStr = convertDateToFormatedString(endDate)

    if (startDateStr === endDateStr) {
      return
    }

    setQuery({
      ...query,
      start_date: startDateStr,
      end_date: endDateStr
    })
  }

  return (
    <>
      <Grid container item xs={12} sm={12} spacing={1}>
        <Box component={Grid} item xs={12} sm={12} alignContent="center">
          <Box component={Paper} p={3}>
            <Typography variant="h5" component="h1" gutterBottom>
              Select Department
            </Typography>
            <Autocomplete
              id="combo-box-demo"
              options={departments}
              onChange={(event, newValue) => {
                return (newValue != null) & setSelectedDepartment(newValue.id)
              }}
              // getOptionLabel={(option) => option.name}
              getOptionLabel={option => (option.name ? option.name : '')}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Departments"
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="Department"
                />
              )}
            />
          </Box>
        </Box>
        <Grid container item xs={12} sm={12} spacing={1}>
          <Box component={Grid} item xs={12} display="flex" flexDirection="row" justifyContent="space-between">
            <Box component={Grid} item xs={12}>
              <DateRangeSelector onDateSelect={onDateSelect} startDate={startDate} endDate={endDate} />
            </Box>
            <Box display="flex" justifyContent="flex-end" component={Grid} item spacing={2} xs={12}>
              <Box marginRight={1}>
                {query.rating ? (
                  <OfficerButton
                    buttonName="Clear Filter"
                    startIcon={<BackspaceIcon />}
                    color="secondary"
                    variant="contained"
                    size="small"
                    click={() => {
                      setSelectedRating(-1)
                    }}
                    align="right"
                  />
                ) : null}
              </Box>
              <Box>
                {query.district ? (
                  <OfficerButton
                    buttonName={'Clear District'}
                    startIcon={<BackspaceIcon />}
                    color="secondary"
                    size="small"
                    variant="contained"
                    click={() => {
                      var obj = query
                      delete obj.district
                      setQuery({ ...obj })
                      setSelectedDistrict(null)
                    }}
                    align="right"
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid container item xs={12} sm={12} spacing={3}>
          <Box component={Grid} item xs={12} sm={6}>
            <Box component={Paper} p={1} textAlign="center">
              <Typography>Total Surveys</Typography>
              <Typography variant="h2">{surveyResponsesByDepartment.total}</Typography>
            </Box>
          </Box>
          <Box component={Grid} item xs={12} sm={6}>
            <Box component={Paper} p={1} textAlign="center">
              <Typography>Rating</Typography>
              <Typography variant="h2">{surveyResponsesByDepartment.avg_rating}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Box component={Paper} p={2}>
            <OfficerLineGraph isFetching={fetching} xaxisList={createdDate} yaxisList={avgRating} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} spacing={3}>
          <Box component={Paper} p={2}>
            <OfficerDountGraph
              isFetching={fetching}
              list={surveyResponsesByDepartment.pie_chart}
              onSelect={setSelectedRating}
            />
          </Box>
          <Box component={Paper} mt={3} p={2}>
            <Typography variant="h5" component="h2">
              Filter
            </Typography>

            <Autocomplete
              id="combo-box-demo"
              options={districts}
              value={selectedDistrict}
              onChange={(event, newValue) => {
                return (
                  (newValue != null) &
                  setQuery({
                    ...query,
                    district: newValue.id
                  }) &
                  setSelectedDistrict({
                    ...newValue
                  })
                )
              }}
              // getOptionLabel={(option) => option.name}
              getOptionLabel={option => (option.name ? option.name : '')}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Precinct/District"
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="Precinct/District"
                />
              )}
            />
          </Box>
        </Grid>

        <OfficerTable
          showSpinner={tableLoadSpinner}
          headers={['Officer Name', 'Citizen Name', 'Time', 'Rating', 'Status', 'Action']}
          headerColor="#00349A"
          data={officerListData}
          pagination
          onChangePage={handleChangePage}
          pageLimit={query.page_size}
          disableNext={surveyResponsesByDepartment.links.next == null}
          disablePrevious={surveyResponsesByDepartment.links.previous == null}
          totalCount={surveyResponsesByDepartment.total}
          page={query.page}
          emptyPlaceholder="Department Not Selected"
        />
      </Grid>
    </>
  )
}

export default AdminDashboard
