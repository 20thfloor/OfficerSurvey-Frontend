/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getAPI } from '../../utils/api'
import OfficerButton from '../Common/OfficerButton/OfficerButton'
import OfficerTable from '../Common/OfficerTable/OfficerTable'
import DateRangeSelector from '../Common/DateRangeSelector'
import { convertDateToFormatedString, dateToLocalString } from '../../utils/helpers'
import OfficerDountGraph from '../Common/OfficerDountGraph'
import SurveyStatus from '../Common/SurveyStatus/SurveyStatus'
import './SupervisorDashboardStyle.css'
import moment from 'moment'
import { surveyResponseUrl, districtUrl } from '../../utils/apiUrls'
import { useSelector, useDispatch } from 'react-redux'
import { setStartDate, setEndDate } from '../../redux/actions'
import { TableBody, PublicScore, PublicSentiment, PublicScoreText, StarText, StarDiv } from './SupervisorDashboardStyle'
import { OfficerCard, StarMarker, OfficerAutocomplete, OfficerSmilegraph, OfficerDistributedBarGraph } from '../Common'
import { getUserId } from '../../utils/localStorage.js'

const SupervisorDashboard = () => {
  const pageLimit = 5
  const startDate = useSelector(state => state.date.start_date)
  const endDate = useSelector(state => state.date.end_date)
  const [query, setQuery] = useState({
    page: 1,
    page_size: pageLimit,
    start_date: convertDateToFormatedString(startDate),
    end_date: convertDateToFormatedString(endDate)
  })

  const [avgRating, setAvgRating] = useState([])
  const [fetching, setFetching] = useState(false)
  const [selectedRating, setSelectedRating] = useState(-1)
  const [createdDate, setCreatedDate] = useState([])
  const history = useHistory()

  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [officerListData, setOfficerListData] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState(undefined)
  const [surveyResponse, setSurveyResponse] = useState({
    links: {
      next: null,
      previous: null
    },
    data: [],
    pie_chart: []
  })
  const dispatch = useDispatch()
  const [percentage, setPercentage] = useState()
  const Color = ['#F4CB5F', '#66AEC0', '#9654F7', '#DD4D41', '#7EDABC', '#61AC6D']

  useEffect(() => {
    fetchDistrictsAPI()
  }, [])

  useEffect(() => {
    if (query.start_date) fetchSurveyResponse()
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
    surveyResponse.data.map(surveyResponse => {
      const render = []
      render.push(<TableBody>{`${surveyResponse.officer.first_name}  ${surveyResponse.officer.last_name}`}</TableBody>)
      render.push(<TableBody>{`${surveyResponse.first_name} ${surveyResponse.last_name}`}</TableBody>)

      render.push(<TableBody>{dateToLocalString(surveyResponse.created_at)}</TableBody>)
      render.push(<TableBody>{surveyResponse.rating}</TableBody>)
      render.push(<SurveyStatus surveyResponse={surveyResponse} />)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="View"
            color="secondary"
            variant="small"
            click={() => {
              history.push(`response-details/${surveyResponse.id}`)
            }}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }, [surveyResponse])

  const fetchSurveyResponse = async () => {
    const userId = await getUserId()
    if (userId) {
      setTableLoadSpinner(true)
      setFetching(true)
      const response = await getAPI(surveyResponseUrl, query, {
        date_now: moment().utc().format('MM-DD-YYYY HH:mm a')
      })
      const data = response.data.data
      if (!response.isError) {
        const temp = (data.avg_rating * 100) / 5
        setPercentage(temp.toFixed(0))
        setTableLoadSpinner(false)
        setFetching(false)
        setSurveyResponse(data)

        const arr_rating = data.line_graph.map(item => item.rating__avg)
        const arr_date = data.line_graph.map(item => item.created_at__date.substring(0, 10))
        setAvgRating(arr_rating)
        setCreatedDate(arr_date)
      }
    }
  }

  const fetchDistrictsAPI = async () => {
    const userId = await getUserId()
    if (userId) {
      const response = await getAPI(districtUrl)
      if (!response.isError) {
        const data = response.data.data.data
        setDistricts(data)
      }
    }
  }

  const handleChangePage = newPage => {
    setQuery({
      ...query,
      page: newPage
    })
  }
  const onDateSelect = (startDate, endDate) => {
    dispatch(setStartDate(startDate))
    dispatch(setEndDate(endDate))
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
      <Grid container spacing={2}>
        <Grid container item xs={12} sm={12} spacing={1}>
          <Box component={Grid} item xs={12} display="flex" flexDirection="row" justifyContent="space-between">
            <Box component={Grid} item xs={12} display="flex">
              <Box marginLeft={1}>
                {query.district ? (
                  <OfficerButton
                    buttonName="Clear District"
                    color="secondary"
                    variant="medium"
                    click={() => {
                      var obj = query
                      delete obj.district
                      setQuery({ ...obj })
                      setSelectedDistrict(null)
                    }}
                  />
                ) : null}
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" component={Grid} item xs={12}>
              <Box marginRight={1}>
                {query.rating ? (
                  <OfficerButton
                    buttonName="Clear Filter"
                    color="secondary"
                    variant="medium"
                    click={() => {
                      setSelectedRating(-1)
                    }}
                    align="right"
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} style={{ marginTop: '24px' }}>
          <div className="officer_table">
          <OfficerTable
            showSpinner={tableLoadSpinner}
            headers={['Officer', 'Citizen', 'Date & Time', 'Rating', 'Status', 'Action']}
            data={officerListData}
            pagination
            onChangePage={handleChangePage}
            pageLimit={query.page_size}
            disableNext={surveyResponse.links.next == null}
            disablePrevious={surveyResponse.links.previous == null}
            totalCount={surveyResponse.total}
            page={query.page}
          />
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div style={{ height: '75%' }}>
            <OfficerAutocomplete
              id="combo-box-supervisor-dashboard-assignment"
              options={districts}
              value={selectedDistrict}
              idTextfield="Precinct/District"
              name="district"
              placeholder="Filter By Division"
              onChange={(event, newValue) => {
                if (newValue !== undefined) {
                  if (newValue != null) {
                    setQuery({
                      ...query,
                      district: newValue.id
                    })
                    setSelectedDistrict(newValue)
                  }
                }
              }}
              getOptionLabel={option => (option.name ? option.name : '')}
            />
            <Box mt={2}>
              <DateRangeSelector onDateSelect={onDateSelect} startDate={startDate} endDate={endDate} />
            </Box>
            <OfficerCard pt="8px" pb="8px" pl="8px" pr="8px" shouldFullHeight>
              <div className="d-flex align-items-center">
                <PublicSentiment>Public Sentiment Score</PublicSentiment>
              </div>
              <hr style={{ marginTop: '8px', marginBottom: '4px' }} />
              <Grid container className="public-graph-star">
                <Grid item xs={12} sm={12} className="Supervisor-pie-chart">
                  {surveyResponse && surveyResponse.avg_rating > 0 ? (
                    <OfficerDountGraph
                      isFetching={fetching}
                      list={surveyResponse.pie_chart}
                      onSelect={setSelectedRating}
                      percent={percentage}
                    />
                  ) : (
                    <div className="d-flex justify-content-around align-items-center donut-chart">
                      <strong>0%</strong>
                    </div>
                  )}
                </Grid>
                <div className="Supervisor-star-rating-wrap d-flex mb-2">
                  <StarDiv className="">
                    <StarMarker color="#E90005" />
                    <StarText className="donut-graph-star">1 Star</StarText>
                  </StarDiv>
                  <StarDiv className="mr-4 ml-4">
                    <StarMarker color="#FA9729" />
                    <StarText className="donut-graph-star">2 Star</StarText>
                  </StarDiv>
                  <StarDiv className="mr-4">
                    <StarMarker color="#FBBD0D" />
                    <StarText className="donut-graph-star">3 Star</StarText>
                  </StarDiv>
                  <StarDiv className="mr-4">
                    <StarMarker color="#90D04F" />
                    <StarText className="donut-graph-star">4 Star</StarText>
                  </StarDiv>
                  <StarDiv className="">
                    <StarMarker color="#14A352" />
                    <StarText className="donut-graph-star">5 Star</StarText>
                  </StarDiv>
                </div>
                <Grid item xs={12} sm={12} className="Supervisor-pss-total-wrap">
                  <div className="Supervisor-pss-total">
                    <div className="pss-score">
                      <PublicScore className="pssScore-Supervisor">{surveyResponse.avg_rating}</PublicScore>
                      <PublicScoreText>PSS Score</PublicScoreText>
                    </div>
                    <div>
                      <PublicScore className="pssScore-Supervisor">{surveyResponse.total}</PublicScore>
                      <PublicScoreText>Total Responses</PublicScoreText>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div className="mt-3">
                <OfficerButton
                  buttonName="Demographics"
                  color="officer"
                  variant="medium"
                  click={() => history.push('./demographics')}
                  align="center"
                />
              </div>
            </OfficerCard>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <OfficerCard pt="8px">
            <OfficerSmilegraph surveyResponse={surveyResponse} list={surveyResponse.pie_chart} />
          </OfficerCard>
        </Grid>
        <Grid item xs={12} sm={12}>
          <OfficerCard pt="8px">
            <div
              className="d-flex justify-content-center align-items-center pt-5 pb-5"
              style={{ height: '36px', fontWeight: '700', fontSize: '24px', fontFamily: 'Poppins' }}>
              Trends
            </div>
            <OfficerDistributedBarGraph
              seriesName={''}
              xaxisList={avgRating}
              colors={Color}
              categories={createdDate}
              tickAmount={11}
              min={0}
              max={5}
              floating={false}
              decimalsInFloat
            />
          </OfficerCard>
        </Grid>
      </Grid>
    </>
  )
}

export default SupervisorDashboard
