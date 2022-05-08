import * as THREE from '../three/build/three.module.js';
import { TrackballControls } from '../three/examples/jsm/controls/TrackballControls.js';// Scene
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import * as Loader from './Loader.js'

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

var actualPos= new Array()
actualPos.push(0)
var nbModel = 0;

let measure = new THREE.Vector3();

var boundingBox;
var size;
var data;

let listModel = new Array();
const gltfLoader = new GLTFLoader();

//console.log(listModel[0].object.geometry.parameters);
var lastbox = undefined


function showDesc() {
	var descDisplay = document.getElementById("descDisplay");
	var modelName = document.getElementById("modelName");
	var modelDesc = document.getElementById("modelDesc");
	var descCloseBtn = document.getElementById("descClosebtn");
	descCloseBtn.onclick = closeDesc;

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( listModel, true);
	var clickedObj = checkParentInList(intersects[0]);

	console.log(intersects[0])

	if(clickedObj != undefined){
		closeDesc();
		modelName.innerText = data[clickedObj]["name"]
		modelDesc.innerText = data[clickedObj]["description"]
		descDisplay.classList.add("active")
	}
	else if(descDisplay.classList.contains("active")){
		closeDesc();
	}
}

function closeDesc() {
	descDisplay.classList.remove("active");
}

function checkParentInList(objchild){
	if(objchild === undefined)
		return
	var current = objchild.object
	while(current.parent.parent!==null){
		current = current.parent
	}

	console.log(listModel.indexOf(current))
	return(listModel.indexOf(current))
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}



window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener('click', showDesc)
//window.requestAnimationFrame(render);


//Charge le fichier json et appelle loadAll pour charger les modèles
fetch("./modelList.json")
.then(response => {
   return response.json();
})
.then(json => {
	data = json
	LoadAll(data)})
.catch((error => {console.error(error)}))

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function LoadAll(data){
	//console.log(data)
	await asyncForEach(data, async element => {
		//await LoadModel(element.path, listModel);
		await Loader.LoadModelGLTF(scene,element.path, listModel,nbModel,actualPos);
	});

	console.log("test");
	console.log(actualPos)
	lastbox = new THREE.Box3().setFromObject( listModel[listModel.length - 1] );
	console.log("Last : "+lastbox.max.x)
	console.log(listModel)
	console.log(nbModel)
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