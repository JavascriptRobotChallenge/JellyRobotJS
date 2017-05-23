import {
    combineReducers
} from 'redux'

const rootReducer = combineReducers({
    auth: require('./auth').default,
    gameData: require("./frontendStore").default
})

export default rootReducer