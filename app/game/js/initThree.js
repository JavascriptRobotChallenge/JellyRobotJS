import * as THREE from 'three';
export const OrbitControls = require('three-orbit-controls')(THREE)
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

//ATTACH TO DOM
export var camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
export var scene = new THREE.Scene();
export var renderer = new THREE.WebGLRenderer({
    antialias: true
});

//LOAD ROBOTJELLY MODEL
var loader = new THREE.JSONLoader()
export const robotModel = loader.parse(robotjelly);

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
