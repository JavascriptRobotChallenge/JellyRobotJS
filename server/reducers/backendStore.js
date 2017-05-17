const redux = require('redux')

const rootReducer  = require('./indexReducer.js')

const backendStore = redux.createStore(
  rootReducer
);

module.exports = backendStore
