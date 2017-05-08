/******************************************************************************/
//////////////////////     THREE.JS - Variables     ////////////////////////////
/******************************************************************************/
// get the DOM element to attach to
var container = $('#threedee');
				var width = container.width();
			 var height = container.height();
// set the camera atributtes
 	 var fielofview = 75;
	var aspectratio = width / height;
				 var near = 0.1;
				  var far = 1000;
			 var camera = new THREE.PerspectiveCamera( fielofview, aspectratio, near, far );
//create a WebGL renderer, and a scene
		 var renderer = new THREE.WebGLRenderer();
		 		var scene = new THREE.Scene();

//append renderer to the container element
renderer.setSize( width, height );
container.append(renderer.domElement);

/*/////////////////////     THREE JS - Objects     ///////////////////////////*/

// create a point light
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(2, 5, 10);
scene.add(pointLight);

var stoneMaterial = new THREE.MeshLambertMaterial( { color: 0x555555 } );
var stoneMesh = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ), stoneMaterial );
//stoneMesh.position.set(0, 1, -2);
scene.add( stoneMesh );

var objMaterial = new THREE.MeshNormalMaterial();
var mesh = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), objMaterial );
scene.add( mesh );
// chase camera
mesh.add( camera );
camera.position.set(0,2,5);

var groundMaterial =  new THREE.MeshLambertMaterial( { color: 0x555599 } );
var groundMesh = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), groundMaterial );
groundMesh.rotation.x = -Math.PI / 2;
scene.add( groundMesh );

var grid = new THREE.GridHelper(100, 10);
scene.add(grid);

/******************************************************************************/
///////////////////////     CANNON JS - Variables     //////////////////////////
/******************************************************************************/
var world = new CANNON.World();
world.gravity.set(0,0,0);

world.broadphase = new CANNON.NaiveBroadphase(); // Detect coilliding objects
world.solver.iterations = 5; // collision detection sampling rate

var timeStep = 1.0 / 60.0; // seconds

var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );  //only for debugging

/*/////////////////////     CANNON JS - Objects     //////////////////////////*/

var stoneShape = new CANNON.Box(new CANNON.Vec3(1,1,1));
var stoneBody = new CANNON.Body({ mass: 0 });
	stoneBody.addShape(stoneShape);
	stoneBody.position.set(0,1,-4);
	world.addBody(stoneBody);

  var loader = new THREE.JSONLoader()
  var robotModel = loader.parse(Window.robotjelly);

  var ThreeRobot = new THREE.Mesh(robotModel.geometry, robotModel.materials[0])
  ThreeRobot.position.set(0, 2, 0);
  ThreeRobot.scale.set(0.5,0.5, 0.5);
  scene.add(ThreeRobot);
	// find
console.log(robotModel, 'robotModel');
  /*  THIS IS THE ROBOT PHYSICS   */
  var sizeRobot = robotModel.geometry.boundingSphere;

	console.log(sizeRobot, 'sizeModel');
  // var heightRobot = (sizeRobot.max.y - sizeRobot.min.y) * 0.5
  // var widthRobot = (sizeRobot.max.x - sizeRobot.min.x) * 0.5
  // var depthRobot = (sizeRobot.max.z - sizeRobot.min.z) * 0.5
	
  var shape = new CANNON.Sphere(sizeRobot.radius / 3.5);
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape)
  body.position.set(0, 3.5, 0);
  world.addBody(body);


// var shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
// var body = new CANNON.Body({ mass: 1 });
// 	body.addShape(shape);
// 	body.position.set(0,2,0);
// 	world.addBody(body);

var groundShape = new CANNON.Plane();
var groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
world.add(groundBody);

/*////////////////////////////////////////////////////////////////////////////*/
var W, A, S, D, Q, E, Ctrl, Shft, Plus, Minus;
var acceleration, pitchSpeed, rollSpeed, yawSpeed

acceleration = pitchSpeed = rollSpeed = yawSpeed = 0;
var accelerationImpulse, bodyCenter;
function moveObj() {

	if (Plus) { acceleration = -1 }
	if (Minus) { acceleration = 1 }
	if ( Plus || Minus ) {
	var accelerationImpulse = new CANNON.Vec3(0,0,acceleration);
	var accelerationImpulse = body.quaternion.vmult( accelerationImpulse );
	var bodyCenter = new CANNON.Vec3(body.position.x,
																	 body.position.y,
																	 body.position.z );
	body.applyImpulse ( accelerationImpulse, bodyCenter );
	}

	if ( W || S || A || D || Q || E ) {
		if (W) { pitchSpeed = -0.5 }	else if (S) { pitchSpeed = 0.5 } else { pitchSpeed = 0 }
		if (A) { rollSpeed = 0.5 } else if (D) { rollSpeed = -0.5 } else { rollSpeed = 0 }
		if (Q) { yawSpeed = 0.5 } else if (E) { yawSpeed = -0.5 } else { yawSpeed = 0 }

		var directionVector = new CANNON.Vec3(pitchSpeed, yawSpeed, rollSpeed);
		var directionVector = body.quaternion.vmult( directionVector );

		body.angularVelocity.set( directionVector.x, directionVector.y, directionVector.z );
	}

	body.linearDamping = 0.5;
	body.angularDamping = 0.9;
}
/*///////////////////////////////////////////////////////////////////////////*/

