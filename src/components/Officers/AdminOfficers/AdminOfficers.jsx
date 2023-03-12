/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Paper, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import VisibilityIcon from '@material-ui/icons/Visibility'
import React, { useEffect, useState } from 'react'
import { getAPI } from '../../../utils/api'
import OfficerButton from '../../Common/OfficerButton/OfficerButton'
import OfficerImage from '../../Common/OfficerImage'
import OfficerSearchBar from '../../Common/OfficerSearchBar'
import OfficerTable from '../../Common/OfficerTable'
import { useHistory } from 'react-router-dom'
import { officerByDepartment, adminDepartments } from '../../../utils/apiUrls'

const AdminOfficers = () => {
  const [searchValue, setSearchValue] = useState('')
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [officers, setOfficers] = useState([])
  const [officerListData, setOfficerListData] = useState([])
  const [tableLoadSpinner, setTableLoadSpinner] = useState(false)

  const history = useHistory()

  const fetchOfficersAPI = async () => {
    if (selectedDepartment) {
      setTableLoadSpinner(true)
      const response = await getAPI(`${officerByDepartment}${selectedDepartment}`, { search: searchValue })
      if (!response.isError) {
        setTableLoadSpinner(false)
        setOfficers(response.data.data.data)
      }
    }
  }
  const fetchDepartmentsAPI = async () => {
    const response = await getAPI(adminDepartments)
    !response.isError && setDepartments(response.data.data.data)
  }

  useEffect(() => {
    searchValue === '' && fetchOfficersAPI()
  }, [searchValue])
  useEffect(() => {
    fetchOfficersAPI()
  }, [selectedDepartment])

  useEffect(() => {
    fetchDepartmentsAPI()
  }, [])
  useEffect(() => {
    const list = []
    officers.map(officer => {
      const render = []
      render.push(<OfficerImage url={officer.user.profile_pic} alt={officer.badge_number + '-img'} />)
      render.push(
        <p align="center">
          {officer.first_name}
          {officer.last_name}
        </p>
      )
      render.push(<p align="center">{officer.badge_number}</p>)
      render.push(<p align="center">{officer.user.email}</p>)
      render.push(
        <Grid spacing={1} display="flex" direction="column" container justify="space-around">
          <Box component={Grid} item>
            <OfficerButton
              buttonName="View"
              color="default"
              size="small"
              variant="contained"
              align="center"
              startIcon={<VisibilityIcon />}
              click={() => {
                history.push(`admin-officer-details/${officer.id}`)
              }}
            />
          </Box>
        </Grid>
      )
      list.push(render)
      return list
    })
    setOfficerListData(list)
  }, [officers])

  return (
    <Box component="div" p={1}>
      <Typography variant="h4" component="h1">
        Officers List
      </Typography>

      <Box p={3} marginTop={1} marginBottom={1} component={Paper}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Typography variant="h5" component="h2">
              Select Department
            </Typography>

            <Autocomplete
              id="combo-box-demo"
              options={departments}
              onChange={(event, newValue) => {
                return (newValue != null) & setSelectedDepartment(newValue.id)
              }}
              getOptionLabel={option => (option.name ? option.name : '')}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Departments"
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="Department"
                />
              )}
            />
          </Grid>
          <Grid item container xs={12} sm={4} justify="flex-end" direction="column" />
        </Grid>
      </Box>
      <OfficerSearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearchClick={fetchOfficersAPI}
        placeholder="Search Officers Here"
        label="Search Officers Here"
      />
      <OfficerTable
        showSpinner={tableLoadSpinner}
        headers={['Profile Picture', 'Name', 'Badge Number', 'Email', 'Action']}
        headerColor="#00349A"
        data={officerListData}
        emptyPlaceholder="Department Not Selected"
      />
    </Box>
  )
}
export default AdminOfficers
