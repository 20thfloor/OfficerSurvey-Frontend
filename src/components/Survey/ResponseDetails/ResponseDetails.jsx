/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { useParams } from 'react-router-dom'
import { getAPI, putAPIWrapper } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton'
import OfficerDialog from '../../Common/OfficerDialog/OfficerDialog'
import OfficerLoader from '../../Common/OfficerLoader'
import OfficerImage from '../../Common/OfficerImage'
import { getIsSupervisor } from '../../../utils/localStorage'
import { surveyResponseUrl, updateSurveyResponseUrl, updateSurveyResponseByofficer } from '../../../utils/apiUrls'
import {
  Heading,
  InfoHeading,
  Question,
  Comments,
  ChangeOfficer,
  OfficerReview,
  Res,
  QuestionNumber,
  Info,
  Answer,
  Review,
  ChangeComment,
  Details
} from './ResponseDetail'
import { OfficerCard, OfficerInputField } from '../../../components/Common'
import PropTypes from 'prop-types'

const ResponseDetails = props => {
  ResponseDetails.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [info, setinfo] = useState({
    officer: {
      user: {
        profile_pic: ''
      }
    },
    rating: 5,
    questions_response: [
      {
        question: {
          question: ''
        }
      }
    ],
    comment_reason: '',
    change_reason: ''
  })

  const [openChangeReview, setOpenChangeReview] = useState(false)
  const [openRequestChange, setOpenRequestChange] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [newRating, setNewRating] = useState()
  const [fetching, setFetching] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [requestChange, setRequestChange] = useState('')
  const [localSupervisor, setLocalSupervisor] = useState(false)
  const [buttonDisable, setButtonDisable] = useState(false)

  const { detailId } = useParams()
  const setup = async () => {
    const dataSupervisor = await getIsSupervisor()
    setLocalSupervisor(dataSupervisor)
  }
  const fetchResponseDetail = async () => {
    setFetching(true)
    const res = await getAPI(`${surveyResponseUrl}${detailId}`)
    const data = res.data.data.data

    if (!res.isError) {
      setinfo(data)
      setNewRating(data.rating)
      setFetching(false)
    }
  }

  const onClickUpdateReview = async () => {
    setShowSpinner(true)
    const response = await putAPIWrapper(`${updateSurveyResponseUrl}${detailId}/`, {
      rating: newRating,
      change_reason: newComment
    })
    if (!response.isError) {
      setShowSpinner(false)
      setOpenChangeReview(false)
      setinfo(response.data.data.data)
      props.notify(response.data.data.message, 'success')
    } else {
      props.notify(response.error.message, 'error')
      setShowSpinner(false)
    }
  }
  const onClickUpdateRequestChange = async () => {
    setShowSpinner(true)
    const res = await putAPIWrapper(`${updateSurveyResponseByofficer}${info.id}/`, {
      comment_reason: requestChange
    })
    if (!res.isError) {
      setShowSpinner(false)
      setOpenRequestChange(false)
      props.notify(res.data.data.message, 'success')
      setinfo(res.data.data.data)
    } else {
      setOpenRequestChange(false)
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }
  useEffect(() => {
    fetchResponseDetail()
    setup()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleOpenChangeReview = () => {
    setOpenChangeReview(true)
  }
  const handleCloseChangeReview = () => {
    setOpenChangeReview(false)
  }

  const handleOpenRequestChange = () => {
    setOpenRequestChange(true)
  }
  const handleCloseRequestChange = () => {
    setOpenRequestChange(false)
  }
  const onChangeRating = (event, newValue) => {
    setNewRating(newValue)
    newValue ? setButtonDisable(true) : setButtonDisable(false)
  }

  const onChangeComment = e => {
    setNewComment(e.target.value)
  }
  const onChangeRequest = e => {
    setRequestChange(e.target.value)
  }

  const showReviews = () => {
    var officerReviewList = []
    for (var i = 0; i < info.questions_response.length; i = i + 2) {
      officerReviewList.push(
        <Grid key={`item-question${i}`} container direction="row" justify="space-around" spacing={5}>
          <Grid item xs={12} sm={12} md={6}>
            <OfficerCard mt="0px" mb="0px" shouldFullHeight>
              <div>
                <Question>
                  <QuestionNumber className="pr-2"> Q{i + 1}:</QuestionNumber>
                  {info.questions_response[i].question.question}
                </Question>
                <p>
                  <Res className="pr-2"> Res:</Res>
                  {info.questions_response[i].question.type === 'Checkbox' ? (
                    <Answer>{info.questions_response[i].check_box_answers}</Answer>
                  ) : (
                    <Answer>
                      {info.questions_response[i].choice
                        ? info.questions_response[i].choice.choice
                        : info.questions_response[i].comment_box}
                    </Answer>
                  )}
                </p>
                <p>
                  <Answer>
                    {info.questions_response[i].choice &&
                    info.questions_response[i].choice.show_comment_box &&
                    info.questions_response[i].comment_box !== ''
                      ? 'Comment : ' + info.questions_response[i].comment_box
                      : ''}
                  </Answer>
                </p>
              </div>
            </OfficerCard>
          </Grid>

          {info.questions_response[i + 1] ? (
            <Grid item xs={12} sm={12} md={6}>
              <OfficerCard mt="0px" mb="0px" shouldFullHeight>
                <div>
                  <Question>
                    <QuestionNumber className="pr-2">Q{i + 1 + 1}:</QuestionNumber>
                    {info.questions_response[i + 1].question.question}
                  </Question>
                  <p>
                    <Res className="pr-2"> Res:</Res>
                    {info.questions_response[i + 1].question.type === 'Checkbox' ? (
                      <Answer>{info.questions_response[i + 1].check_box_answers}</Answer>
                    ) : (
                      <Answer>
                        {info.questions_response[i + 1].choice
                          ? info.questions_response[i + 1].choice.choice
                          : info.questions_response[i + 1].comment_box}
                      </Answer>
                    )}
                  </p>
                  <p>
                    <Answer>
                      {info.questions_response[i + 1].choice &&
                      info.questions_response[i + 1].choice.show_comment_box &&
                      info.questions_response[i + 1].comment_box !== ''
                        ? 'Comment : ' + info.questions_response[i + 1].comment_box
                        : ''}
                    </Answer>
                  </p>
                </div>
              </OfficerCard>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={6} />
          )}
        </Grid>
      )
    }
    return officerReviewList
  }

  return (
    <>
      <OfficerLoader isFetching={fetching}>
        <Grid container direction="row" component="div" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box p={3} component={Paper} textAlign="left" height={450}>
              <Heading>Citizen </Heading>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2">First Name : </InfoHeading>
                {info.first_name ? <Info>{info.first_name}</Info> : <Info>--</Info>}
              </p>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2">Last Name : </InfoHeading>
                {info.last_name ? <Info>{info.last_name}</Info> : <Info>--</Info>}
              </p>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2">Email : </InfoHeading>
                {info.email ? <Info>{info.email}</Info> : <Info>--</Info>}
              </p>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2"> Address: </InfoHeading>
                {info.address ? <Info>{info.address}</Info> : <Info>--</Info>}
              </p>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2"> Phone : </InfoHeading>
                {info.phone ? <Info>{info.phone}</Info> : <Info>--</Info>}
              </p>

              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2"> City : </InfoHeading>
                {info.city ? <Info>{info.city}</Info> : <Info>--</Info>}
              </p>
              <hr />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box p={3} component={Paper} textAlign="left" height={450}>
              <Heading>Officer</Heading>
              <hr />
              <OfficerImage
                width="89px"
                height="89px"
                borderRadius="10px"
                url={info.officer.user.profile_pic}
                alt={info.officer.badge_number + '-img'}
              />
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2"> Name : </InfoHeading>
                {info.officer.first_name ? (
                  <Info>
                    {info.officer.first_name} {''} {info.officer.last_name}
                  </Info>
                ) : (
                  <Info>--</Info>
                )}
              </p>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2"> Address : </InfoHeading>
                {info.officer.address ? <Info>{info.officer.address}</Info> : <Info>--</Info>}
              </p>
              <hr />
              <p className="d-flex ">
                <InfoHeading className="pr-2"> Badge Number : </InfoHeading>
                {info.officer.badge_number ? <Info>{info.officer.badge_number}</Info> : <Info>--</Info>}
              </p>
              <hr />
              <p className="d-flex justify-content-between">
                <span className="d-flex justify-content-center">
                  <InfoHeading className="pr-2"> Rating :</InfoHeading>
                  <Rating name="simple-controlled" value={info.rating} readOnly />
                </span>
                {localSupervisor ? (
                  info.request_change && !info.changed_by_supervisor ? (
                    <div>
                      <OfficerButton
                        buttonName="Change Review"
                        color="primary"
                        variant="medium"
                        click={handleOpenChangeReview}
                      />
                    </div>
                  ) : null
                ) : !info.request_change ? (
                  <div>
                    <OfficerButton
                      buttonName="Request Change"
                      color="primary"
                      variant="medium"
                      click={handleOpenRequestChange}
                    />
                  </div>
                ) : null}
              </p>
              <hr />
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="column" component="div">
          <Grid item xs={12} sm={12}>
            <div>
              <OfficerReview className="py-3 pl-2">Officer&apos;s Review</OfficerReview>

              {showReviews()}
            </div>
            {info.comment ? (
              <>
                <Comments className="pt-3 pl-2">Comments</Comments>
                <OfficerCard>
                  <Details>{info.comment}</Details>
                </OfficerCard>
              </>
            ) : null}
          </Grid>
        </Grid>
        <Grid container direction="column" component="div">
          {info.comment_reason !== '' ? (
            <Grid item xs={12} sm={12}>
              <ChangeOfficer className="pt-3 pl-2">Officer Change Request</ChangeOfficer>
              <OfficerCard>
                <Details>{info.comment_reason}</Details>
              </OfficerCard>
            </Grid>
          ) : null}
          {info.change_reason !== '' ? (
            <Grid item xs={12} sm={12}>
              <ChangeComment className="pt-3 pl-2">Supervisor Changed Comment</ChangeComment>
              <OfficerCard>
                <Details>{info.change_reason}</Details>
                <Details>
                  {info.reviewed_by_supervisor.first_name} {''}
                  {info.reviewed_by_supervisor.last_name} {''}changed your review
                </Details>
              </OfficerCard>
            </Grid>
          ) : null}
        </Grid>
        <OfficerDialog
          open={openChangeReview}
          onClose={handleCloseChangeReview}
          actions={
            <>
              <div className="pb-3 pr-2">
                <OfficerButton
                  buttonName="Save"
                  color="secondary"
                  variant="small"
                  click={onClickUpdateReview}
                  showSpinnerProp={showSpinner}
                  disabled={!buttonDisable}
                />
              </div>
            </>
          }
          content={
            <>
              <changeReview>Change Review</changeReview>
              <br />
              <Rating name="simple-controlled" value={newRating} onChange={onChangeRating} />
              <OfficerInputField
                label="Comment"
                placeholder="Comment Here"
                id="Comment Here"
                type="comment"
                name="comment"
                value={newComment}
                onChange={onChangeComment}
                maxLength={200}
                multiline
                characterCount
              />
            </>
          }
        />
        <OfficerDialog
          open={openRequestChange}
          onClose={handleCloseRequestChange}
          actions={
            <>
              <div className="pb-3 pr-2">
                <OfficerButton
                  buttonName="Save"
                  color="secondary"
                  variant="small"
                  click={onClickUpdateRequestChange}
                  showSpinnerProp={showSpinner}
                />
              </div>
            </>
          }
          content={
            <>
              <Review>Review Change Request</Review>
              <OfficerInputField
                label="Comment"
                placeholder="Comment Here"
                id="Comment Here"
                type="comment"
                name="comment"
                value={requestChange}
                onChange={onChangeRequest}
              />
            </>
          }
        />
      </OfficerLoader>
    </>
  )
}
export default ResponseDetails
