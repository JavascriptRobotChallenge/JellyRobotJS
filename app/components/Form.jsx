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

  SubRobot.prototype.onIdle = function(roomName, id){
      //  var robotInstance = backendStore.getState()[roomName][id]
       return [
          { frequency: 1, action: this.walkForward},
          { frequency: 10, action: this.accurateFire, playerId: id},
          { frequency: 400, action: this.rotation, degrees: 60}
       ]
   }

  SubRobot.prototype.onClose = function(id){
     var robotInstance = backendStore.getState()[id]
     return [
       { frequency: 1, action: this.walkForward},
      { frequency: 10, action: this.accurateFire, playerId: id},
       { frequency: 400, action: this.rotation, degrees: 60}
     ]
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
