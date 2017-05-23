var redux = require('redux')

const rootReducer = redux.combineReducers({
    robots: require('./robots/reducer.js').reducer,
    projectiles: require("./projectiles/reducer.js").reducer
})

module.exports = rootReducer