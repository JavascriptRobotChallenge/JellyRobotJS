import {
    combineReducers
} from 'redux'

import auth from './auth/reducer'
import game from './game/reducer'

console.log('auth', auth, 'game', game)

const rootReducer = combineReducers({
    auth: auth,
    game: game
})

export default rootReducer
