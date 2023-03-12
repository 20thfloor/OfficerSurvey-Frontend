/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Box, Link } from '@material-ui/core'
import { putAPIWrapper } from '../../../utils/api'
import OfficerTable from '../../Common/OfficerTable/OfficerTable'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerImage from '../../Common/OfficerImage/OfficerImage'
import { useHistory } from 'react-router-dom'
import { reviewListUrl } from '../../../utils/apiUrls'
import { Chip, TableBody } from '../TriggersStyle'
import PropTypes from 'prop-types'

const ReviewList = ({ data, loading, onReviewed, notify }) => {
  ReviewList.propTypes = {
    data: PropTypes.any.isRequired,
    loading: PropTypes.any.isRequired,
    onReviewed: PropTypes.any.isRequired,
    notify: PropTypes.func.isRequired
  }
  const [officerListData, setOfficerListData] = useState([])
  const history = useHistory()
  const onClickReviewed = async reviewObject => {
    const res = await putAPIWrapper(`/${reviewListUrl}${reviewObject.id}/`)
    if (!res.isError) {
      onReviewed(reviewObject)
      notify(res.data.data.message, 'success', 7000)
    } else notify(res.error.message, 'error', 7000)
  }
  const renderReviewedList = () => {
    const list = []
    data.map(reviewedListData => {
      const render = []
      render.push(
        <div align="center">
          <OfficerImage
            width="40px"
            height="40px"
            url={reviewedListData.user.profile_pic}
            alt={reviewedListData.badge_number + '-img'}
          />
        </div>
      )
      render.push(
        <div align="center">
          <Link
            align="center"
            onClick={() => {
              history.push(`officer-details/${reviewedListData.id}`)
            }}>
            {`${reviewedListData.first_name} ${reviewedListData.last_name}`}
          </Link>
        </div>
      )

      render.push(<TableBody>{reviewedListData.badge_number}</TableBody>)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="Remove"
            color="danger"
            variant="small"
            click={() => onClickReviewed(reviewedListData)}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }

  useEffect(() => {
    renderReviewedList()
  }, [data])
  return (
    <>
      <div className="d-flex justify-content-center py-3">
        <Chip>Reviewed List</Chip>
      </div>
      <Box p={1}>
        <OfficerTable
          showSpinner={loading}
          headers={['Profile', 'Officer', 'Badge', 'Action']}
          data={officerListData}
        />
      </Box>
    </>
  )
}
export default ReviewList
