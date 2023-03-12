/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAPIWithoutAuth, patchAPIWrapperWithoutAuth } from '../../../utils/api'
import SurveyMultiStep from './SurveyMultiStep'
import { officersDepartmentUrl, updateClickSubmitCount } from '../../../utils/apiUrls'
import DepartmentHeader from './../../DepartmentHeader'
import { MainDiv } from './DepartmentPageStyle'
import { OfficerLoader } from '../../Common'
import { useLocation } from 'react-router-dom'

const DepartmentPage = () => {
  const [departmentData, setDepartmentData] = useState('')
  const [departmentFlag, setDepartmentFlag] = useState(true)
  const [fetching, setFetching] = useState(true)
  const search = useLocation().search
  const id = new URLSearchParams(search).get('ref')

  const { deptname } = useParams()

  const fetchDepartmentAPI = async () => {
    const response = await getAPIWithoutAuth(`${officersDepartmentUrl}${deptname}`)

    if (!response.isError) {
      setFetching(false)
      setDepartmentData(response.data.data.data)
    } else setDepartmentFlag(false)
  }
  const postDepartmentAPI = async () => {
    await patchAPIWrapperWithoutAuth(updateClickSubmitCount, { is_clicked: true, ref: id })
  }

  useEffect(() => {
    fetchDepartmentAPI()
    postDepartmentAPI()
  }, [])

  return (
    <>
      <OfficerLoader isFetching={fetching}>
        {departmentFlag ? (
          <MainDiv className="container-fluid">
            <div className="col-md-12 pt-3">
              <DepartmentHeader header={departmentData.header} />
              <SurveyMultiStep departmentData={departmentData} />
            </div>
          </MainDiv>
        ) : (
          <MainDiv className="container-fluid">
            <div className="col-md-12">
              <header className="header-desc text-center">
                <h1>*Invalid Department Name*</h1>
              </header>
            </div>
          </MainDiv>
        )}
      </OfficerLoader>
    </>
  )
}

export default DepartmentPage
