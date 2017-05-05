var scene = new THREE.Scene();
 var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
 var renderer = new THREE.WebGLRenderer();
 renderer.setSize( window.innerWidth, window.innerHeight );
 
 // console.log('app: ', document.getElementById('app'))
 document.getElementById('threedee').appendChild( renderer.domElement );
 
 var geometry = new THREE.BoxGeometry( 1, 1, 1 );
 var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 var cube = new THREE.Mesh( geometry, material );
 scene.add( cube );
 var robot = window.robot
 console.log(robot)
// var loader = new THREE.JSONLoader();
// loader.load("./Users/jonahlivingston/Desktop/bonescapstone/bones/public/js/robot.json",function ( obj ) {
//      scene.add( obj );
// });

 camera.position.z = 5;
 function render() {
   
 	requestAnimationFrame( render );
   if (window.direction){
    //    console.log(window.direction)
     cube.position.x += window.direction
     console.log(cube.position)
   }
   // camera.lookAt(cube.position);
 	renderer.render( scene, camera );
 }
 render();
