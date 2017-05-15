'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import App from './components/App'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import RobotGame from './components/Game/RobotGame'
import Homepage from './components/Homepage'

import {whoami} from './reducers/auth'

const onHomepageEnter = () => {
  store.dispatch(whoami())
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/home" />
        <Route path="/home" component={Homepage} onEnter={onHomepageEnter} />
        <Route path="/docs" />
        <Route path="/game" component={RobotGame} />
        <Route path="/login" component={Login} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
