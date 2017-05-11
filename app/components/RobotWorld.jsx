import React from 'react'
import { init, animate, camera, renderer, scene } from '../game/js/background.js'
import Healthbar from "./Healthbar"
import store from "../store"
var robots = store.getState().gameData.robots?Object.keys(store.getState().gameData.robots):[]
var robotsHealth = robots.map((robot)=>{
  return robot.health
})


export const RobotWorld = () => {
  var robotThree = init()
  animate(robotThree)
  return <div>
    <Healthbar robotsHealth={robotsHealth}/>
  </div>
}
