import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;
let model;

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

  Cargar modelo
  const loader = new GLTFLoader();
  loader.load('https://cj31-nub.github.io/visualizerTest/A189-015-A.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1); // Ajusta la escala si es necesario
    model.visible = false;
    scene.add(model);
  });

  // Controlador para colocar el modelo
  controller = renderer.xr.getController(0);
  controller.addEventListener('select', () => {
    if (model) {
      model.position.setFromMatrixPosition(controller.matrixWorld);
      model.visible = true;
    }
  });
  scene.add(controller);

  // Botón personalizado
  document.getElementById('start-ar').addEventListener('click', async () => {
    const sessionInit = { requiredFeatures: ['hit-test'] };
    const session = await navigator.xr.requestSession('immersive-ar', sessionInit);
    renderer.xr.setSession(session);
  });

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
