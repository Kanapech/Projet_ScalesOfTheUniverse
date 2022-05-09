import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader, SpriteMaterial, Sprite, Box3, Vector3, LoadingManager } from '../three/build/three.module.js';

const manager = new LoadingManager();
const gltfLoader = new GLTFLoader(manager);
const objLoader = new OBJLoader(manager);
const progressDiv = document.getElementById("progressDiv");
const loadBar = document.getElementById("loadBar");
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    loadBar.value = itemsLoaded / itemsTotal*100;

};

manager.onLoad = function(){
    progressDiv.style.opacity = "0"
    progressDiv.style.visibility = "hidden"
}

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
        path          
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
            (gltf.scene).translateZ(box.min.z);
            (gltf.scene).translateX(actualPos[0]+ Math.abs(box.min.x))

            scene.add(gltf.scene)            
           
            actualPos[0] += Math.abs(box.max.x-box.min.x)
                
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
        path           
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
            (obj).translateZ(box.min.z);
            (obj).translateX(actualPos[0]+ Math.abs(box.min.x))

            scene.add(obj)
            
            actualPos[0] += Math.abs(box.max.x-box.min.x)
        }
    ).catch(
        function ( error ) {
            console.log( 'An error happened' );
            console.log(error)
        }
    );
}

export async function LoadImage(scene, path, size, listModel, actualPos){
    const map = new TextureLoader(manager).load( path );
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
    (sprite).translateZ(box.min.z);
    (sprite).translateX(actualPos[0]+ Math.abs(box.min.x))
    actualPos[0] += Math.abs(box.max.x-box.min.x)
    console.log(box)
}