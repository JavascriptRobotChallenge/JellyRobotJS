const redux = require('redux')

const rootReducer  = require('./index.jsx')

const backendStore = redux.createStore(
  rootReducer
);

module.exports = backendStore
