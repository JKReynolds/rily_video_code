import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/Addons.js';
import 'ccapture.js-npmfixed'

let capturing = false

// let capturer = new CCapture({format: 'webm'})

// scene and renderer instantiation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// audio setup
const listener = new THREE.AudioListener();
camera.add(listener)

const sound = new THREE.Audio(listener)
const analyser = new THREE.AudioAnalyser(sound, 32);
const audioLoader = new THREE.AudioLoader();

setTimeout(()=>{
  audioLoader.load('sounds/Black Feathers Track 03.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);  
    sound.play()
  });
}, 3000)


let frequencyArray = Array(16).fill(0)

// capturer.start()

function animate() {
  requestAnimationFrame(animate)
  /**
   * Insert all the funky visual stuff in this loop
   */

  cubes.forEach((cube, i) => {
    pulseCube(cube, i)
    if (i < 4) {
      rotateCube(cube, .01, .01)
    } else if (i < 8) {
      rotateCube(cube, -.01, -.01)
    } else {
      rotateCube(cube, .01, -.01)
    }
  })

  renderer.render(scene, camera);
  frequencyArray = analyser.getFrequencyData()
  // capturer.capture(renderer.domElement)
}

function makeCube(color, mesh=true) {
  const geometry = new THREE.IcosahedronGeometry(1, 1, 1);
  const material = mesh ? new THREE.MeshBasicMaterial({ color: color }) : new THREE.LineBasicMaterial({ color: color })
  const cube = mesh ? new THREE.Mesh(geometry, material) : new THREE.Line(geometry, material);
  return cube
}

function pulseCube(cube, frequencyIndex, direction=null) {
  switch(direction) {
    case "x":
      cube.scale.x = 1 + frequencyArray[frequencyIndex] / 255
      break;
    case "y":
      cube.scale.y = 1 + frequencyArray[frequencyIndex] / 255
      break;
    case "z":
      cube.scale.z = 1 + frequencyArray[frequencyIndex] / 255
      break;
    default:
      cube.scale.x = 1 + frequencyArray[frequencyIndex] / 255
      cube.scale.y = 1 + frequencyArray[frequencyIndex] / 255
      cube.scale.z = 1 + frequencyArray[frequencyIndex] / 255
      break
  }  
}
function rotateCube(cube, x, y) {
  cube.rotation.x += x;
  cube.rotation.y += y;
}

function moveCube(cube, value, startDirection) {  
  cube.position[startDirection] += value
}

let cubes = Array(16).fill().map((e, i) => (
  i < 4 ? makeCube(0xff0000, false) : i < 8 ? makeCube(0xffffff, false) : makeCube(0xff00ff, false)
))

cubes.forEach((cube) => {
  scene.add(cube)
})

camera.position.z = 5;

animate()

window.addEventListener('keyup', (event) => {  
  console.log(event.code)
  switch(event.code) {
    case "ArrowUp":
      sound.setVolume(0.5)
      break;
    case "ArrowDown":
      sound.setVolume(0)
      break;
  }  
})