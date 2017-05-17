import ReactCountdownClock from "react-countdown-clock"
import React from "react"
import store from "../../store"
import socket from "../../socket"
import { browserHistory } from 'react-router';

function Countdown(props){
  function onComplete(){
    if (Object.keys(store.getState().gameData.server.robots) === 2){
        browserHistory.push("/loss")
    }
  }

  return(
    <div>
      <h1>heyy</h1>
      <ReactCountdownClock
         id="timer"
         seconds={90}
         color="white"
         alpha={1}
         size={100}
         paused ={
             (function pause(){
                return (Object.keys(props.robots).length >= 2)
             })()}
         onComplete={()=>{
            browserHistory.push("/tie")
            socket.emit("disconnect")
         }}
      />
    </div>
  )
}

/* ------ CONTAINER ------ */
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
      robots : state.gameData.server.robots
    }
}

export default connect(mapStateToProps, null)(Countdown)
