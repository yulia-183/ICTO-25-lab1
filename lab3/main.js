import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

document.addEventListener("DOMContentLoaded", () => {
  const start = () => {
    // Сцена, камера, рендерер
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Додаємо AR-кнопку
    document.body.appendChild(ARButton.createButton(renderer, {
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.body }
    }));

    // Завантаження текстур
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load("https://threejs.org/examples/textures/wood.jpg");

    // Площина
    const planeTexture = textureLoader.load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg");
    const planeMaterial = new THREE.MeshStandardMaterial({ map: planeTexture });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), planeMaterial);
    plane.rotation.x = -Math.PI / 6; // нахил (30 градусів)
    plane.position.y = -1;
    scene.add(plane);

    // Циліндр (ролик)
    const rollerRadius = 2;
    const rollerGeometry = new THREE.CylinderGeometry(rollerRadius, rollerRadius, 4, 32);
    const rollerMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
    const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    roller.rotation.z = Math.PI / 2;
    roller.scale.set(0.2, 0.2, 0.2);
    roller.position.set(0, 0.5, 0);
    scene.add(roller);

    // Стрілки сил
    const createArrow = (start, end, color) => {
      const dir = new THREE.Vector3().subVectors(end, start).normalize();
      const length = start.distanceTo(end);
      return new THREE.ArrowHelper(dir, start, length, color, 0.3, 0.15);
    };

    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 0), 0xffff00)); // N
    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 6.72, -1.056), 0x0000ff)); // Fтяж
    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.8, -3.7), 0xff0000)); // F
    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 4.3), 0xffa500)); // Fтертя

    // Освітлення
    scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(5, 10, 5));
    scene.add(new THREE.AmbientLight(0x4d94ff, 0.5));

    // Текстові мітки
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const createLabel = (text, position, color) => {
        const textGeo = new TextGeometry(text, {
          font,
          size: 0.4,
          height: 0.05
        });
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(textGeo, material);
        mesh.position.copy(position);
        scene.add(mesh);
      };

      createLabel("N", new THREE.Vector3(0, 2.6, 1.5), 0xffff00);
      createLabel("Fтяж", new THREE.Vector3(0, 7.0, -1.0), 0x0000ff);
      createLabel("F", new THREE.Vector3(0, 2.1, -3.5), 0xff0000);
      createLabel("Fтертя", new THREE.Vector3(0.5, -2.8, 4.5), 0xffa500);
    });

    // Анімація
    const rotationSpeed = 0.02;
    const rollingSpeed = rollerRadius * rotationSpeed * roller.scale.x;

    const direction = new THREE.Vector3(0, -Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)).normalize(); // напрям під нахил

    const animate = () => {
      roller.rotation.x += rotationSpeed;

      // котиться вниз по схилу
      roller.position.addScaledVector(direction, rollingSpeed);

      renderer.render(scene, camera);
      renderer.setAnimationLoop(animate);
    };

    animate();

    // Ресайз
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  start();
});
