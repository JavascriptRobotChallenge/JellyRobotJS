const {
    createStore
} = require('redux')
const rootReducer = require('./rootReducer.js')

const store = createStore(
    rootReducer
);

module.exports = store