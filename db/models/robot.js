const {STRING, TEXT, VIRTUAL} = require('sequelize')

module.exports = db => db.define('robots', {
  robotName: {
    type: STRING,
    validate: {
      notEmpty: true
    }
  },
  code: {
    type: TEXT,
    validate: {
      notEmpty: true
    }
  }
})

module.exports.associations = (Robot, {User}) => {
    Robot.belongsTo(User)
}
