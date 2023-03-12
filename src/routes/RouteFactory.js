/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Route, Switch, useLocation, useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux'
import { locationNonAuth } from '../utils/Constants/index'
import PageNotFound from '../components/PageNotFound'
import { getUserAccessToken, getIsSupervisor, getIsSuperUser } from '../utils/localStorage'
import { getAPI } from '../utils/api'
import { setCallbackCount } from '../redux/actions'
import { callBackCountUrl } from '../utils/apiUrls'
import OfficerNavigation from '../components/Navigation'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const RouteFactory = ({ routes }) => {
  RouteFactory.propTypes = {
    routes: PropTypes.any.isRequired
  }
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const notify = (message = '', variant = 'success', duration = 1000) => {
    enqueueSnackbar(message, {
      variant,
      autoHideDuration: duration,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    })
  }
  const location = useLocation()
  const history = useHistory()
  const [userRole, setUserRole] = useState()
  const planRedux = useSelector(state => state.plan.plan)

  const fetchCallbackCount = async () => {
    const isSuperVisor = await getIsSupervisor()
    if (!isSuperVisor) return
    const response = await getAPI(callBackCountUrl)
    const count = response.data.data.data.count
    if (!response.isError) {
      dispatch(setCallbackCount(count))
    }
  }

  const filterRoutes = routesList => {
    return routesList.filter(route => route.access.some(item => item === userRole))
  }
  const filtered = filterRoutes(routes)

  const getToken = async () => {
    const response = await getUserAccessToken()
    const isSupervisor = await getIsSupervisor()
    const isAdmin = await getIsSuperUser()

    response && isSupervisor && !isAdmin && setUserRole('SUPERVISOR')
    response && !isSupervisor && !isAdmin && setUserRole('OFFICER')
    response && isAdmin && setUserRole('ADMIN')
    !response && setUserRole('GUEST')
  }

  const checkForPath = () => {
    if (locationNonAuth.some(item => location.pathname.includes(item))) {
      setUserRole('GUEST')
    } else getToken()
  }

  useEffect(() => {
    checkForPath()
    fetchCallbackCount()
  }, [location])

  useEffect(() => {
    if (!locationNonAuth.some(item => location.pathname.includes(item)))
      if (
        !filtered.some(item => {
          if (item.params) return location.pathname.includes(item.path.split(':')[0])
          else return item.path === location.pathname
        })
      ) {
        if (userRole === 'GUEST') history.push('login')
        else if (userRole === 'SUPERVISOR') {
          if (planRedux === 'Employee') {
            history.push('employee-feedback')
          } else if (planRedux === 'Community') {
            history.push('community-feedback')
          } else {
            history.push('/dashboard')
          }
        } else if (userRole === 'OFFICER') history.push('dashboard')
        else if (userRole === 'ADMIN') history.push('admin-dashboard')
      }
  }, [userRole, location.pathname])

  return (
    <>
      {userRole === 'GUEST' ? (
        <Switch>
          {filtered.map(route => {
            return (
              <Route
                exact={route.exact}
                key={route.path}
                path={route.path}
                render={() => <route.component notify={notify} />}
              />
            )
          })}
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      ) : userRole === 'SUPERVISOR' ? (
        <>
          <OfficerNavigation>
            <Switch>
              {filtered.map(route => {
                return (
                  <Route
                    exact={route.exact}
                    key={route.path}
                    path={route.path}
                    render={() => <route.component notify={notify} />}
                  />
                )
              })}
              <Route path="*">
                <PageNotFound />
              </Route>
            </Switch>
          </OfficerNavigation>
        </>
      ) : userRole === 'OFFICER' ? (
        <OfficerNavigation>
          <Switch>
            {filtered.map(route => {
              return (
                <Route
                  exact={route.exact}
                  key={route.path}
                  path={route.path}
                  render={() => <route.component notify={notify} />}
                />
              )
            })}
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </OfficerNavigation>
      ) : userRole === 'ADMIN' ? (
        <OfficerNavigation>
          <Switch>
            {filtered.map(route => {
              return (
                <Route
                  exact={route.exact}
                  key={route.path}
                  path={route.path}
                  render={() => <route.component notify={notify} />}
                />
              )
            })}
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </OfficerNavigation>
      ) : null}
    </>
  )
}
export default RouteFactory
