import * as THREE from '../three/build/three.module.js';
import { TrackballControls } from '../three/examples/jsm/controls/TrackballControls.js';// Scene
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

camera.position.z = 10;
camera.position.y = 1;

var actualPos=0;
var nbModel = 0;

let measure = new THREE.Vector3();

var boundingBox;
var size;

let listModel = new Array();
var bus = undefined;
const gltfLoader = new GLTFLoader();



//console.log(listModel[0].object.geometry.parameters);
var lastbox = undefined

async function LoadModel(path, listModel){
	await gltfLoader.loadAsync(
		// resource URL
		path,
		// called when the resource is loaded
		
		// called while loading is progressing
		function ( xhr ) {
	
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	
		}
		// called when loading has errors
		
	).then(
		function ( gltf ) {
			listModel.push(gltf.scene)
			scene.add(gltf.scene)
			var box = new THREE.Box3().setFromObject( gltf.scene );
			(gltf.scene).translateX(actualPos+ Math.abs(box.min.x))
			actualPos += Math.abs(box.max.x-box.min.x) + 1 

			//gltf.animations; // Array<THREE.AnimationClip>
			gltf.scene; // THREE.Group
			gltf.scenes; // Array<THREE.Group>
			gltf.cameras; // Array<THREE.Camera>
			gltf.asset; // Object
			nbModel = nbModel + 1;
	}).catch(
		function ( error ) {
			console.log( 'An error happened' );
		}
	);
}

function render() {
	console.log("test")
	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( listModel,true);

	console.log(intersects[0])
	//console.log(intersects)
	checkParentInList(intersects[0])


}

function checkParentInList(objchild){
	if(objchild === undefined)
		return
	var current = objchild.object
	while(current.parent.parent!==null){
		current = current.parent
	}
	console.log(current)
	console.log(listModel.indexOf(current))
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}



window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener('click',render)
window.requestAnimationFrame(render);


//Charge le fichier json et appelle loadAll pour charger les modèles
fetch("./modelList.json")
.then(response => {
   return response.json();
})
.then(data => LoadAll(data))
.catch((error => {console.error(error)}))

//Fonction pour le foreach asynchrone
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function LoadAll(data){
	//console.log(data)
	await asyncForEach(data, async element => {
		await LoadModel(element.path, listModel);
		console.log(element);
	});

	console.log("test");
	console.log(actualPos)
	lastbox = new THREE.Box3().setFromObject( listModel[nbModel-1] );
	console.log("Last : "+lastbox.max.x)
	console.log(listModel)
	console.log(scene.children)
}

var slider = document.getElementById("slider");
slider.value = 0;
slider.addEventListener("input", moveCamera);

function moveCamera(e){
	var target = (e.target) ? e.target : e.srcElement;
	camera.position.x = (target.value/10) * lastbox.max.x
}

const animate = function () {

	requestAnimationFrame(animate);
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	//bus.rotation.y += 0.001;

	renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})