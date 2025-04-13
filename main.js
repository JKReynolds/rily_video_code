import * as THREE from 'three';
import 'ccapture.js-npmfixed'

const USE_CCAPTURE = true
const USE_AUDIO = false
const SONG_PATH = ''

let capturing = USE_CCAPTURE
let capturer = new CCapture({ format: 'webm' })

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
let frequencyArray = Array(16).fill(0)

if (USE_AUDIO) {
  try {
    setTimeout(() => {
      audioLoader.load(SONG_PATH, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play()
      });
    }, 3000)
  } catch (error) {
    console.error(error)
  }
}

function makeShape(shapeType, color, mesh = true) {
  let geometry;
  switch(shapeType) {
    case "icosahedron":
      geometry = new THREE.IcosahedronGeometry(1, 1, 1);
      break;
    case "cube":
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    default:
      break;
  }

  const material = mesh ? new THREE.MeshBasicMaterial({ color: color }) : new THREE.LineBasicMaterial({ color: color })
  const shape = mesh ? new THREE.Mesh(geometry, material) : new THREE.Line(geometry, material);
  return shape
}

function pulseShape(shape, frequencyIndex, direction = null) {
  switch (direction) {
    case "x":
      shape.scale.x = 1 + frequencyArray[frequencyIndex] / 255
      break;
    case "y":
      shape.scale.y = 1 + frequencyArray[frequencyIndex] / 255
      break;
    case "z":
      shape.scale.z = 1 + frequencyArray[frequencyIndex] / 255
      break;
    default:
      shape.scale.x = 1 + frequencyArray[frequencyIndex] / 255
      shape.scale.y = 1 + frequencyArray[frequencyIndex] / 255
      shape.scale.z = 1 + frequencyArray[frequencyIndex] / 255
      break
  }
}

function rotateShape(shape, x, y) {
  shape.rotation.x += x;
  shape.rotation.y += y;
}

function moveShape(shape, value, startDirection) {
  shape.position[startDirection] += value
}

function initializeKeyListeners() {
  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case "ArrowUp":
        sound.setVolume(0.5)
        break;
      case "ArrowDown":
        sound.setVolume(0)
        break;
      case "Space":
        if (USE_CCAPTURE) {
          if (capturing) {
            capturer.stop()
            capturer.save()
            capturer.start()
          }
        }
        break;
    }
  })
}

function animate() {
  requestAnimationFrame(animate)
  /**
   * Insert all the funky visual stuff in this loop
   */

  renderer.render(scene, camera);
  frequencyArray = analyser.getFrequencyData()

  if (capturing) {
    capturer.capture(renderer.domElement)
  }
}

// Initialize shapes etc
let shapes = []

shapes.forEach((shape) => {
  scene.add(shape)
})

camera.position.z = 5;

initializeKeyListeners()

// start animation
animate()

if (USE_CCAPTURE) {
  capturer.start()
}
