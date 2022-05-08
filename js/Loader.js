import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { Box3 } from '../three/build/three.module.js';

const gltfLoader = new GLTFLoader();

export async function LoadModelGLTF(scene,path, listModel,nbModel,actualPos){
    console.log("actual" + actualPos[0])
    await gltfLoader.loadAsync(
        // resource URL
        path,
        function ( xhr ) {
        
             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
        }            
    ).then(
        function ( gltf ) {
            listModel.push(gltf.scene)
            scene.add(gltf.scene)
            var box = new Box3().setFromObject( gltf.scene );
            (gltf.scene).translateX(actualPos[0]+ Math.abs(box.min.x))
            actualPos[0] += Math.abs(box.max.x-box.min.x) + 1
                //gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            nbModel = nbModel + 1;
    }).catch(
        function ( error ) {
            console.log( 'An error happened' );
            console.log(error)
        }
    );
}
