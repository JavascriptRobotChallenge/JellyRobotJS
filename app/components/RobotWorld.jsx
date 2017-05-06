import React from 'react'
import { init, animate, camera, renderer, scene } from '../game/js/background.js'

export const RobotWorld = () => {
  var robotThree = init()
  console.log("yoooo",robotThree)
  animate(robotThree)
  return <div></div>
}
