import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'

import {whoami} from './reducers/auth'

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

export default store

// Set the auth info at start
store.dispatch(whoami())
