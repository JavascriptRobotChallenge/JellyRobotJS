// import { logo } from './LEGO';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

// console.log('app: ', document.getElementById('app'))
document.getElementById('threedee').appendChild( renderer.domElement );

// Add the lights
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

var light = new THREE.PointLight( 0xFFFFDD );
light.position.set( -10, 10, 10 );
scene.add( light );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// var loader = new THREE.JSONLoader();
//
// var model = loader.parse( lego );
//
// mesh = new THREE.Mesh( model.geometry,  model.materials   );
// mesh.position.set( -2, -3, 0 );
// mesh.scale.set(0.75,0.75,0.75);
// scene.add( mesh );

var loader = new THREE.JSONLoader();

var model = loader.parse( robotjelly );

model.materials.color = '#f44242'
mesh = new THREE.Mesh(model.geometry, model.materials)
mesh.position.set( -1, -1, 0 );
mesh.scale.set(0.3,0.3,0.3);
scene.add( mesh );

// camera.position.z = 5;

function render() {
  mesh.rotation.x += 0.1
	requestAnimationFrame( render )
  if (window.direction){
    mesh.position.x += window.direction[0]/10
    mesh.position.y += window.direction[1]/10
    mesh.position.z += window.direction[2]/10
  //
  }

  // camera.lookAt(cube.position);
	renderer.render( scene, camera );
}
render();
