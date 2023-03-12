/* eslint-disable react/jsx-one-expression-per-line */
import { Grid } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { OfficerCard } from '../../Common'
import { Question, QuestionNumber, Para, Heading, Chart } from './EmployeeReport'
import { getAPI } from '../../../utils/api'
import { empSurveyResponseReport } from '../../../utils/apiUrls'
import OfficerButton from '../../Common/OfficerButton'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import OfficerDialog from '../../Common/OfficerDialog'
import logo from '../../../assets/logo_officer.png'
import OfficerDountGraph from '../../Common/OfficerDountGraph'
import OfficerBarGraph from '../../OfficerBarGraph'
import OfficerLoader from '../../Common/OfficerLoader/OfficerLoader'
import './Style.css'
import { PDFExport } from '@progress/kendo-react-pdf'

const EmployeeSurveyResponseReport = () => {
  const pdfExportComponent = React.useRef(null)
  const [surveyFetchingSpinner, setSurveyFetchingSpinner] = useState(false)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState()
  const [textfieldArray, setTextfieldArray] = useState([])
  const [responses, setResponses] = useState()
  const [question, setQuestion] = useState()
  const [fileQuestion, setFileQuestion] = useState()
  const [fileArray, setFileArray] = useState([])
  const [openFileResponses, setOpenFileResponses] = useState(false)

  const { reportId } = useParams()
  const history = useHistory()
  const [info, setinfo] = useState([])

  const fetchReport = async () => {
    setSurveyFetchingSpinner(true)
    const response = await getAPI(`${empSurveyResponseReport}${reportId}`)
    if (!response.isError) {
      setinfo(response.data.data.data.questions)
      setResponses(response.data.data.data.count)
      setTitle(response.data.data.data.title)
      setSurveyFetchingSpinner(false)
      return
    } else {
      setSurveyFetchingSpinner(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const viewTextfieldResponse = info => {
    handleOpen()
    setQuestion(info.question)

    setTextfieldArray(info.text_responses)
  }

  const handleFileResponsesOpen = () => {
    setOpenFileResponses(true)
  }
  const handleFileResponsesClose = () => {
    setOpenFileResponses(false)
  }

  const viewFileResponse = info => {
    handleFileResponsesOpen()
    setFileQuestion(info.question)

    setFileArray(info.file_responses)
  }

  const showReviews = () => {
    let choices
    let res
    let choices2
    let res2
    let ratingPercentage
    let ratingPercentage2
    const rating = ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star']

    // eslint-disable-next-line prefer-const
    let List = []
    for (let i = 0; i < info.length; i = i + 2) {
      const firstValue = info[i]
      let secondValue = null
      if (info[i + 1]) secondValue = info[i + 1]

      choices = info[i].choices.map(item => ((item.count / info[i].count) * 100).toFixed(2))
      res = info[i].choices.map(item => item.choice)

      ratingPercentage = info[i].ratings.map(item => ((item / info[i].count) * 100).toFixed(2))

      if (secondValue) {
        choices2 = secondValue.choices.map(item => ((item.count / secondValue.count) * 100).toFixed(2))
        res2 = secondValue.choices.map(item => item.choice)
        ratingPercentage2 = secondValue.ratings.map(item => ((item / secondValue.count) * 100).toFixed(2))
      }

      List.push(
        <Grid key={`data-report-empolyee${i}`} container direction="row" justify="space-around" spacing={5}>
          <Grid item xs={12} sm={12} md={6}>
            <OfficerCard mt="0px" mb="0px" shouldFullHeight>
              <div>
                <Question>
                  <QuestionNumber className="pr-2">Q{i + 1}:</QuestionNumber>
                  {info[i].question}
                </Question>
                <div>
                  {info[i].type === 'Text Area' ? (
                    <div className="pl-5 ">
                      <OfficerButton
                        buttonName="View"
                        color="primary"
                        variant="small"
                        click={() => {
                          viewTextfieldResponse(firstValue)
                        }}
                      />
                    </div>
                  ) : info[i].type === 'Drop Down' ? (
                    <OfficerBarGraph yaxisList={res} xaxisList={choices} />
                  ) : info[i].type === 'Multiple Choice' ||
                    info[i].type === 'Poll' ||
                    info[i].type === 'Vote' ||
                    info[i].type === 'Checkbox' ? (
                    <OfficerBarGraph yaxisList={res} xaxisList={choices} />
                  ) : info[i].type === 'Rating' ? (
                    <OfficerBarGraph yaxisList={rating} xaxisList={ratingPercentage} />
                  ) : info[i].type === 'File' ? (
                    <div className="pl-5 ">
                      <OfficerButton
                        buttonName="View"
                        color="primary"
                        variant="small"
                        click={() => {
                          viewFileResponse(firstValue)
                        }}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </OfficerCard>
          </Grid>

          {info[i + 1] ? (
            <Grid key={`data-report-empolyee${i}`} item xs={12} sm={12} md={6}>
              <OfficerCard mt="0px" mb="0px" shouldFullHeight>
                <div>
                  <Question>
                    <QuestionNumber className="pr-2">Q{i + 1 + 1}:</QuestionNumber>
                    {info[i + 1].question}
                  </Question>

                  <div>
                    {info[i + 1].type === 'Text Area' ? (
                      <div className="pl-5">
                        <OfficerButton
                          buttonName="View"
                          color="primary"
                          variant="small"
                          click={() => {
                            viewTextfieldResponse(secondValue)
                          }}
                        />
                      </div>
                    ) : info[i + 1].type === 'Drop Down' ? (
                      <OfficerBarGraph yaxisList={res2} xaxisList={choices2} />
                    ) : info[i + 1].type === 'Multiple Choice' ||
                      info[i + 1].type === 'Poll' ||
                      info[i + 1].type === 'Vote' ||
                      info[i + 1].type === 'Checkbox' ? (
                      <OfficerBarGraph yaxisList={res2} xaxisList={choices2} />
                    ) : info[i + 1].type === 'Rating' ? (
                      <OfficerBarGraph yaxisList={rating} xaxisList={ratingPercentage2} />
                    ) : info[i + 1].type === 'File' ? (
                      <div className="pl-5 ">
                        <OfficerButton
                          buttonName="View"
                          color="primary"
                          variant="small"
                          click={() => {
                            viewFileResponse(secondValue)
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </OfficerCard>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={6} />
          )}
        </Grid>
      )
    }
    return List
  }

  const showReviewsPdf = () => {
    let choices
    let res
    let choices2
    let res2
    let ratingPercentage
    let ratingPercentage2
    const rating = ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star']

    // eslint-disable-next-line prefer-const
    let List = []
    for (let i = 0; i < info.length; i = i + 2) {
      let secondValue = null
      if (info[i + 1]) secondValue = info[i + 1]

      choices = info[i].choices.map(item => ((item.count / info[i].count) * 100).toFixed(2))
      res = info[i].choices.map(item => item.choice)

      ratingPercentage = info[i].ratings.map(item => ((item / info[i].count) * 100).toFixed(2))

      if (secondValue) {
        choices2 = secondValue.choices.map(item => ((item.count / secondValue.count) * 100).toFixed(2))
        res2 = secondValue.choices.map(item => item.choice)
        ratingPercentage2 = secondValue.ratings.map(item => ((item / secondValue.count) * 100).toFixed(2))
      }

      List.push(
        <Grid key={`data-report-empolyee${i}`} container direction="row" justify="space-around" spacing={5}>
          <Grid item xs={12} sm={12} md={12}>
            <OfficerCard mt="0px" mb="0px" shouldFullHeight>
              <div>
                <Question>
                  <QuestionNumber className="pr-2">Q{i + 1}:</QuestionNumber>
                  {info[i].question}
                </Question>
                <div>
                  {info[i].type === 'Text Area' ? (
                    <div className="pl-2 mt-2">
                      {info[i].text_responses.map((item, index) => (
                        <div key={`textfield${index + 2}`}>
                          <p className="mt-2">{item}</p>
                          <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                        </div>
                      ))}
                    </div>
                  ) : info[i].type === 'Drop Down' ? (
                    <OfficerBarGraph yaxisList={res} xaxisList={choices} />
                  ) : info[i].type === 'Multiple Choice' ||
                    info[i].type === 'Poll' ||
                    info[i].type === 'Vote' ||
                    info[i].type === 'Checkbox' ? (
                    <OfficerBarGraph yaxisList={res} xaxisList={choices} />
                  ) : info[i].type === 'Rating' ? (
                    <OfficerBarGraph yaxisList={rating} xaxisList={ratingPercentage} />
                  ) : info[i].type === 'File' ? (
                    <div className="pl-2 mt-2">
                      {info[i].file_responses.map((item, index) => (
                        <div key={`textfield${index + 2}`}>
                          <p className="mt-2">{item}</p>
                          <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </OfficerCard>
          </Grid>

          {info[i + 1] ? (
            <Grid key={`data-report-empolyee${i}`} item xs={12} sm={12} md={12}>
              <OfficerCard mt="0px" mb="0px" shouldFullHeight>
                <div>
                  <Question>
                    <QuestionNumber className="pr-2">Q{i + 1 + 1}:</QuestionNumber>
                    {info[i + 1].question}
                  </Question>

                  <div>
                    {info[i + 1].type === 'Text Area' ? (
                      <div className="pl-2 mt-2">
                        {info[i + 1].text_responses.map((item, index) => (
                          <div key={`textfield${index + 2}`}>
                            <p className="mt-2">{item}</p>
                            <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                          </div>
                        ))}
                      </div>
                    ) : info[i + 1].type === 'Drop Down' ? (
                      <OfficerBarGraph yaxisList={res2} xaxisList={choices2} />
                    ) : info[i + 1].type === 'Multiple Choice' ||
                      info[i + 1].type === 'Poll' ||
                      info[i + 1].type === 'Vote' ||
                      info[i + 1].type === 'Checkbox' ? (
                      <OfficerBarGraph yaxisList={res2} xaxisList={choices2} />
                    ) : info[i + 1].type === 'Rating' ? (
                      <OfficerBarGraph yaxisList={rating} xaxisList={ratingPercentage2} />
                    ) : info[i + 1].type === 'File' ? (
                      <div className="pl-2 mt-2">
                        {info[i + 1].file_responses.map((item, index) => (
                          <div key={`textfield${index + 2}`}>
                            <p className="mt-2">{item}</p>
                            <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </OfficerCard>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={12} />
          )}
        </Grid>
      )
    }
    return List
  }

  return (
    <>
      <OfficerLoader isFetching={surveyFetchingSpinner}>
        <p>360 Employee Assessment Feedback</p>
        <OfficerCard>
          <Grid container>
            <Grid item md={5} sm={12}>
              {responses != null ? (
                <Chart>
                  <OfficerDountGraph
                    list={[100]}
                    response={responses}
                    showText
                    innerText="Responses"
                    percent={0}
                    color={['#108572']}
                    label={['']}
                    dataLabel={false}
                    tooltip={false}
                    isFetching={false}
                  />
                </Chart>
              ) : null}
            </Grid>
            <Grid item md={7} sm={12}>
              <Para>Feel free to export the results of your survey and share them.</Para>
              <Para>
                <b>Recommendation:</b>
                We recommend that you run surveys on a monthly basis to stay engaged with the people who matter the
                most.
              </Para>
              <div className="d-flex flex-column justify-contet-center align-items-center ">
                <button
                  className="btn-export my-3"
                  onClick={() => {
                    if (pdfExportComponent.current) {
                      pdfExportComponent.current.save()
                    }
                  }}>
                  Export
                </button>

                <OfficerButton
                  buttonName="View All Responses"
                  color="primary"
                  variant="large"
                  click={() => {
                    history.push(`/employee-feedback/${reportId}`)
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </OfficerCard>
        <div>{showReviews()}</div>
        <div className="d-flex pt-5  flex-column justify-content-center align-items-center">
          <p>Powered By</p>
          <img src={logo} alt="officerLogo" width="250x" height="50px" className="logoStyle" />
        </div>
      </OfficerLoader>
      <OfficerDialog
        open={open}
        onClose={handleClose}
        actions={
          <div className="">
            <div className="px-3">
              <OfficerButton buttonName="Close" color="danger" variant="small" click={handleClose} />
            </div>
          </div>
        }
        content={
          <>
            <Heading>{question}</Heading>
            {textfieldArray.map((item, index) => {
              return (
                <div key={`textfield${index + 2}`}>
                  <div style={{ padding: '2px' }}>{item}</div>
                  <div>
                    <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                  </div>
                </div>
              )
            })}
          </>
        }
      />

      <OfficerDialog
        open={openFileResponses}
        onClose={handleFileResponsesClose}
        actions={
          <div className="">
            <div className="px-3">
              <OfficerButton buttonName="Close" color="danger" variant="small" click={handleFileResponsesClose} />
            </div>
          </div>
        }
        content={
          <>
            <Heading>{fileQuestion}</Heading>

            {fileArray.map((item, index) => {
              return (
                <div key={`textfield${index + 2}`}>
                  <div style={{ padding: '2px' }}>{item}</div>
                  <div>
                    <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }} />
                  </div>
                </div>
              )
            })}
          </>
        }
      />

      <div style={{ position: 'relative', height: '1px', overflow: 'hidden', width: '100%' }}>
        <PDFExport scale={0.6} paperSize="A4" margin="1cm" ref={pdfExportComponent} style={{ position: 'absolute' }}>
          <OfficerCard>
            <Grid container direction="column">
              <p align="center">{title}</p>
              <Grid item md={12} sm={12} justify="center" className="d-flex mt-5">
                {responses != null ? (
                  <Chart>
                    <OfficerDountGraph
                      list={[100]}
                      response={responses}
                      showText
                      innerText="Responses"
                      percent={0}
                      color={['#108572']}
                      label={['']}
                      dataLabel={false}
                      tooltip={false}
                      isFetching={false}
                    />
                  </Chart>
                ) : null}
              </Grid>
            </Grid>
          </OfficerCard>
          <div>{showReviewsPdf()}</div>
        </PDFExport>
      </div>
    </>
  )
}
export default EmployeeSurveyResponseReport
