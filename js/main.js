import * as THREE from '../three/build/three.module.js';
import * as Loader from './Loader.js'
import {OrbitControls} from '../three/examples/jsm/controls/OrbitControls.js'

//Variables
var actualPos= new Array()
actualPos.push(0)
var data;
let listModel = new Array();
var distance = new Array();
distance.push(0);
var center = new THREE.Vector3();
var size = new THREE.Vector3();
var slider = document.getElementById("slider");


//Caméra
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.0001, 1000);
var fov = camera.fov * ( Math.PI / 180 ); 

//Charge le fichier json, trie par taille et appelle loadAll pour charger les modèles
fetch("./modelList.json")
.then(response => {
   return response.json();
})
.then(json => {
	data = json.sort(function(a, b){
		return a.size-b.size;
		});
	slider.setAttribute("max", data.length-1);
	Loader.LoadAll(data,camera,scene,listModel,actualPos,center,distance);
	
	})
.catch((error => {console.error(error)}));



//Raycaster pour le pointage à la souris
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//Création de la scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(1,0.7,0.7)

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//Affichage du renderer dans le HTML
document.body.appendChild(renderer.domElement);

//Lumière
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );


//const controls = new OrbitControls( camera, renderer.domElement );
//controls.update();

// Model Description
function showDesc() {
	var descDisplay = document.getElementById("descDisplay");
	var modelName = document.getElementById("modelName");
	var modelDesc = document.getElementById("modelDesc");
	var descCloseBtn = document.getElementById("descClosebtn");
	descCloseBtn.onclick = closeDesc;

	// Mets à jour le rayon à partir de la caméro et de la souris
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children, true);
	var clickedObj = checkParentInList(intersects[0]);

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

//Retourne l'index de l'objet cliqué dans la liste des modèles
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
	// Calcule la position du pointeur en coordonnées normalisées device (-1 ou 1)
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

//Listeners de la souris
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener('click', showDesc)


async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}


//Listeners pour le slider

slider.value = 0;
slider.addEventListener("input", moveCamera);
window.addEventListener("wheel", moveSlider);

//Slide lors du scroll
function moveSlider(e){
	if (e.deltaY < 0){
		slider.value -= 1;
	}else{
		slider.valueAsNumber += 1;
	}
	slider.dispatchEvent(new Event('input'));
}

function moveCamera(e){
	//var center = new THREE.Vector3();
	//var size = new THREE.Vector3();
	var target = (e.target) ? e.target : e.srcElement;
	if(target.valueAsNumber!=0){
		var box1 = new THREE.Box3().setFromObject( listModel[target.value])
		var box2 = new THREE.Box3().setFromObject( listModel[target.value-1])
		box1 = box1.union(box2)
		box1.getSize(size);
		box1.getCenter(center);
		distance[0] = Math.abs( size.y / Math.sin( fov / 2 ) );
	}
	if(target.valueAsNumber==0){
		var box1 = new THREE.Box3().setFromObject( listModel[0])
		box1.getSize(size);
		box1.getCenter(center);
		distance[0] = Math.abs( size.y / Math.sin( fov / 2 ) );
	}
}

const animate = function () {
	requestAnimationFrame(animate);
	camera.position.lerp(new THREE.Vector3(center.x,center.y,distance[0]),0.05);
	renderer.render(scene, camera);
};

animate();

//Auto resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})