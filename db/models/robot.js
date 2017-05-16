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
//   },
//   wins:{
//     type:NUMBER
//   },
//   losses:{
//     type:NUMBER
//   },
//   ties:{
//     type:NUMBER
//   },
// },{
  // getterMethods:{
  //   winningPercentage(){
  //     return wins/losses
  //   } 
  // }
})

module.exports.associations = (Robot, {User}) => {
    Robot.belongsTo(User)
}