var timer;
var fireRate = 500; // milisecs before firing next projectile
var projectileMeshes = []; var projectileBodies = [];

document.addEventListener('keydown', function (e) {
	if (e.keyCode == 16) {
		fire();
		timer = setInterval(function () {
			fire();
		}, fireRate);
	}
}, false);
document.addEventListener('keyup', function (e) {
	if (e.keyCode == 16) {
		clearInterval( timer );
	}
}, false);

function fire() {

	var distance = 1;
	var projectileSpeed = 40;

	var projectileShape = new CANNON.Sphere(0.2);
	var projectileBody = new CANNON.Body({ mass: 1 });
	projectileBody.addShape(projectileShape);
	var projectileMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	var projectileMesh = new THREE.Mesh( new THREE.SphereGeometry(projectileShape.radius), projectileMaterial );

		world.addBody(projectileBody);
		projectileBodies.push(projectileBody);
		scene.add(projectileMesh);
		projectileMeshes.push(projectileMesh);

		var firingDirection = new CANNON.Vec3(0,0,-1);
		var firingDirection = body.quaternion.vmult( firingDirection );

		posX = body.position.x + distance * firingDirection.x;
		posY = body.position.y + distance * firingDirection.y;
		posZ = body.position.z + distance * firingDirection.z;
		projectileBody.position.set( posX, posY, posZ);
		projectileMesh.position.set( posX, posY, posZ);

		projectileBody.velocity.set( firingDirection.x*projectileSpeed, firingDirection.y*projectileSpeed, firingDirection.z*projectileSpeed );

		projectileBody.addEventListener("collide",function(){		//delete the collided projectiles after the impact
			setTimeout(function () {   // wait a few milisec before deletion, to have a hit effect on dynamic objects
				world.removeBody(projectileBody);
				projectileBodies.splice( projectileBodies.length, 1);
				scene.remove(projectileMesh);
				projectileMeshes.splice( projectileMeshes.length, 1);
			}, 5);
    });
}
/*///////////////////////////////////////////////////////////////////////////*/
function updatePhysics() {
    // Step the physics world
    world.step(timeStep);
    // Copy coordinates from Cannon.js to Three.js
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
		stoneMesh.position.copy(stoneBody.position);
    stoneMesh.quaternion.copy(stoneBody.quaternion);

    for (var i = 0; i < projectileBodies.length; i++) {
			projectileMeshes[i].position.copy(projectileBodies[i].position);
			projectileMeshes[i].quaternion.copy(projectileBodies[i].quaternion);
		}
}

export default function render() {

	requestAnimationFrame( render );
  updatePhysics();
	moveObj();

  cannonDebugRenderer.update(); //only for debugging
	renderer.render( scene, camera );
}
// Call renderer (animate)
// render();

/////////////////////////////////////////////////////////////////////////////////////////
// keypress listener
//array for multiple key press
var key = [];

  onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    key[e.keyCode] = e.type == 'keydown';
			// Left( 37) A( 65 )
      if (key[65]){ A=1; } else {	A=0; }
      // Up( 38 ) W( 87 )
      if (key[87]){	W=1; } else {	W=0; }
      // Right( 39 ) D ( 68 )
      if (key[68]){ D=1; } else {	D=0; }
      // Down( 40 ) S ( 83 )
      if (key[83]){	S=1; } else {	S=0; }
			// Q( 81 )
			if (key[81]){	Q=1;	} else {	Q=0;	}
			// E( 69 )
			if (key[69]){	E=1;	} else {	E=0;	}
			// Control( 17 )
			//if (key[17]){	Ctrl=1;	} else {	Ctrl=0; }
			// Shift( 16 )
			//if (key[16]){ Shft=1;	} else { Shft=0; }
			// +( 107 )
			if (key[38]){	Plus=1;	} else {	Plus=0;	}
			// -( 109 )
			if (key[40]){	Minus=1;	} else {	Minus=0;	}
	}
