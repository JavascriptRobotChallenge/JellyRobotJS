import {
  ASSIGN_ROOM,
  SERVER_UPDATE,
  GOT_TEST_ROBOTS,
  SAVE_ROBOT,
  GET_TEST_ROBOTS
} from './constants'

import { initialState } from './initialState'

const reducer = (state = initialState, action) => {
    var newState = state

    switch (action.type) {
        case ASSIGN_ROOM:
            newState.room = action.room
            return newState
        case SERVER_UPDATE:
            newState.server = action.payload
            return newState
        case GOT_TEST_ROBOTS:
            newState.testRobots = action.testRobots
            return newState
        default:
            return newState
    }
}

export default reducer
