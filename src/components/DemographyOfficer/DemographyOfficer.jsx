import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { getAPI, BASE_URL } from '../../utils/api'
import DateRangeSelector from '../Common/DateRangeSelector'
import { convertDateToFormatedString } from '../../utils/helpers'
import { demographicResponseOfficer, exportDemographyOfficer } from '../../utils/apiUrls'
import OfficerPieGraph from '../Common/OfficerPieGraph/OfficerPieGraph'
import { useSelector, useDispatch } from 'react-redux'
import { setStartDate, setEndDate } from '../../redux/actions'
import { OfficerCard } from '../Common'
import { Chip, ExportBtnExternal, Anchor, LabelText } from './DempographyStyle'
import OfficerLoader from '../Common/OfficerLoader/OfficerLoader'
import moment from 'moment'
import './Style.css'

const DempgraphyOfficer = () => {
  const dispatch = useDispatch()
  const officerId = useSelector(state => state.user.user.id)
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
  var colorsArray = [
    '#007bff',
    '#fcbf07',
    '#8E30FF',
    '#EA0102',
    '#0ca550',
    '#26D7AE',
    '#17a2b8',
    '#ffc107',
    '#6610f2',
    '#dc3545'
  ]

  useEffect(() => {
    if (query.start_date) fetchData()
  }, [query]) //eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setSurveyFetchingSpinner(true)
    const response = await getAPI(demographicResponseOfficer, query, {
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
        <OfficerLoader isFetching={surveyFetchingSpinner}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <div className="d-flex justify-content-center align-items-center">
                <Chip>Age</Chip>
              </div>
              <OfficerPieGraph xaxisList={agePercentage} yaxisList={ageLabels} />
              <div className="d-flex justify-content-center align-items-center" key="label">
                <div className="d-flex flex-column justify-content-end" key="label">
                  {ageLabels.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className="d-flex justify-content-right align-items-center">
                      <>
                        <div
                          style={{
                            width: '15px',
                            height: '15px',
                            background: colorsArray[index]
                          }}
                          key="label1"
                        />
                        <LabelText key="label3">{item}</LabelText>
                      </>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="d-flex justify-content-center align-items-center">
                <Chip>Gender</Chip>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <OfficerPieGraph xaxisList={genderPercentage} yaxisList={genderLabels} />
              </div>
              <div className="d-flex justify-content-center align-items-center" key="label">
                <div className="d-flex flex-column justify-content-end" key="label">
                  {genderLabels.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className="d-flex justify-content-right align-items-center">
                      <>
                        <div
                          style={{
                            width: '15px',
                            height: '15px',
                            background: colorsArray[index]
                          }}
                          key="label1"
                        />
                        <LabelText key="label3">{item}</LabelText>
                      </>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <div className="d-flex justify-content-center align-items-center">
                <Chip>Race</Chip>
              </div>

              <OfficerPieGraph xaxisList={racePercentage} yaxisList={raceLabels} />
              <div className="d-flex justify-content-center align-items-center" key="label">
                <div className="d-flex flex-column justify-content-end" key="label">
                  {raceLabels.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className="d-flex justify-content-right align-items-center">
                      <>
                        <div
                          style={{
                            width: '15px',
                            height: '15px',
                            background: colorsArray[index]
                          }}
                          key="label1"
                        />
                        <LabelText key="label3">{item}</LabelText>
                      </>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
          </Grid>
        </OfficerLoader>

        <div className="d-flex justify-content-end mt-5">
          <ExportBtnExternal>
            <Anchor
              href={`${BASE_URL}${exportDemographyOfficer}/${officerId}?start_date=${query.start_date}&end_date=${
                query.end_date
              }&hours=${moment().utcOffset()}`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="anchortext">
              Export
            </Anchor>
          </ExportBtnExternal>
        </div>
      </OfficerCard>
    </>
  )
}
export default DempgraphyOfficer
