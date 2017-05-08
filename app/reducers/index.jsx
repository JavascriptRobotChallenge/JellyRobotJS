import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  robotData: require("./robot").default
})

export default rootReducer
