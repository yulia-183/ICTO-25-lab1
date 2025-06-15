import * as THREE from 'three';
import { MindARThree } from 'mindar';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "targets.mind",
			maxTrack: 1,
			uiLoading: "yes",
			uiScanning: "yes",
			uiError: "no"
		});

    		const { renderer, scene, camera } = mindarThree;
   		const anchor = mindarThree.addAnchor(0);
    		const clock = new THREE.Clock();
	
    		const textureLoader = new THREE.TextureLoader();
    		const woodTexture = textureLoader.load("wooden.jpg");

    		// Roller (циліндр)
    		const rollerGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
    		const rollerMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
   		const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    		roller.rotation.z = Math.PI / 2;
		roller.scale.set(0.2, 0.2, 0.2); // x, y, z
		roller.position.set(0, 0.5, 0);
    		anchor.group.add(roller);

		const animateRoller = () => {
      			roller.rotation.x += 0.01;
   		};
		
   		 // Додаємо стрілки
    		const createArrow = (start, end, color) => {
      			const dir = new THREE.Vector3().subVectors(end, start).normalize();
      			const length = start.distanceTo(end);
     			const arrow = new THREE.ArrowHelper(dir, start, length, color, 0.3, 0.15);
      			return arrow;
    		};

    		// Стрілки сил
    		anchor.group.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 0), 0xffff00)); // N
    		anchor.group.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 6.72, -1.056), 0x0000ff)); // Fтяж.
    		anchor.group.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.8, -3.7), 0xff0000)); // F
    		anchor.group.add(createArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -3, 4.3), 0xffa500)); // F тертя

    		// Додати освітлення
    		const light = new THREE.DirectionalLight(0xffffff, 1);
    		light.position.set(5, 10, 5);
    		scene.add(light);

    		const ambient = new THREE.AmbientLight(0x4d94ff, 0.5);
    		scene.add(ambient);

    		// Підлога (площина)
    		const planeTexture = textureLoader.load("https://raw.githubusercontent.com/aframevr/sample-assets/refs/heads/master/assets/images/wood/hardwood2_diffuse.jpg");
    		const plane = new THREE.Mesh(
     			new THREE.PlaneGeometry(15, 15),
      			new THREE.MeshStandardMaterial({ map: planeTexture })
    		);
   		 plane.rotation.x = -Math.PI / 3; // -50 градусів
		 plane.scale.set(0.333, 0.33, 0.333); // x, y, z
    		 anchor.group.add(plane);

    		// Завантаження шрифтів для міток
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
        		anchor.group.add(mesh);
      		};

      		createLabel("N", new THREE.Vector3(0, 2.6, 1.5), 0xffff00);
      		createLabel("F.", new THREE.Vector3(0, 7.0, -1.0), 0x0000ff);
      		createLabel("F", new THREE.Vector3(0, 2.1, -3.5), 0xff0000);
      		createLabel("F", new THREE.Vector3(0.5, -2.8, 4.5), 0xffa500);
    		});

    		await mindarThree.start();

		renderer.setAnimationLoop(() => {
      			animateRoller();
      			renderer.render(scene, camera);
    		});
  	};
  start();
});