// import Detector and OrbitControls

import store from "../../store"
import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE)
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

//attach everything to the DOM
export var camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
export var scene = new THREE.Scene();
export var renderer = new THREE.WebGLRenderer({
    antialias: true
});

var robotModel;

export const init = () => {
    var container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    //RENDERER
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    //CAMERA
    camera.position.set(700, 200, -500);

    //CLOCK AND CONTROLS
    var clock = new THREE.Clock();
    var controls = new OrbitControls(camera);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = false;

    //LIGHT
    var light = new THREE.DirectionalLight(0xaabbff, 0.3);
    light.position.x = 300;
    light.position.y = 250;
    light.position.z = -500;
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    // SKYDOME
    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
        topColor: { type: "c", value: new THREE.Color(0x0077ff) },
        bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
        offset: { type: "f", value: 400 },
        exponent: { type: "f", value: 0.6 }
    };
    uniforms.topColor.value.copy(light.color);

    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms, vertexShader: vertexShader,
        fragmentShader: fragmentShader, side: THREE.BackSide
    });

    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // STATS
    var stats = new Stats();
    container.appendChild(stats.dom);

    //LOADING ROBOT MESH
    var loader = new THREE.JSONLoader()
    robotModel = loader.parse(robotjelly);

    // FLOOR AND BOXES MODEL
    loader.load("obj/lightmap/lightmap.js", function(geometry, materials) {
        for (var i = 0; i < materials.length; i++) {
            materials[i].lightMapIntensity = 0.1;
        }

        var mesh = new THREE.Mesh(geometry, materials);
        mesh.scale.multiplyScalar(100);
        scene.add(mesh);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildRobot(robot){
  var ThreeRobot = new THREE.Mesh(robotModel.geometry, robotModel.materials)
  ThreeRobot.position.set(robot.x, robot.y, robot.z);
  ThreeRobot.scale.set(40, 40, 40);
  window.robot = ThreeRobot
  scene.add(ThreeRobot);
  return ThreeRobot;
}

function buildProjectile(projectile){
    var geo = new THREE.SphereGeometry( 5, 32, 32 );
    var mat = new THREE.MeshBasicMaterial( {color: "rgb(132, 6, 0)"} );
    var practiceSphere = new THREE.Mesh( geo, mat );
    practiceSphere.position.set(projectile.x, 60 ,projectile.z);
    practiceSphere.scale.set(3, 3, 3);
    scene.add(practiceSphere)
    return practiceSphere
}

// function removeProjectile(projectile) {
//   //poor garbage collection - might need to also remove materials and geometries
// }

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
    requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      var storeState = store.getState().gameData
      then = now - (delta % interval);

        //ROBOTS
        if (storeState.robots) {
        for( var individualRobot in robots){
          if(!storeState.robots[individualRobot]){
            scene.remove(robots[individualRobot])
            delete robots[individualRobot]
          }
        }
        //ADDS ROBOTS IF THEY ARE IN STORE.STATE
        if (Object.keys(robots).length < Object.keys(storeState.robots).length) {
          for(var robotKey in storeState.robots){
            if (!robots[robotKey]) {
              robots[robotKey] = buildRobot(storeState.robots[robotKey])
            }
          }
        }
        //UPDATES ROBOT POSITION W STORE.STATE POSITION
        for(var robotKey in robots) {
          var robotState = storeState.robots
          robots && robots[robotKey] && (robots[robotKey].position.x = robotState[robotKey].x)
          robots && robots[robotKey] && (robots[robotKey].position.z = robotState[robotKey].z)
          robots && robots[robotKey] && (robots[robotKey].rotation.y = robotState[robotKey].theta)
        }
      }

      //PROJECTILES

      //REMOVES PROJECTILES IF THEY ARE NOT IN STORE.STATE
      for( var individualProjectile in projectiles){
        if(!storeState.projectiles[individualProjectile]){
          scene.remove(projectiles[individualProjectile])
          delete projectiles[individualProjectile]
        }
      }
      //ADDS PROJECTILES IF THEY ARE IN STORE.STATE
      for(var storeProjectile in storeState.projectiles){
        if(!projectiles[storeProjectile]){
          projectiles[storeProjectile] = buildProjectile(storeProjectile)
        }
      }
      //UPDATES PROJECTILE POSITION W STORE.STATE POSITION
      for(var projKey in projectiles) {
        var projectileState = storeState.projectiles
        projectiles && projectiles[projKey] && (projectiles[projKey].position.x = projectileState[projKey].x)
        projectiles && projectiles[projKey] && (projectiles[projKey].position.z = projectileState[projKey].z)
      }
    }

    renderer.render(scene, camera);
}
