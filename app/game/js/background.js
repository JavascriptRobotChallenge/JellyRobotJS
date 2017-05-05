// import Detector and OrbitControls
import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE)
let renderer

export const init = ()=>{
	console.log('inside init')

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var container, stats;
	var camera, scene, renderer;

	var clock = new THREE.Clock();

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// CAMERA

	camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.set( 700, 200, - 500 );

	// SCENE

	scene = new THREE.Scene();

	// CONTROLS

	var controls = new OrbitControls( camera );
	controls.maxPolarAngle = 0.9 * Math.PI / 2;
	controls.enableZoom = false;

	// LIGHTS

	var light = new THREE.DirectionalLight( 0xaabbff, 0.3 );
	light.position.x = 300;
	light.position.y = 250;
	light.position.z = -500;
	scene.add( light );

  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

	// SKYDOME

	// var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	// var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
		bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
		offset:		 { type: "f", value: 400 },
		exponent:	 { type: "f", value: 0.6 }
	};
	uniforms.topColor.value.copy( light.color );

	var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		side: THREE.BackSide
	} );

	var sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );

	// RENDERER

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// STATS

	stats = new Stats();
	container.appendChild( stats.dom );

	// MODEL

	var loader = new THREE.JSONLoader();
	loader.load( "obj/lightmap/lightmap.js", function ( geometry, materials ) {

		for ( var i = 0; i < materials.length; i ++ ) {

			materials[ i ].lightMapIntensity = 0.1;

		}

		var mesh = new THREE.Mesh( geometry, materials );

		mesh.scale.multiplyScalar( 100 );
		scene.add( mesh );

	} );

  loader = new THREE.JSONLoader()
  var robotModel = loader.parse( robotjelly );

  var robotMesh = new THREE.Mesh(robotModel.geometry, robotModel.materials[0])
  robotMesh.position.set( 150, 150, 0 );
  robotMesh.scale.set(40,40,40);
  scene.add(robotMesh );
  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);
	//
	window.addEventListener( 'resize', onWindowResize, false );
	animate()
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}



export const animate = ()=> {
	console.log('inside animate')

	requestAnimationFrame( animate );
  // window.robotMesh.rotation.x += 0.1
  // requestAnimationFrame( render )
  // if (window.direction){
  //   window.robotMesh.position.x += window.direction[0]/10
  //   window.robotMesh.position.y += window.direction[1]/10
  //   window.robotMesh.position.z += window.direction[2]/10
  // //
  // }
  renderer.render( scene, camera );
	stats.update();
}
