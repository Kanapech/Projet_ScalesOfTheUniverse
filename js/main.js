import * as THREE from '../three/build/three.module.js';
import { TrackballControls } from '../three/examples/jsm/controls/TrackballControls.js';// Scene
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

camera.position.z = 10;
camera.position.y = 1;

/*const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);*/

var bus = undefined;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
	// resource URL
	'models/car/bus.glb',
	// called when the resource is loaded
	function ( gltf ) {
        bus = gltf.scene;
		scene.add( bus );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

var slider = document.getElementById("slider");
slider.value = camera.position.z;
slider.addEventListener("input", moveCube);

function moveCube(e){
	var target = (e.target) ? e.target : e.srcElement;
  camera.position.z = target.value;
}

const animate = function () {
requestAnimationFrame(animate);
/*cube.rotation.x += 0.01;
cube.rotation.y += 0.01;*/
bus.rotation.y += 0.001;

renderer.render(scene, camera);
};

animate();