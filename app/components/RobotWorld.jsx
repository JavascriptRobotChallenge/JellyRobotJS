import React from 'react'
import { animate } from '../game/js/animate.js'
import { init, camera, renderer, scene } from '../game/js/initThree.js'
import store from "../store"
// var robots = store.getState().gameData.robots?Object.keys(store.getState().gameData.robots):[]
// var robotsHealth = robots.map((robot)=>{
//   return robot.health
// })

export const RobotWorld = () => {
  var robotThree = init()
  animate()
  return <div>
  </div>
}
