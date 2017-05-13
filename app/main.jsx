'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Form from "./components/Form"
import { ServerUpdate, AssignRoom } from "./reducers/robot.js"

import * as THREE from 'three';

socket.on('connect', function(){
  console.log('we have a connection')
  socket.emit('giveMeARoom')
})

socket.on('roomAssigned', function(myRoom){
  store.dispatch(AssignRoom(myRoom))
})

socket.on('serverUpdate', function(data){
  store.dispatch(ServerUpdate(data))
})



const ExampleApp = connect(
  ({ auth }) => ({ user: auth })
)(
  ({ user, children }) =>
    <div>
      <nav>
        {user ? <WhoAmI/> : <Login/>}
      </nav>
      {children}
    </div>
)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={ExampleApp}>
        <IndexRedirect to="/jokes" />
        <Route path="/jokes" component={Form} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
