import React from 'react'
import axios from "axios"
import store from "../store"
import { RobotWorld } from './RobotWorld'
import { Rotation, WalkForward, WalkBackward } from "../reducers/robot"
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import _ from "lodash"
import 'brace/mode/javascript';
import 'brace/theme/monokai';

var startingCode =
`(function(){
   function SubRobot(){
       this.color = "red"
    };

  SubRobot.prototype = Object.create(RobotClass.prototype)

  SubRobot.prototype.onIdle = function(id){
       var robotInstance = backendStore.getState()[id]
       return [
         { frequency: 1, action: this.walkForward},
         { frequency: 400, action: this.rotation, degrees: 60}
       ]
   }

  SubRobot.prototype.onWallCollision = function(id){
     var robotInstance = backendStore.getState()[id]
       var ownPosition = this.getOwnPosition(id)
       var otherPlayersPosition = this.findOpponent(id)
       var radAngle;
       if (!otherPlayersPosition){radAngle=0}
       else{
       var xDiff = otherPlayersPosition[0]-ownPosition[0]
       var zDiff = otherPlayersPosition[1]-ownPosition[1]
       if (xDiff>0&&zDiff>0){
         radAngle = Math.atan(xDiff/zDiff)
       }
       else if (xDiff>0&&zDiff<0){
         radAngle = Math.PI+Math.atan(xDiff/zDiff)
       }
       else if (xDiff<0&&zDiff<0){
         console.log("bothminus")
         radAngle = Math.PI+Math.atan(xDiff/zDiff)
       }
       else if(xDiff<0&&zDiff>0){
         console.log("quadfour")
         radAngle = Math.atan(xDiff/zDiff)
       }
     }
       this.rotation(id, 45)
       this.walkForward(id)
       this.walkForward(id)
       this.walkForward(id)
       this.walkForward(id)
       this.walkForward(id)
       this.fire(id, radAngle, 1)
    }

   SubRobot.prototype.onBoxCollision = function(id){
       this.rotation(id, 45)
       this.fire(id, 90)
       this.walkForward(id)
    }
    return new SubRobot()
 })`
var inputCode = startingCode

export default class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousInput: ''
    }
  }

  onChange(newCode) {
    inputCode = newCode
  }

  onSubmit() {
    socket.emit('sendCode', inputCode)
  }

  render () {
    return(
      <div>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          name="ace-form"
          value={startingCode}
          editorProps={{$blockScrolling: true}}
          maxLines = {20}
          minLines = {10}
          />
        <button onClick={this.onSubmit}>Submit</button>
        <RobotWorld />
      </div>
    );
  }
}
