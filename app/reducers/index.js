import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  gameData: require("./robot").default
})

export default rootReducer
