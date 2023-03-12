import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { getAPI } from '../../utils/api'
import DateRangeSelector from '../Common/DateRangeSelector'
import { convertDateToFormatedString } from '../../utils/helpers'
import { demographicResponses } from '../../utils/apiUrls'
import { useSelector, useDispatch } from 'react-redux'
import { setStartDate, setEndDate } from '../../redux/actions'
import { OfficerCard } from '../Common'
import { Chip } from './DemographyStyle'
import OfficerLoader from '../Common/OfficerLoader/OfficerLoader'
import OfficerDistributedBarGraph from '../Common/OfficerDistributedBarGraph/OfficerDistributedBarGraph'
import OfficerDemographicDountGraph from '../Common/OfficerDemographicDonutGraph.jsx'
import moment from 'moment'
import './DemographicCss.css'
import ReactToPdf from 'react-to-pdf'
const ref = React.createRef()
const options = {
  orientation: 'landscape',
  unit: 'in'
}

const Dempgraphy = () => {
  const dispatch = useDispatch()
  const [surveyFetchingSpinner, setSurveyFetchingSpinner] = useState(false)
  const [ageLabels, setAgeLabels] = useState([])
  const [agePercentage, setAgePercentage] = useState([])
  const [raceLabels, setRaceLabels] = useState([])
  const [racePercentage, setRacePercentage] = useState([])
  const [genderLabels, setGenderLabels] = useState([])
  const [genderPercentage, setGenderPercentage] = useState([])
  const [data, setData] = useState({
    age: {
      age_count: []
    },
    race: {
      race_count: []
    },
    gender: {
      gender_count: []
    }
  })

  const startDate = useSelector(state => state.date.start_date)
  const endDate = useSelector(state => state.date.end_date)
  const [query, setQuery] = useState({
    start_date: convertDateToFormatedString(startDate),
    end_date: convertDateToFormatedString(endDate)
  })
  const raceColor = ['#538DF8', '#F4CB5F', '#66AEC0', '#9654F7', '#DD4D41', '#7EDABC', '#61AC6D']
  const genderColor = ['#538DF8', '#F4CB5F', '#9654F7']
  const barColors = ['#538DF8', '#F4CB5F', '#9654F7', '#61AC6D', '#7EDABC', '#DD4D41']

  useEffect(() => {
    if (query.start_date) fetchData()
  }, [query]) //eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setSurveyFetchingSpinner(true)
    const response = await getAPI(demographicResponses, query, {
      date_now: moment().utc().format('MM-DD-YYYY HH:mm a')
    })
    const res = response.data.data.data.demo_grpahic_response
    if (!response.isError) {
      setData(res)
      setSurveyFetchingSpinner(false)
    } else {
      setSurveyFetchingSpinner(false)
    }
  }

  useEffect(() => {
    var ageLabelsArr = data.age.age_count.map(item => item.choice__choice)
    var agePercentageArr = data.age.age_count.map(item =>
      parseFloat(((item.choice__count / data.age.age_question_count) * 100).toFixed(2))
    )

    setAgeLabels(ageLabelsArr)
    setAgePercentage([...agePercentageArr])

    var genderLabelsArr = data.gender.gender_count.map(item => item.choice__choice)
    var genderPercentageArr = data.gender.gender_count.map(item =>
      parseFloat(((item.choice__count / data.gender.gender_question_count) * 100).toFixed(2))
    )

    setGenderLabels(genderLabelsArr)
    setGenderPercentage(genderPercentageArr)

    var raceLabelsArr = data.race.race_count.map(item => item.choice__choice)
    var racePercentageArr = data.race.race_count.map(item =>
      parseFloat(((item.choice__count / data.race.race_question_count) * 100).toFixed(2))
    )
    setRaceLabels(raceLabelsArr)
    setRacePercentage(racePercentageArr)
  }, [data])

  const onDateSelect = (startDate, endDate) => {
    dispatch(setStartDate(startDate))
    dispatch(setEndDate(endDate))
    const startDateStr = convertDateToFormatedString(startDate)
    const endDateStr = convertDateToFormatedString(endDate)
    setQuery({
      ...query,
      start_date: startDateStr,
      end_date: endDateStr
    })
  }

  return (
    <>
      <Grid container direction="row" justify="flex-end" alignItems="center">
        <Grid item xs={12} sm={4}>
          <DateRangeSelector onDateSelect={onDateSelect} startDate={startDate} endDate={endDate} />
        </Grid>
      </Grid>
      <OfficerCard>
        <div ref={ref}>
          <OfficerLoader isFetching={surveyFetchingSpinner}>
            <Grid>
              <div className="column-graph-content">
                <div className="d-flex">
                  <Chip className="column-heading">Age</Chip>
                  <headingText style={{ paddingTop: '9px' }}>reported by the respondent</headingText>
                </div>
                <OfficerDistributedBarGraph
                  seriesName={'Percentage'}
                  xaxisList={agePercentage}
                  yaxisList={ageLabels}
                  colors={barColors}
                  categories={ageLabels}
                  tickAmount={4}
                  min={0}
                  max={100}
                  floating={false}
                  decimalsInFloat={false}
                />
              </div>
            </Grid>
            <div className="d-flex justify-content-between">
              <div style={{ width: '45%' }} className="border rounded">
                <div className="d-flex justify-content-center pt-3">
                  <Chip className="column-heading">Gender</Chip>
                  <headingText style={{ paddingTop: '9px' }}>reported by the respondent</headingText>
                </div>
                <OfficerDemographicDountGraph
                  seriesName={''}
                  xaxisList={genderPercentage}
                  label={genderLabels}
                  color={genderColor}
                />
              </div>
              <div style={{ width: '45%' }} className="border rounded">
                <div className="d-flex justify-content-center pt-3">
                  <Chip className="column-heading">Race</Chip>
                  <headingText style={{ paddingTop: '9px' }}>reported by the respondent</headingText>
                </div>
                <OfficerDemographicDountGraph
                  seriesName={''}
                  xaxisList={racePercentage}
                  yaxisList={raceLabels}
                  label={raceLabels}
                  color={raceColor}
                />
              </div>
            </div>
          </OfficerLoader>
        </div>
        <div className="d-flex justify-content-end mt-5">
          <ReactToPdf targetRef={ref} filename="demography.pdf" options={options} scale={0.7}>
            {({ toPdf }) => (
              <button className="btn-export my-3" onClick={toPdf}>
                Export
              </button>
            )}
          </ReactToPdf>
        </div>
      </OfficerCard>
    </>
  )
}
export default Dempgraphy
