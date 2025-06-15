import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
  camera.position.set(4, 3, 6); // зміщена камера

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // 🎮 КЕРУВАННЯ КАМЕРОЮ
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Текстури
  const textureLoader = new THREE.TextureLoader();
  const woodTexture = textureLoader.load("https://threejs.org/examples/textures/wood.jpg");
  const planeTexture = textureLoader.load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg");

  // Підлога
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.MeshStandardMaterial({ map: planeTexture })
  );
  plane.rotation.x = -Math.PI / 9;
  plane.position.set(0, -1.5, -2);
  scene.add(plane);

  // Циліндр
  const rollerRadius = 2;
  const roller = new THREE.Mesh(
    new THREE.CylinderGeometry(rollerRadius, rollerRadius, 4, 32),
    new THREE.MeshStandardMaterial({ map: woodTexture })
  );
  roller.rotation.z = Math.PI / 2;
  roller.scale.set(0.2, 0.2, 0.2);
  roller.position.set(0, 0.5, 0);
  scene.add(roller);

  // Стрілки
  const createArrow = (start, end, color) => {
    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const length = start.distanceTo(end);
    return new THREE.ArrowHelper(dir, start, length, color, 0.3, 0.15);
  };

  scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 0), 0xffff00)); // N
  scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 6.72, -1.056), 0x0000ff)); // Fтяж
  scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.8, -3.7), 0xff0000)); // F
  scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 4.3), 0xffa500)); // F тертя

  // Освітлення
  scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(5, 10, 5));
  scene.add(new THREE.AmbientLight(0x4d94ff, 0.5));

  // Мітки
  const fontLoader = new FontLoader();
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const createLabel = (text, position, color) => {
      const geometry = new TextGeometry(text, {
        font,
        size: 0.4,
        height: 0.05
      });
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      scene.add(mesh);
    };

    createLabel("N", new THREE.Vector3(0, 2.6, 1.5), 0xffff00);
    createLabel("Fтяж", new THREE.Vector3(0, 7.0, -1.0), 0x0000ff);
    createLabel("F", new THREE.Vector3(0, 2.1, -3.5), 0xff0000);
    createLabel("Fтертя", new THREE.Vector3(0.5, -2.8, 4.5), 0xffa500);
  });

  // Анімація — лише обертання
  const rotationSpeed = 0.02;

  const animate = () => {
    requestAnimationFrame(animate);
    roller.rotation.x += rotationSpeed;
    controls.update(); // оновлення камери
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

