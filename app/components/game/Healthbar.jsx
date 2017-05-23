import {Line} from 'rc-progress';
import React from "react"
import store from "../../store"

export default class Healthbar extends React.Component {
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

  checkIndexIsEven = (n) => {
    return ((n % 2) === 0);
  }

  render() {
    var robots = Object.keys(this.state.robots)
    const leftStyle = { position: 'absolute', marginTop: '55%', marginLeft: '10%' }
    const rightStyle = { position: 'absolute', marginTop: '55%', marginLeft: '70%' }

    return (
      <div className="score-board">
        <div id="scoreboard">
          {
             robots && robots.map((robotID, idx) => {
              return ((this.state.robots[robotID].health) ?
                  <div className="score" key={robotID} style={(this.checkIndexIsEven(idx + 1)) ? rightStyle : leftStyle }>
                    <div id="user-score"><span className="animated">
                      {this.state.robots[robotID].health}
                    </span></div>
                    <h4>{ this.state.robots[robotID].userName &&
                    this.state.robots[robotID].userName.name || this.state.robots[robotID].userName}</h4>
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
