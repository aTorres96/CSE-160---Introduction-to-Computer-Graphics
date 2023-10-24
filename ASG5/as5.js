import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {GUI} from './dat.gui/build/dat.gui.module.js';
//console.log("Hello World")
//console.log(THREE); 

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
const gui = new GUI();
const canvas = document.querySelector('#c');
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 9000);
camera.position.z = 18;
camera.position.y = 8;
//camera.position.x = 30;
//camera.lookAt(0, 70, 0);

const scene = new THREE.Scene();
{
  const near = 10;
  const far = 500;
  const color = 0xB97A20;
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color(color);
}


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();

//SPACE
{
const loader = new THREE.CubeTextureLoader();
const space = loader.load([
    './dark-s_px.jpg',
    './dark-s_nx.jpg',
    './dark-s_py.jpg',
    './dark-s_ny.jpg',
    './dark-s_pz.jpg',
    './dark-s_nz.jpg',
]);
scene.background = space;
}

//mountains
{
    const widthSeg = 1024;
    const heightSeg = 1024;
    const mountains = new THREE.PlaneGeometry(1000, 1000, widthSeg, heightSeg);
    const heightMap = loader.load('./mountain_map/height_map.png')
    const disMap = new THREE.TextureLoader().load('./desertTexSq.jpg');
    
    //disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    //disMap.repeat.set(10, 10);
    
    const groundMat = new THREE.MeshStandardMaterial ({
        color: 0xFFFFFF,
        //wireframe: true,
        map: disMap,
        side: THREE.DoubleSide,
        displacementMap: heightMap,
        displacementScale: 50,
    });
    
    const groundMesh = new THREE.Mesh(mountains, groundMat);
    groundMesh.receiveShadow = true;
    groundMesh.castShadow = true;
    groundMesh.position.set(0, 20, 0);
    groundMesh.rotation.x = Math.PI/2;
    scene.add(groundMesh);
}

//Eagle 5
{
  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();
  mtlLoader.load('./spaceballs-rv/spaceballM.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./spaceballs-rv/spaceball.obj', (root) => {
      root.castShadow = true;
      root.receiveShadow = true;
      root.position.x = 8;
      root.position.y = 6.5;
      root.position.z = 2;
    const lightX = root.position.x;
    const lightY = root.position.y;
    const lightZ = root.position.z;
          //root.rotation.x = 3*Math.PI/2;
      scene.add(root);
    //Eagle Headlights
    const color = 0xFFFFFF;
    const intensity = 1;
    const hLightL = new THREE.SpotLight(color, intensity);
    hLightL.castShadow = true;
    hLightL.position.set(lightX+2.4, lightY-.3, lightZ-.05);
    hLightL.target.position.set(lightX+2.6, lightY-.3, lightZ-.05);
    scene.add(hLightL);
    scene.add(hLightL.target);

    const hLightR = new THREE.SpotLight(color, intensity);
    hLightR.position.set(lightX+2.4, lightY-.3, lightZ-1.3);
    hLightR.target.position.set(lightX+2.6, lightY-.3, lightZ-1.3);
    scene.add(hLightR);
    scene.add(hLightR.target);

    });
  });
    
  


}

/*window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
})*/
//box

const geometry = new THREE.BoxGeometry(4, 4, 4);
//const digitalRain = new THREE.MeshBasicMaterial({ map: loader.load('digitalRain.jpg') });
//const skyBoxMats = [  
  //new THREE.MeshBasicMaterial({map: loader.load('spaceB0.jpg'), side: THREE.DoubleSide}),
  //new THREE.MeshBasicMaterial({map: loader.load('spaceB1.jpg'), side: THREE.DoubleSide}),
  //new THREE.MeshBasicMaterial({map: loader.load('spaceB2.jpg'), side: THREE.DoubleSide}),
  //new THREE.MeshBasicMaterial({map: loader.load('spaceB3.jpg'), side: THREE.DoubleSide}),
  //new THREE.MeshBasicMaterial({map: loader.load('spaceB4.jpg'), side: THREE.DoubleSide}),
  //new THREE.MeshBasicMaterial({map: loader.load('spaceB2.jpg'), side: THREE.DoubleSide}),
