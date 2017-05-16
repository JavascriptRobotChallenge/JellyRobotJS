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
import Loss from "./components/Loss"
import Win from "./components/Win"
import {whoami} from './reducers/auth'
const onMainEnter = () => {
  store.dispatch(whoami())
}
render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={onMainEnter} >
        <IndexRedirect to="/home" />
        <Route path="/home" component={Homepage} />
        <Route path="/docs" />
        <Route path="/game" component={RobotGame} />
        <Route path="/login" component={Login} />
        <Route path="/loss" component={Loss} />
        <Route path="/win" component={Win} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
