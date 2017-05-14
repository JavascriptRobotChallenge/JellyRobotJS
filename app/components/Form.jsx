import React from 'react'
import store from "../store"
import { RobotWorld } from './RobotWorld'
import { Rotation, WalkForward, WalkBackward } from "../reducers/robot"
import AceEditor from 'react-ace';
import socket from '../socket';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

var startingCode =
`(function(){
   function SubRobot(){
       this.color = "red"
    };


  SubRobot.prototype = Object.create(RobotClass.prototype)
  //ToDo: call functions with roomName and PlayerId so we know
  // which robot to move
  SubRobot.prototype.start = function(roomName, playerId){
    this.walkForward(roomName, playerId)
    this.walkTowardOpponent(roomName, playerId)
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

    socket.emit('sendCode', inputCode, store.getState().gameData.room)
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
