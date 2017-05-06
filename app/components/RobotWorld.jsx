import React from 'react'
import { init, robot, animate, camera, renderer, scene } from '../game/js/background.js'

export const RobotWorld = () => {
  console.log(robot)
  init()
  animate()
  return <div></div>
}
