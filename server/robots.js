'use strict'

const db = require('APP/db')
const Robots = db.model('robots')

const {mustBeLoggedIn, forbidden} = require('./auth.filters')

module.exports = require('express').Router()
  .post('/',
    (req, res, next) =>
      Robot.create(req.body)
      .then(user => res.status(201).json(user))
      .catch(next))
  // .get('/:id',
  //   mustBeLoggedIn,
  //   (req, res, next) =>
  //     User.findById(req.params.id)
  //     .then(user => res.json(user))
  //     .catch(next))
