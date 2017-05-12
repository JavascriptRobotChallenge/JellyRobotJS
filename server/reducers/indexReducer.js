var redux  = require('redux')

const rootReducer = redux.combineReducers({
  robots: require('./robotReducer').reducer,
  projectiles: require("./projectileReducer").reducer
})

module.exports = rootReducer
