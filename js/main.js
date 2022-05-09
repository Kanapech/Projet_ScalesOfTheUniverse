import * as THREE from '../three/build/three.module.js';
import * as Loader from './Loader.js'

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const scene = new THREE.Scene();
scene.background = new THREE.Color(1,0.7,0.7)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

camera.position.z = 30;
camera.position.y = 5;

var actualPos= new Array()
actualPos.push(0)

var data;

let listModel = new Array();

var currentbox = undefined


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
		camera.position.y -= 5
	}
	else if(descDisplay.classList.contains("active")){
		closeDesc();
	}
}

function closeDesc() {
	camera.position.y = 5
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


//Charge le fichier json, trie par taille et appelle loadAll pour charger les modèles
fetch("./modelList.json")
.then(response => {
   return response.json();
})
.then(json => {
	data = json.sort(function(a, b){
		return a.size-b.size;
		});
	LoadAll(data)
	})
.catch((error => {console.error(error)}))

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
	});

	console.log(actualPos)
	
	console.log("Last : "+ currentbox.max.x)
	//console.log(listModel)
}

var slider = document.getElementById("slider");
slider.value = 0;
slider.addEventListener("input", moveCamera);
window.addEventListener("wheel", moveSlider);

//Slide when mouse scroll
function moveSlider(e){
	if (e.deltaY < 0){
		slider.value -= 0.2;
	}else{
		slider.valueAsNumber += 0.2;
	}

	slider.dispatchEvent(new Event('input'));
}

function moveCamera(e){
	var target = (e.target) ? e.target : e.srcElement;
	camera.position.x = (target.value/10) * currentbox.max.x
}

const animate = function () {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

animate();

//Auto resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})