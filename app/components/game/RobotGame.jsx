import React from 'react'
import { RobotWorld } from './RobotWorld'
import Editor from './Editor'
import Healthbar from "./Healthbar"
import socket from "../../socket"
export default class NameForm extends React.Component {
  render () {
    socket.emit("giveMeARoom")
    return(
      <div className="robot-game">
        <Editor />
        <Healthbar/>
        <RobotWorld/>
      </div>
    );
  }
}
