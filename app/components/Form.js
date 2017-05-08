import React from 'react'
import axios from "axios"
import store from "../store"
import { RobotWorld } from './RobotWorld'
import { Rotation, WalkForward } from "../reducers/robot"


// function RobotClass() {
//     this.health = 100;
//     this.direction;
// }
// RobotClass.prototype.hitWall = function() {
//     this.health--
// }
//
// RobotClass.prototype.rotation = function(playerId, theta) {
//   console.log('robotclass rotation', playerId, theta)
//     // store.dispatch(Rotation(playerId, theta))
// }
//
// RobotClass.prototype.walkForward = function(theta) {
//     store.dispatch(WalkForward(theta))
// }

export default class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: `
            (function(){
            function SubRobot(){
                this.color = "red"
             };

             SubRobot.prototype = Object.create(RobotClass.prototype)

             SubRobot.prototype.start = function(id){
               var robotInstance = backendStore.getState()[id]

                 if (Math.abs(robotInstance.x) < 700 && Math.abs(robotInstance.z) < 700) {
                     this.walkForward(id);
                 } else {
                  this.rotation(id, 1)
                  this.walkForward(id)
                }
             }

             return new SubRobot()
            })`
        };

        // var position = backendStore.getState()[id]
        // var currPosition = {}
        //  currPosition.x = position.x
        //  currPosition.y = position.y
        //  currPosition.z= position.z
        //   if (Math.abs(currPosition.x) < 700 && Math.abs(currPosition.z) < 700) {
        //       this.walkForward(id);
        //   } else {
        //    this.rotation(Math.PI * (2/3))
        //    this.walkForward(id)
        //  }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('inside emit')
        socket.emit('sendCode', this.state.value)
    }

    render() {
      return (
        <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Code robot:
            <br />
            <textarea  value={this.state.value} rows="40" onChange={this.handleChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <RobotWorld />
      </div>
      );
    }
}
