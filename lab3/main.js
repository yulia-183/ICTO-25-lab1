import * as THREE from "three";
import {ARButton} from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

document.addEventListener("DOMContentLoaded", () => {
  const start = () => {
    // Створюємо сцену, камеру і рендерер
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera();
	const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);;

    // Завантаження текстури
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load("wooden.jpg");

    // Циліндр (роллер)
    const rollerRadius = 2;  // Радіус циліндра
    const rollerGeometry = new THREE.CylinderGeometry(rollerRadius, rollerRadius, 4, 32);
    const rollerMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
    const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    roller.rotation.z = Math.PI / 2;
    roller.scale.set(0.2, 0.2, 0.2);
    roller.position.set(0, 0.5, 0);
    scene.add(roller);

    // Створюємо стрілки
    const createArrow = (start, end, color) => {
      const dir = new THREE.Vector3().subVectors(end, start).normalize();
      const length = start.distanceTo(end);
      const arrow = new THREE.ArrowHelper(dir, start, length, color, 0.3, 0.15);
      return arrow;
    };

    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 0), 0xffff00)); // N
    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 6.72, -1.056), 0x0000ff)); // Fтяж.
    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.8, -3.7), 0xff0000)); // F
    scene.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 4.3), 0xffa500)); // F тертя

    // Освітлення
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x4d94ff, 0.5);
    scene.add(ambient);

    // Підлога
    const planeTexture = textureLoader.load("https://raw.githubusercontent.com/aframevr/sample-assets/refs/heads/master/assets/images/wood/hardwood2_diffuse.jpg");
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshStandardMaterial({ map: planeTexture })
    );
    plane.rotation.x = -Math.PI / 3;
    plane.scale.set(0.333, 0.33, 0.333);
    scene.add(plane);

    // Завантаження шрифту та додавання міток
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const createLabel = (text, position, color) => {
        const textGeo = new TextGeometry(text, {
          font: font,
          size: 0.4,
          height: 0.05
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(textGeo, textMaterial);
        mesh.position.copy(position);
        scene.add(mesh);
      };

      createLabel("N", new THREE.Vector3(0, 2.6, 1.5), 0xffff00);
      createLabel("F", new THREE.Vector3(0, 7.0, -1.0), 0x0000ff);
      createLabel("F", new THREE.Vector3(0, 2.1, -3.5), 0xff0000);
      createLabel("F", new THREE.Vector3(0.5, -2.8, 4.5), 0xffa500);
    });

    renderer.xr.enabled = true;
    const arButton = ARButton.createButton(renderer,
	{
	optionalFeatures: ["dom-overlay"],
	domOverlay: {root: document.body}
    });

    document.body.appendChild(arButton);

    // Анімація роллера: кут обертання та рух вперед
    const rotationSpeed = 0.01; // радіан за кадр
    const rollingSpeed = rollerRadius * rotationSpeed; // довжина прокатування за кадр

    const animate = () => {
      // Обертання циліндра навколо осі X (ролик крутиться)
      roller.rotation.x += rotationSpeed;

      // Рух циліндра вперед по осі Z (зменшуємо Z, бо вперед)
      roller.position.z += rollingSpeed;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Обробка зміни розміру вікна
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  start();
});
