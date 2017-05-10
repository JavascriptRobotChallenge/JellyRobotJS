const {createStore} = require('redux')

const rootReducer  = require('./indexReducer.js')

const backendStore = createStore(
  rootReducer
);

console.log('hello??', backendStore.getState())

module.exports = backendStore

  // {backendStore, jonah: 'jonah yooo'}
