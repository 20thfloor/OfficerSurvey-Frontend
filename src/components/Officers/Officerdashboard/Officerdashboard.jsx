/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Box } from '@material-ui/core'
import { BASE_URL, getAPI } from '../../../utils/api'
import { useParams, useHistory } from 'react-router-dom'
import OfficerTable from '../../Common/OfficerTable/OfficerTable'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerLineGraph from '../../Common/OfficerLineGraph'
import OfficerDountGraph from '../../Common/OfficerDountGraph'
import { convertDateToFormatedString } from '../../../utils/helpers'
import DateRangeSelector from '../../Common/DateRangeSelector'
import { getUserId } from '../../../utils/localStorage'
import moment from 'moment'
import SurveyStatus from '../../Common/SurveyStatus/SurveyStatus'
import './officerdashboard-styles.css'
import { surveyResponseOfficerUrl } from '../../../utils/apiUrls'
import { dateToLocalString } from '../../../utils/helpers'
import { useSelector, useDispatch } from 'react-redux'
import { setStartDate, setEndDate } from '../../../redux/actions'
import { OfficerCard, StarMarker } from '../../Common'
import {
  TableBody,
  ExportBtnExternal,
  PublicScore,
  PublicSentiment,
  PublicScoreText,
  StarText,
  StarDiv
} from './OfficerDashboardStyle'

const Officerdashboard = () => {
  const pageLimit = 5
  const [officerData, setOfficerData] = useState({
    links: {
      next: null,
      previous: null
    },
    data: [],
    pie_chart: []
  })

  const startDate = useSelector(state => state.date.start_date)
  const endDate = useSelector(state => state.date.end_date)
  const [query, setQuery] = useState({
    page: 1,
    page_size: pageLimit,
    start_date: convertDateToFormatedString(startDate),
    end_date: convertDateToFormatedString(endDate)
  })
  const dispatch = useDispatch()

  const [officerTableData, setOfficerTableData] = useState([])
  const [avgRating, setAvgRating] = useState([])
  const [fetching, setFetching] = useState(true)
  const [createdAt, setCreatedAt] = useState([])
  const [selectedRating, setSelectedRating] = useState(-1)
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [percentage, setPercentage] = useState()

  const [userId, setUserId] = useState()
  let { detailIdOfficer } = useParams()
  const history = useHistory()

  const fetchOfficerDetails = async () => {
    const detailsOfficerId = await getUserId()
    setUserId(detailsOfficerId)
    detailIdOfficer === undefined && (detailIdOfficer = detailsOfficerId)
    setFetching(true)
    setTableLoadSpinner(true)
    const response = await getAPI(`${surveyResponseOfficerUrl}${detailIdOfficer}`, query, {
      date_now: moment().utc().format('MM-DD-YYYY HH:mm a')
    })
    const data = response.data.data
    if (!response.isError) {
      const temp = (data.avg_rating * 100) / 5
      setPercentage(temp.toFixed(0))
      setTableLoadSpinner(false)
      setFetching(false)
      setOfficerData(data)
      const RatingArray = data.line_graph.map(item => item.rating__avg)
      const DateArray = data.line_graph.map(item => item.created_at__date.substring(0, 10))
      setAvgRating(RatingArray)
      setCreatedAt(DateArray)
    }
  }

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
    if (query.start_date) fetchOfficerDetails()
  }, [query])

  useEffect(() => {
    const list = []

    officerData.data.map(surveyResponse => {
      const render = []
      render.push(
        <TableBody>
          {surveyResponse.first_name} {surveyResponse.last_name}
        </TableBody>
      )
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
              history.push(`/response-details/${surveyResponse.id}`)
            }}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerTableData(list)
  }, [officerData])

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
    <Grid container spacing={1}>
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

      <Grid item xs={12} sm={8}>
        <OfficerTable
          showSpinner={tableLoadSpinner}
          headers={['Citizen Name', 'Time', 'Rating', 'Status', 'Action']}
          data={officerTableData}
          pagination
          onChangePage={handleChangePage}
          pageLimit={query.page_size}
          disableNext={officerData.links.next == null}
          disablePrevious={officerData.links.previous == null}
          totalCount={officerData.total}
          page={query.page}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <div style={{ height: '77%' }}>
          <Box display="flex" justifyContent="center">
            <ExportBtnExternal>
              <a
                className="exportButtonInternal"
                href={`${BASE_URL}export-data/${userId}/?start_date=${query.start_date}&end_date=${
                  query.end_date
                }&hours=${moment().utcOffset()}`}
                target="_blank"
                rel="noopener noreferrer"
                download>
                Export Data
              </a>
            </ExportBtnExternal>
          </Box>
          <Box mt={2}>
            <DateRangeSelector onDateSelect={onDateSelect} startDate={startDate} endDate={endDate} />
          </Box>
          <OfficerCard pt="8px" pb="8px" pl="8px" pr="8px" shouldFullHeight>
            <div className="d-flex align-items-center">
              <PublicSentiment>Public Sentiment Score</PublicSentiment>
            </div>
            <hr style={{ marginTop: '8px', marginBottom: '4px' }} />
            <Grid container>
              <Grid item xs={12} sm={12}>
                {officerData && officerData.avg_rating > 0 ? (
                  <OfficerDountGraph
                    isFetching={fetching}
                    list={officerData.pie_chart}
                    onSelect={setSelectedRating}
                    percent={percentage}
                  />
                ) : (
                  <div className="d-flex justify-content-around align-items-center donut-chart">
                    <strong>0%</strong>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <div className="d-flex justify-content-around h-100">
                  <div>
                    <PublicScoreText>PSS Score</PublicScoreText>
                    <PublicScore>{officerData.avg_rating}</PublicScore>
                  </div>
                  <div>
                    <PublicScoreText>Total Responses</PublicScoreText>
                    <PublicScore>{officerData.total}</PublicScore>
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="d-flex justify-content-around mt-2">
              <StarDiv>
                <StarMarker color="#E90005" />
                <StarText>1 Star</StarText>
              </StarDiv>
              <StarDiv>
                <StarMarker color="#FA9729" />
                <StarText>2 Star</StarText>
              </StarDiv>
              <StarDiv>
                <StarMarker color="#FBBD0D" />
                <StarText>3 Star</StarText>
              </StarDiv>
              <StarDiv>
                <StarMarker color="#90D04F" />
                <StarText>4 Star</StarText>
              </StarDiv>
              <StarDiv>
                <StarMarker color="#14A352" />
                <StarText>5 Star</StarText>
              </StarDiv>
            </div>

            <div className="mt-3 pb-4">
              <OfficerButton
                buttonName="Demographics"
                color="officer"
                variant="medium"
                click={() => history.push('/demographics-officer')}
                align="center"
              />
            </div>
          </OfficerCard>
        </div>
      </Grid>
      <Grid item sm={12}>
        <OfficerCard pt="8px">
          <OfficerLineGraph isFetching={fetching} xaxisList={createdAt} yaxisList={avgRating} />
        </OfficerCard>
      </Grid>
    </Grid>
  )
}
export default Officerdashboard
