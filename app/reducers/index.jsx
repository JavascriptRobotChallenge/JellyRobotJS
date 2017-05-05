import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  robot: require("./robot").default
})

export default rootReducer
