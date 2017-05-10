const {createStore} = require('redux')

const rootReducer  = require('./indexReducer.js')

const backendStore = createStore(
  rootReducer
);

module.exports = backendStore
