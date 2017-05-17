
import {Line} from 'rc-progress';
import React from "react"
import store from "../../store"
export default class Healthbar extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      robots:store.getState().gameData.server.robots
    }
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      // console.log("thestorestate is ",store.getState().gameData.server.robots)
      this.setState({robots:store.getState().gameData.server.robots})
    });
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  render(){
    var robots;
    if (Object.keys(this.state.robots).length) {
      robots = Object.keys(this.state.robots)
      var healthBars = robots.map(robotID => {
        return ((this.state.robots[robotID].health) ?
        <Line percent={this.state.robots[robotID].health*10} key={robotID} strokeWidth="1" strokeColor="#42f471"/>
        : <div/>
        )
      })
    }
    return(
      <div> {healthBars} </div>
    )
}
}
