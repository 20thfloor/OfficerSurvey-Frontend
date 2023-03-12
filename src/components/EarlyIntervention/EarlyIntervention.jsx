import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@material-ui/core'
import TriggerSetting from './TriggerSetting'
import ReviewList from './ReviewList'
import { getAPI } from '../../utils/api'
import AttensionList from './AttensionList'
import { attensionListUrl, reviewListUrl } from '../../utils/apiUrls'
import { TriggersHeading } from './TriggersStyle'
import PropTypes from 'prop-types'

const EarlyIntervention = ({ notify }) => {
  EarlyIntervention.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const [attentionListData, setAttentionListData] = useState([])
  const [attentionListLoading, setAttentionListLoading] = useState(true)
  const [reviewedListData, setReviewedListData] = useState([])
  const [reviewedListLoading, setReviewedListLoading] = useState(true)

  const fetchAttentionListAPI = async () => {
    setAttentionListLoading(true)
    const response = await getAPI(attensionListUrl)
    if (!response.isError) {
      setAttentionListLoading(false)
      setAttentionListData(response.data.data.data)
    } else setAttentionListLoading(false)
  }
  useEffect(() => {
    fetchAttentionListAPI()
    fetchReviewedListAPI()
  }, [])

  const callBack = () => {
    fetchAttentionListAPI()
  }

  const fetchReviewedListAPI = async () => {
    setReviewedListLoading(true)
    const response = await getAPI(reviewListUrl)
    if (!response.isError) {
      setReviewedListLoading(false)
      setReviewedListData(response.data.data.data)
    }
  }

  const onAcknowledged = attentionObject => {
    const filteredAttentionList = attentionListData.filter(listItem => listItem.id !== attentionObject.id)
    setAttentionListData(filteredAttentionList)
    setReviewedListData([...reviewedListData, attentionObject])
  }

  const onReviewed = reviewObject => {
    const filteredReviewedList = reviewedListData.filter(listItem => listItem.id !== reviewObject.id)
    setReviewedListData(filteredReviewedList)
  }
  return (
    <>
      <div className="p-2">
        <TriggersHeading>Early Intervention System</TriggersHeading>
        <Box marginTop={2} width="100%" alignContent="center" elevation={4}>
          <TriggerSetting callBackProp={callBack} notify={notify} />
        </Box>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box marginTop={2}>
              <AttensionList
                data={attentionListData}
                loading={attentionListLoading}
                onAcknowledged={onAcknowledged}
                notify={notify}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box marginTop={2}>
              <ReviewList
                data={reviewedListData}
                loading={reviewedListLoading}
                onReviewed={onReviewed}
                notify={notify}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
export default EarlyIntervention
