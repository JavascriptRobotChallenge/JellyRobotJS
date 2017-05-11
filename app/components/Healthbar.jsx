import {Line} from 'rc-progress';
import React from "react"
import store from "../store"
export default class Healthbar extends React.Component{
  constructor(props){
    super(props)
    this.state = store.getState().gameData.robots
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState().gameData.robots)
    });
  }

  render(){
    console.log("thisisprops", this.state)
    var robots;
    if (this.state) {
      robots = Object.keys(this.state)
      // console.log('robot health', this.state[robotID].health)
      var healthBars = robots.map(robotID => {
        return ((this.state[robotID].health) ?
        <Line percent={this.state[robotID].health} key={robotID} strokeWidth="4" strokeColor="#42f471"/>
        : <div/>
        )
      })
    }
    return(
      <div> {healthBars} </div>
    )
}
}
