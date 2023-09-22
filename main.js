import './style.css'
import { animate, inView } from "motion"
import {
  AmbientLight,
  DirectionalLight,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TorusKnotGeometry,
  MeshLambertMaterial,
  Mesh,
  Group} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { NoiseShader } from './noise-shader';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



const brandmarkTag = document.querySelector("section.brandmark");


animate('header', { y:[-100,0],opacity: [0,1] }, { duration: 1, delay: 2.5})

animate('section.brand', { y:[-100,0],opacity: [0,1] }, { duration: 1, delay: 2 })

animate('section.content p, section.content img', {opacity:0} )
inView('section.content',(info) => {
  animate(info.target.querySelectorAll('p,img'), {opacity: 1}, {duration:1, delay:1} )
})

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000,0);
brandmarkTag.appendChild( renderer.domElement );

// Lighting
const ambience = new AmbientLight( 0x404040 );
camera.add( ambience );

const keyLight = new DirectionalLight( 0xffffff, 1 );
keyLight.position.set(-1,1,3)
camera.add( keyLight );

const fillLight = new DirectionalLight( 0xffffff, 0.5);
fillLight.position.set(1,1,3)
camera.add( fillLight );

const backLight = new DirectionalLight( 0xffffff, 1);
backLight.position.set(-1,3,-1)
camera.add( backLight );

scene.add(camera);

/*const geometry = new TorusKnotGeometry( 1, 0.25, 100, 16 ); 
const material = new MeshLambertMaterial( { color: 0x00ff00 } );
const shape = new Mesh( geometry, material );*/

// Object Import
const gltfLoader = new GLTFLoader();
const loadGroup = new Group();
loadGroup.position.y = -10;

const scrollGroup = new Group();
scrollGroup.add(loadGroup)

scene.add( scrollGroup );

gltfLoader.load("allthislogo_x50.glb",(gltf) => {
  loadGroup.add(gltf.scene)
  animate((t)=> { 
    loadGroup.position.y = -10 + 10 *t
  },{duration:2,delay:1})
})




// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.update();


camera.position.z = 5;


// Post Processing
const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const noisePass = new ShaderPass( NoiseShader );
composer.addPass( noisePass );

const outputPass = new OutputPass();
composer.addPass( outputPass );



const render = () => {
  controls.update();

  scrollGroup.rotation.set(0,window.scrollY* 0.001,0);

	requestAnimationFrame( render );
  composer.render();
}

const resizeTheWholeThing = () =>{
  camera.aspect = window.innerWidth  / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
}
render();
window.addEventListener("resize",resizeTheWholeThing);