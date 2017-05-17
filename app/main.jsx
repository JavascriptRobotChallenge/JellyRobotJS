'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'
import socket from './socket'

import store from './store'
import App from './components/App'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import RobotGame from './components/Game/RobotGame'
import Homepage from './components/Homepage'
import Docs from './components/game/Docs'
import Loss from './components/game/Loss'
import Win from './components/game/Win'
import Tie from './components/game/Tie'

import {whoami} from './reducers/auth'

const onMainEnter = () => {
  store.dispatch(whoami())
}

const onMultiEnter = () => {
  socket.emit('giveMeARoom')
}

const CanvasDelete = () => {
  const canvases = [...document.getElementsByTagName('canvas')]
  canvases.forEach(canvas => { canvas.remove() })
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={onMainEnter} >
        <IndexRedirect to="/home" />
        <Route path="/home" component={Homepage} />
        <Route path="/docs" component={Docs} />
        <Route path="/game" component={RobotGame} onEnter={onMultiEnter} />
        <Route path="/login" component={Login} />
      </Route>
      <Route path="/loss" component={Loss} onEnter={CanvasDelete} />
      <Route path="/win" component={Win} onEnter={CanvasDelete} />
      <Route path="/tie" component={Tie} onEnter={CanvasDelete} />
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
