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

export const init = () => {
    Window.direction = true
    camera.position.set(700, 200, -500);

    var loader = new THREE.JSONLoader()
    var robotModel = loader.parse(Window.robotjelly);

    renderer.setPixelRatio(window.devicePixelRatio);

    var container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    var robot = new THREE.Mesh(robotModel.geometry, robotModel.materials[0])

    robot.position.set(150, 150, 800);
    robot.scale.set(40, 40, 40);
    console.log("goodrobot", robot)

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);





    var stats;
    var clock = new THREE.Clock();



    // CAMERA



    // SCENE



    // CONTROLS

    var controls = new OrbitControls(camera);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = false;

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

    // RENDERER



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

    scene.add(robot);
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    //
    window.addEventListener('resize', onWindowResize, false);
    // animate(renderer, scene, camera)
    console.log("secondrobot", robot)
    return robot
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}



export const animate = (robotTwo) => {
    console.log("pane", Window.direction)
    if (Window.robot) {
        if (store.getState().position.x < 200 && Window.direction === true) {
            Window.robot.moveX();
            if (store.getState().position.x > 180) {
                robotTwo.rotation.y += Math.PI
                Window.direction = false
            }
        } else {
            if (store.getState().position.x < 20) {
                robotTwo.rotation.y += (Math.PI/2)
                Window.direction = true
            }
            Window.robot.moveMinusX()
        }
        // console.log("store.getstate",store.getState())
        // console.log("secondRobotTwo",robotTwo)
        console.log("pos", store.getState().position.x)
        robotTwo.position.x = store.getState().position.x
    }


    requestAnimationFrame(animate.bind(this, robotTwo));
    // window.robot.rotation.x += 0.1
    // requestAnimationFrame( render )
    // if (window.direction){
    //   window.robot.position.x += window.direction[0]/10
    //   window.robot.position.y += window.direction[1]/10
    //   window.robot.position.z += window.direction[2]/10
    // //
    // }
    renderer.render(scene, camera);
}
