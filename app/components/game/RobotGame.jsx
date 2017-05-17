import React from 'react'
import { RobotWorld } from './RobotWorld'
import Healthbar from "./Healthbar"
import EditorDocs from './EditorDocs'
import CountdownReduxContainer from "./Countdown"

export default class RobotGame extends React.Component {
  render () {
    return(
      <div className="robot-game">
        <EditorDocs />
        <RobotWorld />
        <Healthbar />
      </div>
    );
  }
}
