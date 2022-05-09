import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader, SpriteMaterial, Sprite, Box3, Vector3, LoadingManager } from '../three/build/three.module.js';

const manager = new LoadingManager();
const gltfLoader = new GLTFLoader(manager);
const objLoader = new OBJLoader(manager);
const progressDiv = document.getElementById("progressDiv");
const loadBar = document.getElementById("loadBar");
const fakeRequestURL = '[[my-fake-request-232932929]]';

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    loadBar.value = itemsLoaded / itemsTotal*100;
};

manager.onLoad = function(){
    progressDiv.style.opacity = "0"
    progressDiv.style.visibility = "hidden"
}

export async function LoadAll(data,camera,scene,listModel,actualPos,center,distance){
    let currentbox;
    let distance2;
    manager.itemStart( fakeRequestURL );

    await asyncForEach(data, async element => {
        await LoadModel(scene, element.path, element.size, listModel, actualPos);
        currentbox = new Box3().setFromObject( listModel[listModel.length - 1])
    });
    manager.itemEnd( fakeRequestURL );
    let size = new Vector3()
    //Initialise la caméra centrée sur l'objet 0
	var box0 = new Box3().setFromObject( listModel[0] )
    box0.getCenter(center);
	box0.getSize(size);
    distance2 = Math.abs( size.y / Math.sin( camera.fov * ( Math.PI / 180 ) / 2) )
	camera.position.set(box0.getCenter(new Vector3).x, 
	box0.getCenter(new Vector3).y, 
	distance2)
    distance[0]=distance2;

	currentbox.getSize(size)
	distance = Math.abs( size.y / Math.sin( camera.fov * ( Math.PI / 180 ) / 2 ) );
	camera.far = distance;
	camera.updateProjectionMatrix();
    
    
    /*return new Vector3(box0.getCenter(new Vector3).x, 
	box0.getCenter(new Vector3).y, 
	Math.abs( size.y / Math.sin( camera.fov * ( Math.PI / 180 ) / 2) ))*/
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export async function LoadModel(scene, path, size, listModel, actualPos){
    let splited = path.split(".")
    switch(splited[splited.length - 1]){
        case 'obj':
            await LoadModelOBJ(scene, path, size, listModel, actualPos)
            break;
        case 'glb':
            await LoadModelGLTF(scene, path, size, listModel,actualPos)
            break;
        case 'gltf':
            await LoadModelGLTF(scene, path, size, listModel, actualPos)
            break;
        case 'png':
            await LoadImage(scene, path, size, listModel, actualPos)
            break;
        case 'jpg':
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
            box.getSize(bbSize);
            

            var ratio = bbSize.y/size;

            gltf.scene.scale.set(1/ratio, 1/ratio, 1/ratio)

            box = new Box3().setFromObject( gltf.scene );
            box.getSize(bbSize);

            (gltf.scene).translateY(-box.min.y);
            (gltf.scene).translateZ(box.min.z);
            (gltf.scene).translateX(actualPos[0]+ Math.abs(box.min.x))

            gltf.scene.traverse( function( node ) {

                if ( node.isMesh ) { 
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.geometry.computeVertexNormals();
                }
        
            } );

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
            box.getSize(bbSize);

            var ratio = bbSize.y/size;

            obj.scale.set(1/ratio, 1/ratio, 1/ratio)
            
            box = new Box3().setFromObject( obj );
            box.getSize(bbSize);

            (obj).translateY(-box.min.y);
            (obj).translateZ(box.min.z);
            (obj).translateX(actualPos[0]+ Math.abs(box.min.x))

            obj.castShadow = true;
            obj.receiveShadow = true;
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
    box.getSize(bbSize);

    var ratio = bbSize.y/size;

    sprite.scale.set(1/ratio, 1/ratio)
    
    box = new Box3().setFromObject( sprite );
    box.getSize(bbSize);

    sprite.castShadow = true;
    sprite.receiveShadow = true;
    scene.add( sprite );

    (sprite).translateY(-box.min.y);
    (sprite).translateZ(box.min.z);
    (sprite).translateX(actualPos[0]+ Math.abs(box.min.x))
    actualPos[0] += Math.abs(box.max.x-box.min.x)
}