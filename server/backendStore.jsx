const redux = require('redux')

const {reducer} = require('./robotReducer.js')

const store = redux.createStore(
  reducer
);

module.exports = store