//];

var boxMat = new THREE.MeshPhongMaterial({map: loader.load('digitalRain.jpg')});
const cube = new THREE.Mesh(geometry, boxMat);
cube.castShadow = true;
cube.position.set(0, 20, -20);
scene.add(cube);


{
    const sphereRadius = 18;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({map: loader.load('spaceBallCityTex.jpg')});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(75, 32, 10);
    mesh.rotation.y = 3*Math.PI/2;
    scene.add(mesh);
}

{
const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  //const loopCounter = 
  for(var i = 0; i <9; i++){
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new THREE.MeshPhongMaterial({map: loader.load('spaceBallCityTex.jpg')});
      //sphereMat.specular = 0xFFFFFF;
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if(i%2 == 0){
        mesh.position.set(-1+3*i, -1+ i/2, -18+i);
          mesh.rotation.y = 3*Math.PI/2;
      scene.add(mesh);
      }
  }
}
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  //const loopCounter = 
  for(var i = 0; i <7; i++){
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({map: loader.load('spaceBallCityTex.jpg')});
  //sphereMat.specular = 0xFFFFFF;
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if(i%2 == 0){
    mesh.position.set(-sphereRadius + 25 + 10*i, sphereRadius + 2 , -12*i);
    //mesh.rotation.y = 3*Math.PI/2;
  //scene.add(mesh);
  }
  else{
    mesh.position.set(-sphereRadius + 25 + 10*i, (sphereRadius + 2 - i), -17*i); 
      }
  mesh.rotation.y = 3*Math.PI/2;
  scene.add(mesh);
  }
}

{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  //const loopCounter = 
  for(var i = 0; i <9; i++){
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new THREE.MeshPhongMaterial({map: loader.load('spaceBallCityTex.jpg')});
      //sphereMat.specular = 0xFFFFFF;
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if(i%2 == 0){
        mesh.position.set(-3+3*i, -5+ i/2, -27-i);
        mesh.rotation.y = 3*Math.PI/2;
      scene.add(mesh);
      }
  }
}

//hemispher light
const skyColor = 0x2B2C5A;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = .4;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

{
  //const shadowTexture = loader.load('three.js-master/examples/textures/')
  //const sphereShadowBases = [];    

  const sphereRadius = 50;
  const sphereWidthDivisions = 64;
  const sphereHeightDivisions = 32;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshBasicMaterial({map: loader.load('moonTex.jpg')});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(50,  400, -750);
  //mesh.rotation.y = Math.PI/4;
  scene.add(mesh);

//moon1
    
    const color = 0x9893db;
    const intensity = .5;
    const light = new THREE.DirectionalLight(color, intensity);
    //const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.near = 0.5;
    light.shadow.far = 3500;

    //gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    
    light.position.set(50, 400, -750);
    light.target.position.set(2, 5, 0);
   // scene.add(cameraHelper);
    scene.add(light);
    scene.add(light.target);
}


{
  //const shadowTexture = loader.load('three.js-master/examples/textures/')
  //const sphereShadowBases = [];    

  const sphereRadius = 50;
  const sphereWidthDivisions = 64;
  const sphereHeightDivisions = 32;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshBasicMaterial({map: loader.load('moonTex.jpg')});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-40,  200, -750);
  mesh.rotation.y = 3*Math.PI/2;
  scene.add(mesh);

//moon2
    
    const color = 0x9893db;
    const intensity = .5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.near = 0.5;
    light.shadow.far = 3500;

    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    
    light.position.set(-40, 200, -750);
    light.target.position.set(2, 5, 0);
    scene.add(light);
    scene.add(light.target);
}

function animate() {
	requestAnimationFrame(animate);
    
    controls.update();

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

animate();
