const redux = require('redux')

const {reducer} = require('./robotReducer.js')

const backendStore = redux.createStore(
  reducer,
  null
);

module.exports = backendStore
