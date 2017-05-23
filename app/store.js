import {
    createStore,
    applyMiddleware
} from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './redux/rootReducer.js'
import thunkMiddleware from 'redux-thunk'

import { whoami } from './redux/auth/actionCreators'

const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(
            thunkMiddleware
        )
    )
)

export default store
