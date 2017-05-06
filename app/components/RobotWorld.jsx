import React from 'react'
import { init, animate, camera, renderer, scene } from '../game/js/background.js'

export const RobotWorld = () => {
  var robotThree = init()
  animate(robotThree)
  return <div></div>
}
