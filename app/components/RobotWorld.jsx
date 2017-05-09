import store from "../store"
import React from 'react'
import { initThree, initPhysics, render, buildRobot } from '../game/js/physics.js'

var robots = []


export const RobotWorld = () => {
  var [scene, camera] = initThree()
  
  initPhysics(scene, camera)
  render(robots)
  return <div></div>
}
