import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;

init();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

  const loader = new GLTFLoader();
  loader.load('https://cj31-nub.github.io/visualizerTest/A189-015-A.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1); // Ajusta la escala si es necesario
    model.visible = false;
    scene.add(model);

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => {
      model.position.setFromMatrixPosition(controller.matrixWorld);
      model.visible = true;
    });
    scene.add(controller);
  });

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
``