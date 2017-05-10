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
    camera.position.set(700, 200, -500);

    var loader = new THREE.JSONLoader()
    robotModel = loader.parse(Window.robotjelly);

    renderer.setPixelRatio(window.devicePixelRatio);

    var container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    var stats;
    var clock = new THREE.Clock();
    var controls = new OrbitControls(camera);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = false;

  var testMarker = new THREE.Mesh(robotModel.geometry, robotModel.materials)
  testMarker.position.set(100, 0,100);
  testMarker.scale.set(40, 40, 40);
  scene.add(testMarker);
  window.testMarker = testMarker




  scene.add(practiceSphere)
  window.practiceSphere = practiceSphere


    // LIGHTS

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
        topColor: {
            type: "c",
            value: new THREE.Color(0x0077ff)
        },
        bottomColor: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        offset: {
            type: "f",
            value: 400
        },
        exponent: {
            type: "f",
            value: 0.6
        }
    };
    uniforms.topColor.value.copy(light.color);

    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });

    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // STATS
    stats = new Stats();
    container.appendChild(stats.dom);

    // MODEL
    loader.load("obj/lightmap/lightmap.js", function(geometry, materials) {
        for (var i = 0; i < materials.length; i++) {
            materials[i].lightMapIntensity = 0.1;
        }

        var mesh = new THREE.Mesh(geometry, materials);
        mesh.scale.multiplyScalar(100);
        scene.add(mesh);
    });

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    buildRobot()
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildRobot(){
  var ThreeRobot = new THREE.Mesh(robotModel.geometry, robotModel.materials)
  ThreeRobot.position.set(400, 400, 400);
  ThreeRobot.scale.set(40, 40, 40);
  window.robot = ThreeRobot
  scene.add(ThreeRobot);
  return ThreeRobot;
}

function initializePlayers(){
  //when server emits a connect event, make our own ThreeRobot
  // when server emits a PlayerAdded event, make their ThreeRobot
  // socket.on()
}

// gonna use bcrypt
var projectiles = {}
function makeProjectile(){
  if (Object.keys(projectiles).length < Object.keys(store.getState().gameData.robots).length ){

  // store.getState
  var geo = new THREE.SphereGeometry( 5, 32, 32 );
  var mat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var practiceSphere = new THREE.Mesh( geo, mat );
  var myStoreState
  practiceSphere.position.set(500, 50 ,500);
  }
}

function updateProjectile(){
  // reset positions
}

//SW: keep game loop in mind - can affect future performance
//SW: but don't pre optimize
var robots = {}
export const animate = () => {
  // if the store has robots, and the local array doesn't -- we need to make new robots
  // console.log(Object.keys(store.getState().robotData), 'ROBOT DATA KEYS OBJECT')
    if (Object.keys(robots).length < Object.keys(store.getState().gameData.robots).length ){
      var keys = Object.keys(store.getState().gameData.robots)

      for ( var i = 0; i < keys.length; i++ ){
        if (!robots[keys[i]]){
          robots[keys[i]] = buildRobot(storeState.gameData.robots[keys[i]])
        }

      }
      // there's no reason for the storeState to have a "position" property, just X, Y, Z
    // if the store has robots, AND our array has them, then we need to update their position
    }
    else if (Object.keys(store.getState().gameData.robots).length ){
      var storeState = store.getState().gameData.robots
      for (var key in storeState){
        // console.log(robots[key].position.x,robots[key].position.z)
        robots[key].position.x = storeState[key].x
        robots[key].position.y = storeState[key].y
        robots[key].position.z = storeState[key].z
        robots[key].rotation.y = storeState[key].theta
      }
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
