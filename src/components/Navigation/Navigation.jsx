/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import LockIcon from '@material-ui/icons/Lock'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { Grid, Badge } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import logo from '../../assets/logo_officer.png'
import badge from '../../assets/officer_logo.png'
import { postAPIWithoutAuth, getAPI } from '../../utils/api'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setPlanRedux } from '../../redux/actions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import OfficerImage from '../Common/OfficerImage'
import {
  getIsSuperUser,
  getIsSupervisor,
  getUserAccessToken,
  getUserRefreshToken,
  removeUserAccessToken,
  removeProfilePic,
  removeUserId,
  removeUserRefreshToken,
  removeIsSupervisor,
  removeIsSuperUser,
  removePlan,
  removeTokenCreationTimeStamp
} from '../../utils/localStorage'
import { useEffect } from 'react'
import { logoutUrl, meApi } from '../../utils/apiUrls'
import './Navigation.css'
import {
  ASSINGMENT_SVG,
  CALLBACK_SVG,
  DASHBOARD_SVG,
  INTERVENTION_SVG,
  MAP_SVG,
  OFFICER_SVG,
  SEARCH_SVG,
  SUPPORT_SVG,
  SURVEY_SVG,
  EMPLOYEE_SVG,
  COMMUNITY_SVG,
  CrownSvg
} from '../../utils/svgs'

const drawerWidth = 250

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  navbarStyle: {
    justifyContent: 'space-between'
  },
  navbarItemsSpace: {
    marginLeft: '10px'
  },
  navbarItemsStyle: {
    display: 'flex',
    alignItems: 'center'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBarDrawer: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  appBarFull: {
    [theme.breakpoints.up('md')]: {
      width: '100%',
      marginLeft: 0
    }
  },
  drawerClose: {
    [theme.breakpoints.up('md')]: {
      marginLeft: 0
    }
  },
  drawerOpen: {
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  colorPaper: {
    background: 'primary'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    background: '#f5f6f8'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between'
  },
  drawerMenu: {
    background: '#ffffff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  menuItem: {
    color: 'white',
    width: '90%',
    marginTop: '8px'
  },

  supportmenuItem: {
    width: '90%',
    background: '#C12A31 !important',
    boxShadow: '0px 4px 10px rgba(0, 51, 153, 0.19)',
    borderRadius: '12px'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  selectedItem: {
    background: '#003399 !important',
    boxShadow: '0px 4px 10px rgba(0, 51, 153, 0.19)',
    color: 'white !important',
    borderRadius: '12px'
  },
  
  upgradeItem: {
    background: '#f0b11f !important',
    boxShadow: '0px 4px 10px rgba(0, 51, 153, 0.19)',
    color: 'white !important',
    borderRadius: '12px'
  }
}))

