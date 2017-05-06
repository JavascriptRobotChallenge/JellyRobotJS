import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  position: require("./robot").default
})

export default rootReducer
