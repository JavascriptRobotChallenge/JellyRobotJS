import React from 'react'
import { animate } from '../../game/js/animate.js'
import { init, camera, renderer, scene } from '../../game/js/initThree.js'
import store from "../../store"

export const RobotWorld = () => {
  var robotThree = init()
  animate()
  return (
    <div> </div>
  )

}
