/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { getAPI, postAPIWrapper } from '../../../utils/api'
import { useParams, useHistory } from 'react-router-dom'
import OfficerLoader from '../../Common/OfficerLoader'
import { getCommunitySurvey, reArrangeCommunityFeedback } from '../../../utils/apiUrls'
import CardDrag from '../../Employee360/DragDropEmployeeSurvey/Card'
import update from 'immutability-helper'
import { DragnDrop } from './RearrangeStyle'

const CommunitySurveyRearrange = () => {
  const { surveyId } = useParams()

  const pageLimit = 1
  const [query] = useState({
    page: 1,
    page_size: pageLimit
  })

  const [cards, setCards] = useState([])
  const history = useHistory()

  const [fetchingSurvey, setFetchingSurvey] = useState(false)
  const [showSpinner, setshowSpinner] = useState(false)

  const fetchSurvey = async () => {
    setFetchingSurvey(true)

    const response = await getAPI(`${getCommunitySurvey} ${surveyId}`, query)
    if (!response.isError) {
      setFetchingSurvey(false)
      setCards(response.data.data.data.questions)
      return
    } else {
      setFetchingSurvey(false)
    }
  }

  useEffect(() => {
    fetchSurvey()
  }, [query])

  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = cards[dragIndex]
    setCards(
      update(cards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      })
    )
  }

  const rearrange = async () => {
    setshowSpinner(true)
    const questionsArray = cards.map(item => item.id)
    const response = await postAPIWrapper(`${reArrangeCommunityFeedback}${surveyId}/`, {
      questions: questionsArray
    })

    if (!response.isError) {
      setshowSpinner(false)
      history.push(`/update-community-survey/${surveyId}`)
      return
    } else {
      setshowSpinner(false)
    }
  }

  return (
    <>
      <DragnDrop>Rearrange Questions</DragnDrop>
      <p> Drag and drop to rearrange the order of questions</p>
      <OfficerLoader isFetching={fetchingSurvey}>
        <Grid container item display="flex" sm={12} xs={12} direction="row">
          <div className="pt-3 w-100">
            {cards.map((card, i) => (
              <CardDrag key={card.id} index={i} id={card.id} text={card.question} moveCard={moveCard} />
            ))}
          </div>
        </Grid>

        <div className="pr-2 pt-4">
          <OfficerButton
            buttonName="Save"
            color="officer"
            variant="small"
            align="right"
            click={rearrange}
            showSpinnerProp={showSpinner}
          />
        </div>
      </OfficerLoader>
    </>
  )
}
export default CommunitySurveyRearrange
