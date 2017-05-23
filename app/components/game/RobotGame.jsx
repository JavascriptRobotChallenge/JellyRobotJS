import React from 'react'
import { RobotWorld } from './RobotWorld'
// import CountdownReduxContainer from "./Countdown"
import EditorDocs from './EditorDocs'

export default class RobotGame extends React.Component {
  render () {
    return(
      <div className="robot-game">
        <EditorDocs />
        <RobotWorld />
      </div>
    );
  }
}
