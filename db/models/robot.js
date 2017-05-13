const {STRING, VIRTUAL} = require('sequelize')

module.exports = db => db.define('robots', {
  robotName: {
    type: STRING,
    validate: {
      notEmpty: true
    }
  },
  code: {
    type: STRING,
    validate: {
      notEmpty: true
    }
  }
})

module.exports.associations = (Robot, {User}) => {
    Robot.belongsTo(User)
}
