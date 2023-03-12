import './i18n'
import React from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import './index.css'
import * as serviceWorker from './serviceWorker'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'bootstrap/dist/css/bootstrap.css'
import { SnackbarProvider } from 'notistack'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import { BrowserRouter } from 'react-router-dom'
import routes from './routes/RoutingDictionary'
import RouteFactory from './routes/RouteFactory'

var mixpanel = require('mixpanel-browser')
mixpanel.init('23f32f99bb1253985b376169f7f399bb')

ReactGA.initialize('UA-181023125-1')
ReactGA.pageview(window.location.pathname + window.location.search)
require('dotenv').config()

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00349A'
    },
    secondary: {
      main: '#A80000'
    }
  }
})

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="author" content="Office Survey" />
    <meta
      name="Description"
      content="Build community trust with Officer Survey. Early prevention tool allows police agencies to identify and correct problematic behaviors. Police Community Program, Grants available! FREE Demo. "
    />
    <meta
      name="keywords"
      content="Police Department Improvement tools, Police Officer Progress report, Police Reform Tools, Police Reform ideas, How to improve a police department, how to build better police and community relationships, hire better police officers, police crime reports, officer behavior. Officer feedback, Officer Rating. Police Reform Bill, Police Reform ideas"
    />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&display=swap"
      rel="stylesheet"
    />
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <RouteFactory routes={routes} />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </SnackbarProvider>,
  document.getElementById('root')
)

serviceWorker.unregister()
