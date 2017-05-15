import React from 'react'
import { RobotWorld } from './RobotWorld'
import Editor from './Editor'
import Healthbar from "./Healthbar"

export default class NameForm extends React.Component {

  render () {
    return(
      <div className="robot-game">
        <Editor />
        <Healthbar/>
        <RobotWorld/>
      </div>
    );
  }
}
