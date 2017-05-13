import store from "../../store"
import * as THREE from 'three';
import { init, robotModel, camera, renderer, scene } from './initThree.js'
var counterDebug =0;
function buildRobot(robot){
  var ThreeRobot = new THREE.Mesh(robotModel.geometry, robotModel.materials)
  ThreeRobot.position.set(robot.x, robot.y, robot.z);
  ThreeRobot.scale.set(40, 40, 40);
  window.robot = ThreeRobot
  scene.add(ThreeRobot);
  return ThreeRobot;
}

function buildProjectile(projectile){
  if(counterDebug < 5)
  console.log(projectile, 'this is the projectile')
    var geo = new THREE.SphereGeometry( 5, 32, 32 );
    var mat = new THREE.MeshBasicMaterial( {color: "rgb(132, 6, 0)"} );
    var practiceSphere = new THREE.Mesh( geo, mat );
    practiceSphere.position.set(projectile.x, 60 ,projectile.z);
    practiceSphere.scale.set(3, 3, 3);
    scene.add(practiceSphere)
    return practiceSphere
}

//SW: keep game loop in mind - can affect future performance
//SW: but don't pre optimize
var projectiles = {}
var robots = {}

var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

export const animate = () => {
    counterDebug++;
    requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      var storeState = store.getState().gameData
      const roomName = store.getState().gameData.room
      then = now - (delta % interval);
      // console.log(roomName, 'roomname')
        //ROBOTS
        if(roomName.length){
          if(counterDebug < 5)
          console.log('storestate', storeState)
          if (storeState.server.robots) {
          for( var individualRobot in robots){
            if(!storeState.server.robots[individualRobot]){
              scene.remove(robots[individualRobot])
              delete robots[individualRobot]
            }
          }
        }

        //ADDS ROBOTS IF THEY ARE IN STORE.STATE
        if (Object.keys(robots).length < Object.keys(storeState.server.robots).length) {
          for(var robotKey in storeState.server.robots){
            if (!robots[robotKey] && storeState.server.robots[robotKey].robotInstance) {
              robots[robotKey] = buildRobot(storeState.server.robots[robotKey])
            }
          }
        }
        //UPDATES ROBOT POSITION W STORE.STATE POSITION
        for(var robotKey in robots) {
          var robotState = storeState.server.robots
          robots && robots[robotKey] && (robots[robotKey].position.x = robotState[robotKey].x)
          robots && robots[robotKey] && (robots[robotKey].position.z = robotState[robotKey].z)
          robots && robots[robotKey] && (robots[robotKey].rotation.y = robotState[robotKey].theta)
        }
      }

      //PROJECTILES

      //REMOVES PROJECTILES IF THEY ARE NOT IN STORE.STATE
      for( var individualProjectile in projectiles){
        if(!storeState.server.projectiles[individualProjectile]){
          scene.remove(projectiles[individualProjectile])
          delete projectiles[individualProjectile]
        }
      }
      //ADDS PROJECTILES IF THEY ARE IN STORE.STATE
      if(roomName.length){
        for(var storeProjectile in storeState.server.projectiles){
          if(!projectiles[storeProjectile]){
            projectiles[storeProjectile] = buildProjectile(storeProjectile)
          }
        }
      }

      //UPDATES PROJECTILE POSITION W STORE.STATE POSITION
      for(var projKey in projectiles) {
        var projectileState = storeState.server.projectiles
        if (projectiles && projectiles[projKey]){
          projectiles[projKey].position.x = projectileState[projKey].x
          projectiles[projKey].position.z = projectileState[projKey].z
        }
      }
    }

    renderer.render(scene, camera);
}
