import React, { useState, useEffect } from 'react'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import OfficerTable from '../../Common/OfficerTable'
import { getAPI, deleteAPIWrapper } from '../../../utils/api'
import { getSurvey, deleteSurveyApi } from '../../../utils/apiUrls'
import { TableBody, DeleteHeading, EmployeeFeedbackHeading } from './EmployeeFeedbackStyle'
import VisibilityIcon from '@material-ui/icons/Visibility'
import logo from '../../../assets/logo_officer.png'
import { OfficerCopyButton } from '../../Common'
import OfficerDialog from '../../Common/OfficerDialog'
import { DeleteSvg, EditSvg } from '../../../utils/svgs'
import { convertDate } from '../../../utils/helpers'
import PropTypes from 'prop-types'

const EmployeeFeedback = props => {
  const location = useLocation()

  EmployeeFeedback.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [openDelete, setOpenDelete] = useState(false)
  const [showSpinnerDelete, setshowSpinnerDelete] = useState(false)
  const { category } = useParams()

  const pageLimit = 10

  const [query, setQuery] = useState({
    page: 1,
    page_size: pageLimit,
    survery_category: category
  })
  const history = useHistory()
  const [surveys, setSurveys] = useState({
    links: {
      next: null,
      previous: null
    },
    data: []
  })
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [surveyListData, setServeyListData] = useState([])
  const [deleteItem, setDeleteItem] = useState()

  const openSurvey = () => {
    history.push(`/employee-feedback-survey/create-survey/${category}`)
  }

  const openPole = () => {
    history.push(`create-pole/${category}`)
  }

  const fetchSurveys = async () => {
    setTableLoadSpinner(true)
    const response = await getAPI(getSurvey, query)
    if (!response.isError) {
      setSurveys(response.data.data)
      setTableLoadSpinner(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [query]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleChangePage = newPage => {
    setQuery({
      ...query,
      page: newPage
    })
  }

  useEffect(() => {
    const list = []
    surveys.data.map(item => {
      const render = []

      render.push(<TableBody>{item.title}</TableBody>)
      render.push(<TableBody>{item.count}</TableBody>)
      render.push(<TableBody>{convertDate(item.expire)}</TableBody>)

      render.push(
        <div className="d-flex justify-content-center ">
          <div className="pr-2">
            <OfficerButton
              buttonName="View"
              color="primary"
              startIcon={<VisibilityIcon />}
              variant="small"
              click={() => {
                history.push(`employee-survey-report/${item.id}`)
              }}
            />
          </div>

          <OfficerButton
            buttonName="Export"
            color="secondary"
            variant="small"
            click={() => {
              history.push(`employee-survey-report/${item.id}`)
            }}
          />
        </div>
      )
      render.push(
        <div className="d-flex justify-content-center">
          <div className="pr-2">
            <OfficerCopyButton
              text={`${process.env.REACT_APP_DEPLOYED_LINK}/employee-survey-by-link/${item.link}`}
              notify={props.notify}
            />
          </div>
          <div className="pr-2">
            <OfficerButton
              buttonName="Update"
              color="secondary"
              startIcon={<EditSvg color="#323C47" />}
              variant="small"
              click={() => {
                item.type === 'Poll'
                  ? history.push(`update-employee-pole/${item.id}`)
                  : history.push(`edit-employee-survey/${item.id}`)
              }}
            />
          </div>
          <OfficerButton
            buttonName="Delete"
            color="danger"
            variant="small"
            startIcon={<DeleteSvg color="white" />}
            click={() => handleOpenDelete(item)}
          />
        </div>
      )

      list.push(render)
      return list
    })
    setServeyListData(list)
  }, [surveys]) //eslint-disable-line react-hooks/exhaustive-deps

  const onClickDelete = async () => {
    setshowSpinnerDelete(true)

    const response = await deleteAPIWrapper(`${deleteSurveyApi} ${deleteItem.id}`)
    if (!response.isError) {
      fetchSurveys()
      setshowSpinnerDelete(false)
      props.notify(response.data.data.message, 'success')
      handleCloseDelete()
    } else {
      setshowSpinnerDelete(false)
      props.notify(response.error.message, 'error')
    }
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const handleOpenDelete = item => {
    setDeleteItem(item)
    setOpenDelete(true)
  }

  return (
    <div>
      <EmployeeFeedbackHeading>{location.state.detail}</EmployeeFeedbackHeading>

      <div className=" py-3 d-flex">
        <div className="pr-2">
          <OfficerButton buttonName="Create Survey" color="officer" align="left" variant="medium" click={openSurvey} />
        </div>

        <OfficerButton buttonName="Create a Poll" color="officer" align="left" variant="medium" click={openPole} />
      </div>

      <OfficerTable
        showSpinner={tableLoadSpinner}
        headers={['Title', 'Response', 'Expiration Date', 'Responses Action', 'Survey Actions']}
        data={surveyListData}
        pagination
        totalCount={surveys.total}
        page={query.page}
        pageLimit={query.page_size}
        disableNext={surveys.links.next == null}
        disablePrevious={surveys.links.previous == null}
        onChangePage={handleChangePage}
      />
      <div className="d-flex pt-3  flex-column justify-content-center align-items-center">
        <p>Powered By</p>
        <img src={logo} alt="officerLogo" width="250x" height="50px" className="logoStyle" />
      </div>

      <OfficerDialog
        open={openDelete}
        onClose={handleCloseDelete}
        actions={
          <div className="pb-3 d-flex pt-2">
            <OfficerButton
              buttonName="Yes"
              color="secondary"
              variant="small"
              click={onClickDelete}
              showSpinnerProp={showSpinnerDelete}
            />
            <div className="px-3">
              <OfficerButton buttonName="No" color="danger" variant="small" click={handleCloseDelete} />
            </div>
          </div>
        }
        content={
          <>
            <DeleteHeading> Delete Survey</DeleteHeading>

            <p className="d-flex justify-content-center">Do you want to delete this survey?</p>
          </>
        }
      />
    </div>
  )
}
export default EmployeeFeedback