const OfficerNavigation = ({ children }) => {
  OfficerNavigation.propTypes = {
    children: PropTypes.any.isRequired
  }
  const { window: Window } = children
  const classes = useStyles()
  const [isSupervisor, setIsSupervisor] = useState(false)
  const [isSuperuser, setIsSuperuser] = useState(false)
  const history = useHistory()
  const theme = useTheme()
  const [openBrowserDrawer, setBrowserDrawerOpen] = useState(true)
  const [openMobileDrawer, setMobileDrawerOpen] = useState(false)
  const [auth] = useState(true)
  const [anchorProfile, setAnchorProfile] = useState(null)
  const [authenticatedUser, setAuthenticatedUser] = useState(false)
  const dispatch = useDispatch()
  const userData = useSelector(state => state.user.user)
  const location = useLocation()

  const planRedux = useSelector(state => state.plan.plan)

  const callBackCountRedux = useSelector(state => state.callbackCount.callback_count)
  const [callBackCount, setCallbackCount] = useState(0)

  const open = Boolean(anchorProfile)

  const [isSuspended, setIsSuspended] = useState()

  useEffect(() => {
    setCallbackCount(callBackCountRedux)
  }, [callBackCountRedux])

  const checkSelectedItem = path => {
    if (location.pathname === path) return true
    return false
  }

  const [leftDrawerItemsAdmin, setLeftDrawerItemsAdmin] = useState([
    {
      name: 'Admin Dashboard',
      icon: <HomeIcon style={{ color: 'white' }} />,
      path: '/admin-dashboard',
      isSelected: checkSelectedItem('/admin-dashboard')
    },
    {
      name: 'Admin Officers',
      icon: <SupervisorAccountIcon style={{ color: 'white' }} />,
      path: '/admin-officers',
      isSelected: checkSelectedItem('/admin-officers')
    }
  ])

  const [leftDrawerItemsSupervisor, setLeftDrawerItemsSupervisor] = useState([
    {
      name: 'Dashboard',
      icon: DASHBOARD_SVG,
      path: '/dashboard',
      isSelected: false,
      isPro: false,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Officers',
      icon: OFFICER_SVG,
      path: '/officers',
      isSelected: false,
      isPro: false,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Survey Builder',
      icon: SURVEY_SVG,
      path: '/survey',
      isSelected: false,
      isPro: false,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Map',
      icon: MAP_SVG,
      path: '/survey-response-by-map',
      isSelected: false,
      isPro: true,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Search By Citizen',
      icon: SEARCH_SVG,
      path: '/search-citizen',
      isSelected: false,
      isPro: true,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Assignment',
      icon: ASSINGMENT_SVG,
      path: '/assignment',
      isSelected: false,
      isPro: false,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Early Intervention',
      icon: INTERVENTION_SVG,
      path: '/early-intervention',
      isSelected: false,
      isPro: true,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Callback',
      icon: CALLBACK_SVG,
      path: '/call-back',
      isSelected: false,
      isPro: true,
      plans: ['Pro', 'Pro and Sms']
    },
    {
      name: 'Employee Feedback',
      icon: EMPLOYEE_SVG,
      path: '/employee-feedback',
      isSelected: false,
      isPro: true,
      plans: ['Pro', 'Employee', 'Pro and Sms']
    },
    {
      name: 'Community Feedback',
      icon: COMMUNITY_SVG,
      path: '/community-feedback',
      isSelected: false,
      isPro: true,
      plans: ['Pro', 'Employee', 'Community', 'Pro and Sms']
    },
    {
      name: 'SMS Surveys',
      icon: COMMUNITY_SVG,
      path: '/sms-surveys',
      isSelected: false,
      isPro: false,
      plans: ['Pro and Sms']
    }
  ])

  useEffect(() => {
    const tempLeftDrawerItemsSupervisor = []
    leftDrawerItemsSupervisor.map(item => {
      if (item.path === location.pathname) {
        item.isSelected = true
        tempLeftDrawerItemsSupervisor.push(item)
      } else {
        item.isSelected = false
        tempLeftDrawerItemsSupervisor.push(item)
      }
      return leftDrawerItemsSupervisor
    })
    setLeftDrawerItemsSupervisor(tempLeftDrawerItemsSupervisor)
  }, [location.pathname]) //eslint-disable-line react-hooks/exhaustive-deps

  const [leftDrawerItemsOfficer, setLeftDrawerItemsOfficer] = useState([
    {
      name: 'Dashboard',
      icon: DASHBOARD_SVG,
      path: '/dashboard',
      isSelected: false
    }
  ])

  useEffect(() => {
    const tempLeftDrawerItemsOfficer = []

    leftDrawerItemsOfficer.map(item =>
      item.path === location.pathname
        ? ((item.isSelected = true), tempLeftDrawerItemsOfficer.push(item))
        : ((item.isSelected = false), tempLeftDrawerItemsOfficer.push(item))
    )
    setLeftDrawerItemsOfficer(tempLeftDrawerItemsOfficer)
  }, [location.pathname])

  const itemSupport = {
    name: 'Support',
    icon: SUPPORT_SVG,
    path: '/support',
    isSelected: false
  }
  const handleAuthentication = async () => {
    const token = await getUserAccessToken()
    if (token != null) {
      setAuthenticatedUser(true)
      setIsSuperuser(await getIsSuperUser())
      setIsSupervisor(await getIsSupervisor())
    }
  }

  useEffect(() => {
    handleAuthentication()
  }, [])

  const handleBrowserDrawerToggle = () => {
    setBrowserDrawerOpen(!openBrowserDrawer)
  }

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!openMobileDrawer)
  }

  const handleProfileMenu = event => {
    setAnchorProfile(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorProfile(null)
  }
  const onClickToProfile = () => {
    history.push('/profile')
    handleClose()
  }
  const onClickChangePassword = () => {
    history.push('/change-password')
  }
  const onClickToDashboard = () => {
    history.push('/dashboard')
  }

  const tempLeftDrawerItemsAdmin = []
  const onClickListAdmin = currentItem => {
    history.push(currentItem.path)
    leftDrawerItemsAdmin.map(item =>
      item.path === currentItem.path
        ? ((item.isSelected = true), tempLeftDrawerItemsAdmin.push(item))
        : ((item.isSelected = false), tempLeftDrawerItemsAdmin.push(item))
    )
    setLeftDrawerItemsAdmin(tempLeftDrawerItemsAdmin)
  }

  const onClickListSupervisorPro = currentItem => {
    history.push(currentItem.path)
  }

  const onClickListOfficer = currentItem => {
    history.push(currentItem.path)
  }

  const handleLogOut = async () => {
    const admin = await getIsSuperUser()
    const refresh = await getUserRefreshToken()
    const body = {
      refresh_token: refresh
    }
    const res = await postAPIWithoutAuth(logoutUrl, body)
    if (!res.isError) {
      await removeUserRefreshToken()
      await removeUserAccessToken()
      await removeUserId()
      await removeIsSuperUser()
      await removeIsSupervisor()
      await removeProfilePic()
      await removePlan()
      await getIsSuperUser()
      await removeTokenCreationTimeStamp()
      admin ? history.push('/super-admin') : history.push('/login')
    }
  }

  const getUser = async () => {
    const response = await getAPI(meApi)
    if (!response.isError) {
      setIsSuspended(response.data.data.data.department.is_suspend)
      dispatch(setUser(response.data.data.data))
      dispatch(setPlanRedux(response.data.data.data.department.plan))
    }
  }

  useEffect(() => {
    getUser()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  const onUpgradeClick = () => {
    window.location.assign('https://www.officersurvey.com/upgrade-to-premium/')
  }

  useEffect(() => {
    if (isSuspended) {
      handleLogOut()
    }
  }, [isSuspended]) //eslint-disable-line react-hooks/exhaustive-deps

  const drawer = (
    <>
      <Grid className={classes.drawerHeader}>
        <img
          src={logo}
          alt="officerLogo"
          width="180x"
          height="60px"
          className="logoStyle"
          onClick={() => {
            onClickToDashboard()
          }}
        />
        <Hidden smDown implementation="css">
          <IconButton onClick={handleBrowserDrawerToggle} title="Clear">
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton onClick={handleMobileDrawerToggle} title="Clear">
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Hidden>
      </Grid>
      <Divider />
      {!authenticatedUser ? (
        <></>
      ) : (
        <List className={classes.drawerMenu}>
          {planRedux !== 'Pro and Sms' ? (
            <ListItem
              button
              className={`${classes.menuItem} ${classes.upgradeItem}`}
              onClick={() => onUpgradeClick()}
              key={'upgrade'}>
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex justify-content-center align-items-center">
                  <CrownSvg />
                  <p className={'selectedNavItem'}>Upgrage Now</p>
                </div>
              </div>
            </ListItem>
          ) : null}
          <div className="w-100 d-flex flex-column align-items-center mb-auto">
            {isSuperuser
              ? leftDrawerItemsAdmin.map(item => (
                  <ListItem
                    className={item.isSelected ? `${classes.menuItem} ${classes.selectedItem}` : classes.menuItem}
                    selected={item.isSelected}
                    button
                    onClick={() => onClickListAdmin(item)}
                    key={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <p className={item.isSelected ? 'selectedNavItem' : 'navItems'}>{item.name}</p>
                  </ListItem>
                ))
              : isSupervisor
              ? leftDrawerItemsSupervisor.map(item => (
                  <ListItem
                    className={item.isSelected ? `${classes.menuItem} ${classes.selectedItem}` : classes.menuItem}
                    selected={item.isSelected}
                    button
                    onClick={() => onClickListSupervisorPro(item)}
                    key={item.path}
                    disabled={!item.plans.some(item => planRedux === item)}>
                    <div className="d-flex justify-content-between w-100">
                      <div className="d-flex justify-content-center align-items-center">
                        <item.icon color={item.isSelected ? 'white' : '#707683'} />
                        <p className={item.isSelected ? 'selectedNavItem' : 'navItems'}>{item.name}</p>
                      </div>
                      {item.name === 'Callback' && callBackCount > 0 ? (
                        <div>
                          <Badge badgeContent={callBackCount} color="error" />
                        </div>
                      ) : null}
                      {!item.plans.some(item => planRedux === item) ? (
                        <LockIcon style={{ color: 'grey', marginRight: '8px' }} />
                      ) : null}
                    </div>
                  </ListItem>
                ))
              : leftDrawerItemsOfficer.map(item => (
                  <ListItem
                    className={item.isSelected ? `${classes.menuItem} ${classes.selectedItem}` : classes.menuItem}
                    selected={item.isSelected}
                    button
                    onClick={() => onClickListOfficer(item)}
                    key={item.path}
                    disabled={item.isPro && planRedux === 'Basic'}>
                    <div className="d-flex justify-content-between  w-100">
                      <div className="d-flex justify-content-center align-items-center">
                        <item.icon color={item.isSelected ? 'white' : '#707683'} />
                        <p className={item.isSelected ? 'selectedNavItem' : 'navItems'}>{item.name}</p>
                      </div>
                    </div>
                  </ListItem>
                ))}
          </div>
          {!isSuperuser ? (
            <ListItem
              className={classes.supportmenuItem}
              button
              onClick={() => onClickListSupervisorPro(itemSupport)}
              key={'support'}>
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex justify-content-center">
                  <itemSupport.icon color={'white'} />
                  <p className={'supportdNavItem'}>{itemSupport.name}</p>
                </div>
              </div>
            </ListItem>
          ) : null}
        </List>
      )}
    </>
  )

  const container = Window !== undefined ? () => Window().document.body : undefined

  return (
    <>
      <AppBar
        color="inherit"
        position="fixed"
        className={openBrowserDrawer || openMobileDrawer ? classes.appBarDrawer : classes.appBarFull}>
        <Toolbar className={classes.navbarStyle}>
          <Grid className={classes.navbarItemsStyle}>
            <img
              className={clsx(openMobileDrawer || (openBrowserDrawer && classes.hide))}
              src={badge}
              alt="officerLogo"
              width="40px"
              height="40px"
            />
            <Hidden mdUp implementation="css">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                title="Clear"
                edge="start"
                onClick={handleMobileDrawerToggle}
                className={clsx(classes.menuButton, openMobileDrawer && classes.hide, classes.navbarItemsSpace)}>
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden smDown implementation="css">
              <IconButton
                title="Clear"
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleBrowserDrawerToggle}
                className={clsx(classes.menuButton, openBrowserDrawer && classes.hide, classes.navbarItemsSpace)}>
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Grid>
          {auth && (
            <>
              <IconButton
                title="Clear"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenu}
                color="inherit">
                <OfficerImage
                  url={userData.user.profile_pic}
                  alt="Logo"
                  width="40px"
                  height="40px"
                  imageStyle={{ borderRadius: '50%' }}
                  borderRadius="50%"
                />
                <p className="name pl-3 ">
                  {userData.first_name} {userData.last_name}
                  <ExpandMoreIcon />
                </p>
              </IconButton>
              {isSuperuser ? (
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorProfile}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={handleClose}>
                  <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                </Menu>
              ) : (
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorProfile}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={handleClose}>
                  <MenuItem onClick={onClickToProfile}>Profile</MenuItem>
                  <MenuItem onClick={onClickChangePassword}>Change Password</MenuItem>
                  <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                </Menu>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={openMobileDrawer}
            onClose={handleMobileDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={openBrowserDrawer}
            classes={{
              paper: classes.drawerPaper
            }}>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={openBrowserDrawer || openMobileDrawer ? classes.drawerOpen : classes.drawerClose}>
          {children}
          <div>{/* <MainFooter /> */}</div>
        </div>
      </main>
    </>
  )
}

export default OfficerNavigation
