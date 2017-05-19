
import {Line} from 'rc-progress';
import React from "react"
import store from "../../store"
export default class Healthbar extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      robots: store.getState().gameData.server.robots
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
// <Line percent={this.state.robots[robotID].health*10} key={robotID} strokeWidth="1" strokeColor="#42f471"/>

  render(){
    console.log('this is the store right now', store.getState().gameData)
    var robots;
    // if (Object.keys(this.state.robots).length) {
      robots = Object.keys(this.state.robots)
      // var healthBars = robots.map(robotID => {
      //   return ((this.state.robots[robotID].health) ?
      //       <div/>
      //   : <div/>
      //   )
      // })
    // }
    return(
        <div className="score-board">
        <div id="scoreboard">
          {
             robots && robots.map(robotID => {
              return ((this.state.robots[robotID].health) ?
                  <div className="score" key={robotID}>
                    <div id="user-score"><span className="animated">
                      {this.state.robots[robotID].health * 10}
                    </span></div>
                    <h4>{ this.state.robots[robotID].userName &&
                    this.state.robots[robotID].userName.name}</h4>
                  </div>
                  : <div/>
              )
            })
          }
        </div>
        </div>
    )
}
}
