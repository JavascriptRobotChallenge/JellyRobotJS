import ReactCountdownClock from "react-countdown-clock"
import React from "react"
import store from "../store"
import socket from "../socket"
import { browserHistory } from 'react-router';
function Countdown(props){
    console.log('gothere',Object.keys(props.robots))
    const onComplete = function(){
        console.log("gameover")

        console.log("gameover")
        console.log("gameover")
    if(Object.keys(store.getState().gameData.server.robots)===2){

    }
}
return(
<div>
<h1>heyy</h1>
<ReactCountdownClock 
                     id="timer"
                     seconds={200}
                     color="white"
                     alpha={1}
                     size={100}
                     paused ={
                         (function pause(){
                             var len = Object.keys(props.robots).length
                            console.log(this)
                            if (len>=2){
                                console.log("smalllen")
                                return false
                            }
                            else{
                                return true
                            }
                         })()}
                     onComplete={()=>{
                        browserHistory.push("/tie")
                        socket.emit("disconnect")
                     }}
                    />
                    </div>
)
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        robots:state.gameData.server.robots
    }
}



const CountdownReduxContainer = connect(mapStateToProps, null)(Countdown)
export default CountdownReduxContainer
