import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader, SpriteMaterial, Sprite, Box3, Vector3 } from '../three/build/three.module.js';

const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();

export async function LoadModel(scene, path, size, listModel, actualPos){
    let splited = path.split(".")
    console.log(splited[splited.length - 1])
    switch(splited[splited.length - 1]){
        case 'obj':
            await LoadModelOBJ(scene, path, size, listModel, actualPos)
            break;
        case 'glb':
            await LoadModelGLTF(scene, path, size, listModel,actualPos)
            break;
        case 'gltf':
            console.log("go gltf")
            await LoadModelGLTF(scene, path, size, listModel, actualPos)
            break;
        case 'png':
                console.log("go png")
                await LoadImage(scene, path, size, listModel, actualPos)
                break;
        case 'jpg':
                console.log("go jpg")
                await LoadImage(scene, path, size, listModel, actualPos)
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
            console.log(obj.scale)

            var ratio = bbSize.y/size;
            console.log("ratio :"+ratio)

            obj.scale.set(1/ratio, 1/ratio, 1/ratio)
            console.log(obj.scale)
            
            box = new Box3().setFromObject( obj );
            console.log(box.getSize(bbSize));

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

export async function LoadImage(scene, path, size, listModel, actualPos){
    const map = new TextureLoader().load( path );
    const material = new SpriteMaterial( { map: map } );
    const sprite = new Sprite( material );
    listModel.push(sprite);
    var box = new Box3().setFromObject( sprite );
    var bbSize = new Vector3();
    console.log(box.getSize(bbSize));
    console.log(sprite.scale)

    var ratio = bbSize.y/size;
    console.log("ratio :"+ratio)

    sprite.scale.set(1/ratio, 1/ratio)
    console.log(sprite.scale)
    
    box = new Box3().setFromObject( sprite );
    console.log(box.getSize(bbSize));

    scene.add( sprite );

    (sprite).translateY(-box.min.y);
    (sprite).translateX(actualPos[0]+ Math.abs(box.min.x))
    actualPos[0] += Math.abs(box.max.x-box.min.x) + 1
    console.log(box)
}