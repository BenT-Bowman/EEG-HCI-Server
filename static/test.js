// import * as THREE from 'three';
// import { GLTFLoader } from 'GLTFLoader';

import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.149.0/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
console.log(scene)

const gltfloader = new GLTFLoader();
console.log(gltfloader);