import * as THREE from '../../../public/three.min.js';
export const OrbitControls = require('three-orbit-controls')(THREE)
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

export const COLORING = {
    'red': 'rgb(181, 0 , 0)',
    'blue': 'rgb(4, 4 , 160)',
    'green': 'rgb(19, 124 , 21)',
    'orange': 'rgb(249, 133 , 0)',
    'pink': 'rgb(242, 130 , 201)',
    'yellow': 'rgb(255, 246 , 0)',
    'purple': 'rgb(85, 15 , 142)',
    'black': 'rgb(33, 33, 33)',
    'white': 'rgb(229, 229 , 229)'
}

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
    var light = new THREE.DirectionalLight(0xaabbff, 1);
    light.position.x = 300;
    light.position.y = 250;
    light.position.z = -500;
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    // NEW SKY
    var skyGeo = new THREE.SphereGeometry(3000, 60, 40);
    var uniforms = {
      texture: { type: 't', value: THREE.ImageUtils.loadTexture('eso0932a.jpg') }
    };

    var skyMat = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      vertexShader:   document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-fragment').textContent
    });

    var skyBox = new THREE.Mesh(skyGeo, skyMat);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 1000.0;
    scene.add(skyBox);
    // STATS
    var stats = new Stats();
    container.appendChild(stats.dom);

    // FLOOR AND BOXES MODEL

    var newMaterials = []
    newMaterials.push(new THREE.MeshPhongMaterial( {color: "rgb(255, 255, 128)" } ));
    newMaterials.push(new THREE.MeshPhongMaterial( {color: "rgb(155, 255, 132)" } ));
    newMaterials.push(new THREE.MeshPhongMaterial( {color: "rgb(153, 204, 255)" } ));


    loader.load("obj/lightmap/lightmap.js", function(geometry, materials) {
        console.log(newMaterials)
        for (var i = 0; i < newMaterials.length; i++) {
            newMaterials[i].lightMapIntensity = 0.3;
        }

        var mesh = new THREE.Mesh(geometry, newMaterials);
        mesh.scale.multiplyScalar(100);
        scene.add(mesh);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
