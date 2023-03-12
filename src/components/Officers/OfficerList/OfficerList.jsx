/* eslint-disable react/jsx-one-expression-per-line */
import { Grid, Button, Input } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import React, { useEffect, useState } from 'react'
import { deleteAPIWrapper, getAPI, postAPIWithoutAuth, postAPIFormDataWrapper } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerDialog from '../../Common/OfficerDialog'
import OfficerImage from '../../Common/OfficerImage'
import OfficerSearchBar from '../../Common/OfficerSearchBar'
import OfficerTable from '../../Common/OfficerTable'
import AddOfficer from '../AddOfficer/AddOfficer'
import { useHistory } from 'react-router-dom'
import { officersListUrl, officersDepartmentUrl, uploadOfficerUrl, exportCsv } from '../../../utils/apiUrls'
import { createFormDataObject } from '../../../utils/helpers'
import { OfficerHeading, TableBody, ImportOfficer, Delete, OfficerCreateAccountDiv } from './OfficerListStyle'
import { OfficerCard, OfficerCopyButton } from '../../Common'
import PropTypes from 'prop-types'
import QRCode from 'qrcode'

const OfficerList = ({ notify }) => {
  OfficerList.propTypes = {
    notify: PropTypes.func.isRequired
  }
  const [searchValue, setSearchValue] = useState('')
  const [officers, setOfficers] = useState([])
  const [officerListData, setOfficerListData] = useState([])
  const [tableLoadSpinner, setTableLoadSpinner] = useState(true)
  const [signupUrl, setSignupUrl] = useState('')
  const [showSpinnerOfficer, setshowSpinnerOfficer] = useState(false)
  const [openDeleteOfficer, setOpenDeleteOfficer] = useState(false)
  const [openCustomUpload, setOpenCustomUpload] = useState(false)
  const [currentSelectedOfficer, setCurrentSelectedOfficer] = useState({})
  const [csvLink, setCsvLink] = useState('')

  const [customFile, setCustomFile] = useState('')
  const [csvData, setCsvData] = useState([])
  const [csvFileData, setCsvFileData] = useState([])
  const [src, setSrc] = useState([])
  const history = useHistory()

  const fetchOfficersAPI = async () => {
    setTableLoadSpinner(true)
    const response = await getAPI(officersListUrl, { search: searchValue })
    if (!response.isError) {
      setTableLoadSpinner(false)
      setOfficers(response.data.data.data)
      // const csvArraydata = []
      const arr2 = []
      if (response.data.data.data) {
        const csvArraydata = response.data.data.data.map(item => {
          const qrLink = `${process.env.REACT_APP_DEPLOYED_LINK}/officer-survey/${item.link}`
          QRCode.toDataURL(qrLink).then(data => {
            arr2.push(data)
          })
          return {
            FirstName: item.first_name,
            LastName: item.last_name,
            Badge: item.badge_number
          }
        })
        setSrc(arr2)
        setCsvData(csvArraydata)
      }
    }
  }
  const exportCsvFile = async () => {
    const res = await postAPIWithoutAuth(exportCsv, csvFileData)
    if (!res.isError) {
      notify(res.data.data.message, 'success', 7000)
      setCsvLink(res.data.data.data)
    } else {
      notify(res.error.data.message, 'error', 7000)
    }
  }
  useEffect(() => {
    if (csvLink) {
      window.open(csvLink, '_self')
    }
  }, [csvLink])

  useEffect(() => {
    const csvArray = csvData.map((item, index) => {
      const splitSrc = src[index]
      let value = ''
      if (splitSrc !== undefined) {
        value = splitSrc.slice(22, splitSrc.length)
      }
      return { ...item, qr: value }
    })
    setCsvFileData(csvArray)
  }, [csvData, src])

  const fetchSignupUrl = async () => {
    const response = await getAPI(officersDepartmentUrl)
    !response.isError && setSignupUrl(response.data.data.data.sign_up_link)
  }

  useEffect(() => {
    searchValue === '' && fetchOfficersAPI()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  useEffect(() => {
    fetchOfficersAPI()
    fetchSignupUrl()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const list = []
    officers.map(officer => {
      const render = []
      render.push(
        <div align="center">
          <OfficerImage url={officer.user.profile_pic} alt={officer.badge_number + '-img'} />
        </div>
      )
      render.push(
        <TableBody>
          {officer.first_name}
          &nbsp;
          {officer.last_name}
        </TableBody>
      )
      render.push(<TableBody>{officer.badge_number}</TableBody>)
      render.push(<TableBody>{officer.user.email}</TableBody>)
      render.push(
        <div align="center">
          <Grid spacing={1} display="flex" justify="center" direction="row" container>
            <>
              <Box component={Grid} item>
                <OfficerButton
                  buttonName="View"
                  color="primary"
                  variant="small"
                  startIcon={<VisibilityIcon />}
                  click={() => {
                    history.push(`officer-details/${officer.id}`)
                  }}
                />
              </Box>

              <Box component={Grid} item>
                <OfficerButton
                  buttonName="Update"
                  color="secondary"
                  variant="small"
                  startIcon={<EditIcon />}
                  click={() => {
                    history.push(`update-officer/${officer.id}`)
                  }}
                />
              </Box>
              <Box component={Grid} item>
                <OfficerButton
                  buttonName="Delete"
                  color="danger"
                  variant="small"
                  startIcon={<DeleteIcon />}
                  click={() => handleOpenDeleteOfficer(officer)}
                />
              </Box>
            </>
          </Grid>
        </div>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officers])

  const onClickDeleteOfficer = async () => {
    setshowSpinnerOfficer(true)
    const res = await deleteAPIWrapper(`${officersListUrl}${currentSelectedOfficer.id}/`)
    if (!res.isError) {
      const updatedOfficersList = officers.filter(officer => officer.id !== currentSelectedOfficer.id)
      setOfficers(updatedOfficersList)
      setshowSpinnerOfficer(false)
      setOpenDeleteOfficer(false)
      notify(res.data.data.message, 'success')
    } else notify(res.error.message, 'error')
  }

  const onClickUpload = async () => {
    setshowSpinnerOfficer(true)

    const formData = createFormDataObject({
      file: customFile
    })
    const res = await postAPIFormDataWrapper(uploadOfficerUrl, formData)
    if (!res.isError) {
      setshowSpinnerOfficer(false)
      setOpenCustomUpload(false)
      fetchOfficersAPI()
      notify(res.data.data.message, 'success', 7000)
    } else {
      notify(res.error.data.message, 'error', 7000)
      setshowSpinnerOfficer(false)
      setOpenCustomUpload(false)
    }
  }
  const handleOpenDeleteOfficer = officer => {
    setCurrentSelectedOfficer(officer)
    setOpenDeleteOfficer(true)
  }
  const handleCloseDeleteOfficer = () => {
    setOpenDeleteOfficer(false)
  }
  const handleOpenCustomUpload = () => {
    setOpenCustomUpload(true)
  }
  const handleCloseCustomUpload = () => {
    setOpenCustomUpload(false)
  }
  const handleFileUpload = e => {
    setCustomFile(e.target.files[0])
  }
  const updateCallBack = () => {
    fetchOfficersAPI()
  }

  return (
    <div className="officer_div">
      <OfficerHeading>All Officers</OfficerHeading>
      <OfficerCard>
        <OfficerCreateAccountDiv className="d-flex">
          <p>Share this link with your Officers so they can create their account. ({signupUrl})</p>
          <div className="pl-2">
            <OfficerCopyButton text={signupUrl} notify={notify} />
          </div>
        </OfficerCreateAccountDiv>
        <Grid container direction="row">
          <Grid item xs={4} sm={4}>
            <OfficerSearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onSearchClick={fetchOfficersAPI}
              placeholder="Enter Officer’s Name or Badge #"
              label="Enter Officer’s Name or Badge #"
            />
          </Grid>
          <Grid item xs={8} sm={8}>
            <div className="d-flex justify-content-center align-items-center h-100">
              <AddOfficer notify={notify} updateCallBackProp={updateCallBack} />

              <OfficerButton
                buttonName="Custom Upload"
                color="secondary"
                variant="medium"
                align="center"
                click={handleOpenCustomUpload}
              />
              <div className="px-2">
                <OfficerButton
                  buttonName="Export"
                  color="secondary"
                  variant="medium"
                  align="center"
                  click={exportCsvFile}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </OfficerCard>

      <OfficerTable
        showSpinner={tableLoadSpinner}
        headers={['Profile Picture', 'Name', 'Badge Number', 'Email', 'Action']}
        data={officerListData}
      />
      <OfficerDialog
        open={openDeleteOfficer}
        onClose={handleCloseDeleteOfficer}
        style={{ color: 'blue !important' }}
        actions={
          <>
            <div className="pb-3 d-flex">
              <OfficerButton
                buttonName="Yes"
                color="secondary"
                variant="small"
                click={onClickDeleteOfficer}
                showSpinnerProp={showSpinnerOfficer}
              />
              <div className="px-3">
                <OfficerButton buttonName="No" color="danger" variant="small" click={handleCloseDeleteOfficer} />
              </div>
            </div>
          </>
        }
        content={
          <>
            <Delete>Delete Officer</Delete>
            <p className="d-flex justify-content-center">
              Do you want to delete &ldquo;
              {currentSelectedOfficer.first_name + ' ' + currentSelectedOfficer.last_name}
              &rdquo; ?
            </p>
          </>
        }
      />
      <OfficerDialog
        open={openCustomUpload}
        onClose={handleCloseCustomUpload}
        style={{ color: 'blue !important' }}
        actions={
          <>
            <div className="pb-3 d-flex">
              <OfficerButton
                buttonName="Submit"
                color="secondary"
                variant="small"
                click={onClickUpload}
                showSpinnerProp={showSpinnerOfficer}
              />
              <div className="px-3">
                <OfficerButton buttonName="Cancel" color="danger" variant="small" click={handleCloseCustomUpload} />
              </div>
            </div>
          </>
        }
        content={
          <>
            <ImportOfficer>Import Officer</ImportOfficer>
            <Button variant="contained" component="label">
              <Input
                type="file"
                variant="outlined"
                color="primary"
                fullWidth
                placeholder="No file choosen"
                onChange={handleFileUpload}
              />
            </Button>
          </>
        }
      />
    </div>
  )
}
export default OfficerList
