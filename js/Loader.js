import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';
import { Box3 } from '../three/build/three.module.js';
import { Vector3 } from '../three/build/three.module.js';

const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();

export async function LoadModel(scene, path, size, listModel, actualPos){
    let splited = path.split(".")
    console.log(splited[splited.length - 1])
    switch(splited[splited.length - 1]){
        case 'obj':
            await LoadModelOBJ(scene, path, size, listModel,actualPos)
            break;
        case 'glb':
            await LoadModelGLTF(scene, path, size, listModel,actualPos)
            break;
        case 'gltf':
            console.log("go gltf")
            await LoadModelGLTF(scene, path, size, listModel, actualPos)
            break;
    }
}

export async function LoadModelGLTF(scene, path, size, listModel, actualPos){
    await gltfLoader.loadAsync(
        // resource URL
        path,
        function ( xhr ) {
             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }            
    ).then(
        function ( gltf ) {
            listModel.push(gltf.scene)

            var box = new Box3().setFromObject( gltf.scene );
            var bbSize = new Vector3();
            console.log(box.getSize(bbSize));
            console.log(gltf.scene.scale)
            var ratio = bbSize.y/size;
            console.log("ratio :"+ratio)

            gltf.scene.scale.set(1/ratio, 1/ratio, 1/ratio)
            
            console.log(gltf.scene.scale)
            box = new Box3().setFromObject( gltf.scene );
            console.log(box.getSize(bbSize));
            (gltf.scene).translateY(-box.min.y);
            (gltf.scene).translateX(actualPos[0]+ Math.abs(box.min.x))

            scene.add(gltf.scene)            
           
            actualPos[0] += Math.abs(box.max.x-box.min.x) + 1
                
            //gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
        }
    ).catch(
        function ( error ) {
            console.log( 'An error happened' );
            console.log(error)
        }
    );
}

export async function LoadModelOBJ(scene, path, size, listModel, actualPos){
    await objLoader.loadAsync(
        // resource URL
        path,
        function ( xhr ) {
             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }            
    ).then(
        function ( obj ) {
            listModel.push(obj)
            var box = new Box3().setFromObject( obj );
            var bbSize = new Vector3();
            console.log(box.getSize(bbSize));

            var ratio = bbSize.y/size;
            console.log("ratio :"+ratio)

            obj.scale.set(1/ratio, 1/ratio, 1/ratio)
            
            box = new Box3().setFromObject( obj );
            (obj).translateY(-box.min.y);
            (obj).translateX(actualPos[0]+ Math.abs(box.min.x))

            scene.add(obj)
            
            actualPos[0] += Math.abs(box.max.x-box.min.x) + 1
        }
    ).catch(
        function ( error ) {
            console.log( 'An error happened' );
            console.log(error)
        }
    );
}
