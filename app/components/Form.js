import React from 'react'
import axios from "axios"
import store from "../store"
import { RobotWorld } from './RobotWorld'
import { Rotation, WalkForward } from "../reducers/robot"


function RobotClass() {
    this.health = 100;
    this.direction;
}
RobotClass.prototype.hitWall = function() {
    this.health--
}

RobotClass.prototype.rotation = function(theta) {
    store.dispatch(Rotation(theta))
}

RobotClass.prototype.walkForward = function(theta) {
    store.dispatch(WalkForward(theta))
}



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
     SubRobot.prototype.start = function(){{
 				let currPosition = store.getState().position
         if (Math.abs(currPosition.x) < 700 && Math.abs(currPosition.z) < 700) {
             this.walkForward();
         } else {
 					this.rotation(Math.PI * (2/3))
 					this.walkForward()
 				}
        ThreeRobot.position.x = store.getState().position.x
 				ThreeRobot.position.z = store.getState().position.z
 				ThreeRobot.rotation.y = store.getState().position.theta

     }
     return new SubRobot()
     })`
        };

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
        socket.io = socket.on('connection', function(){
          console.log('we have a connection')
          socket.emit('sendCode', "not real code this is just a test")

        })
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
