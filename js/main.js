import * as THREE from '../three/build/three.module.js';
import * as Loader from './Loader.js'

var actualPos= new Array()
actualPos.push(0)
var data;
let listModel = new Array();
var currentbox;

//Charge le fichier json, trie par taille et appelle loadAll pour charger les modèles
fetch("./modelList.json")
.then(response => {
   return response.json();
})
.then(json => {
	data = json.sort(function(a, b){
		return a.size-b.size;
		});
	slider.setAttribute("max", data.length-1)
	LoadAll(data)
	})
.catch((error => {console.error(error)}))

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const scene = new THREE.Scene();
scene.background = new THREE.Color(1,0.7,0.7)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

/*camera.position.z = 30;
camera.position.y = 5;*/




// Model Description
function showDesc() {
	var descDisplay = document.getElementById("descDisplay");
	var modelName = document.getElementById("modelName");
	var modelDesc = document.getElementById("modelDesc");
	var descCloseBtn = document.getElementById("descClosebtn");
	descCloseBtn.onclick = closeDesc;

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children, true);
	//console.log(intersects[0])
	var clickedObj = checkParentInList(intersects[0]);

	if(clickedObj != undefined){
		closeDesc();
		modelName.innerText = data[clickedObj]["name"]
		modelDesc.innerText = data[clickedObj]["description"]
		descDisplay.classList.add("active")
		//camera.position.y -= 5
	}
	else if(descDisplay.classList.contains("active")){
		closeDesc();
	}
}

function closeDesc() {
	//camera.position.y += 5
	descDisplay.classList.remove("active");
}

//Return index of clicked model in models list
function checkParentInList(objchild){
	if(objchild === undefined)
		return
	var current = objchild.object
	while(current.parent.parent!==null){
		current = current.parent
	}

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

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function LoadAll(data){
	//console.log(data)
	//console.log("Loading all models");
	await asyncForEach(data, async element => {
		await Loader.LoadModel(scene, element.path, element.size, listModel, actualPos);
		currentbox = new THREE.Box3().setFromObject( listModel[listModel.length - 1])
		const box = new THREE.BoxHelper( listModel[listModel.length - 1], 0xffff00 );
		scene.add( box );
	});

	console.log(actualPos)
	console.log("Last : "+ currentbox.max.x)
	console.log("list length :"+listModel.length)

	//initCamera()
	//console.log(listModel)
}

/*function initCamera(){
	var leftX = new THREE.Box3().setFromObject(listModel[0]).max.x
	var rightX = new THREE.Box3().setFromObject(listModel[1]).max.x
	camera.position.x = (rightX + leftX)/2

	var leftY = new THREE.Box3().setFromObject(listModel[0]).max.y
	var rightY = new THREE.Box3().setFromObject(listModel[1]).max.y
	camera.position.y = rightY

	var leftZ = new THREE.Box3().setFromObject(listModel[0]).max.z
	var rightZ = new THREE.Box3().setFromObject(listModel[1]).max.z
	camera.position.z = Math.abs(leftZ-rightZ)

	camera.lookAt(new THREE.Box3().setFromObject(listModel[0]).getCenter(new THREE.Vector3()))
	console.log(camera.position)
}*/

var slider = document.getElementById("slider");
slider.value = 1;
slider.addEventListener("input", moveCamera);
window.addEventListener("wheel", moveSlider);

//Slide when mouse scroll
function moveSlider(e){
	if (e.deltaY < 0){
		slider.value -= 1;
	}else{
		slider.valueAsNumber += 1;
	}

	slider.dispatchEvent(new Event('input'));
}

function moveCamera(e){
	console.log(camera.position)
	var target = (e.target) ? e.target : e.srcElement;
	console.log(target.value)

	var leftX = new THREE.Box3().setFromObject(listModel[target.valueAsNumber-1]).max.x
	var rightX = new THREE.Box3().setFromObject(listModel[target.value]).getCenter(new THREE.Vector3()).x
	camera.position.x = rightX

	var leftY = new THREE.Box3().setFromObject(listModel[target.valueAsNumber-1]).max.y
	var rightY = new THREE.Box3().setFromObject(listModel[target.value]).max.y
	camera.position.y = rightY

	var leftZ = new THREE.Box3().setFromObject(listModel[target.valueAsNumber-1]).max.z
	var rightZ = new THREE.Box3().setFromObject(listModel[target.value]).max.z
	camera.position.z = Math.max(leftZ,rightZ)*11

	camera.lookAt(new THREE.Box3().setFromObject(listModel[target.valueAsNumber-1]).getCenter(new THREE.Vector3()))
}

const animate = function () {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	//camera.position.x += 0.1
};

animate();

//Auto resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})