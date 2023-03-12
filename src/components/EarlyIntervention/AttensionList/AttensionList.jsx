/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Box, Link } from '@material-ui/core'
import { putAPIWrapper } from '../../../utils/api'
import OfficerTable from '../../Common/OfficerTable/OfficerTable'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerImage from '../../Common/OfficerImage/OfficerImage'
import { useHistory } from 'react-router-dom'
import { attensionListUrl } from '../../../utils/apiUrls'
import { Chip, TableBody } from '../TriggersStyle'
import PropTypes from 'prop-types'

const AttensionList = ({ data, loading, onAcknowledged, notify }) => {
  AttensionList.propTypes = {
    data: PropTypes.any.isRequired,
    loading: PropTypes.any.isRequired,
    onAcknowledged: PropTypes.any.isRequired,
    notify: PropTypes.func.isRequired
  }
  const [officerListData, setOfficerListData] = useState([])
  const history = useHistory()
  const onClickAcknowledged = async attentionObject => {
    const res = await putAPIWrapper(`/${attensionListUrl}${attentionObject.id}/`)
    if (!res.isError) {
      onAcknowledged(attentionObject)
      notify(res.data.data.message, 'success', 7000)
    } else notify(res.error.message, 'error', 7000)
  }

  const renderAttensionList = () => {
    const list = []
    data.map(attensionListData => {
      const render = []
      render.push(
        <div align="center">
          <OfficerImage
            width="40px"
            height="40px"
            url={attensionListData.user.profile_pic}
            alt={attensionListData.badge_number + '-img'}
          />
        </div>
      )
      render.push(
        <div align="center">
          <Link
            align="center"
            onClick={() => {
              history.push(`officer-details/${attensionListData.id}`)
            }}>
            {`${attensionListData.first_name} ${attensionListData.last_name}`}
          </Link>
        </div>
      )

      render.push(<TableBody>{attensionListData.badge_number}</TableBody>)
      render.push(
        <Grid direction="row" container alignItems="center" justify="space-evenly">
          <OfficerButton
            buttonName="Acknowledged"
            color="primary"
            variant="medium"
            click={() => onClickAcknowledged(attensionListData)}
          />
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }

  useEffect(() => {
    renderAttensionList()
  }, [data])

  return (
    <>
      <div className="d-flex justify-content-center py-3">
        <Chip>Flagged for too many low reviews </Chip>
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
export default AttensionList
