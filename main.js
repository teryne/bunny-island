import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild( renderer.domElement );

const lightColour = 0xffffff;

const light = new THREE.AmbientLight(lightColour, 0.5);

const keyLight = new THREE.DirectionalLight(lightColour, 2);
keyLight.position.set(50, 100, 50);
keyLight.castShadow = true;
keyLight.shadow.camera.left = -50;
keyLight.shadow.camera.right = 50;
keyLight.shadow.camera.top = 50;
keyLight.shadow.camera.bottom = -50;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 200;

scene.add(light);
scene.add(keyLight);

function createGround(){
  const groundGeometry = new THREE.ConeGeometry(40, 60, 10);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x7ac74f, 
    flatShading: true,
    roughness: 1, 
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = Math.PI;
  ground.position.y = -30;
  ground.receiveShadow = true;
  scene.add(ground);
}

function createWater(){
  const planeGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerWidth, 40, 40);
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00a5cf, 
    side: THREE.DoubleSide, 
    flatShading: true,
    transparent: true,
    opacity: 0.7,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.castShadow = true; 
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -8;
  scene.add(plane);

  const position = plane.geometry.attributes.position;
  const center = new THREE.Vector3(0,0,0);
  let vec3 = new THREE.Vector3();

  function animateWaves() {
    const time = performance.now() * 0.001;
    const waveSize = 2;
    const magnitude = 2;

    for(let i=0, l = position.count; i < l; i++) {
      vec3.fromBufferAttribute(position, i);
      vec3.sub(center);

      const z = Math.sin(vec3.length() /- waveSize + (time)) * magnitude;

      position.setZ(i, z);
    }

    position.needsUpdate = true;

    requestAnimationFrame(animateWaves);
    renderer.render(scene, camera); 
  }

  animateWaves();
}

// function createBamboo(x, y, z) {
//   function createBambooSegment(height, radius, color) {
//     const geometry = new THREE.CylinderGeometry(radius, radius, height, 8);
//     const material = new THREE.MeshStandardMaterial({ color: color });
//     const cylinder = new THREE.Mesh(geometry, material);
//     cylinder.receiveShadow = true;
//     cylinder.castShadow = true; // Enable shadow casting
//     return cylinder;
//   }
  
//   // Create bamboo nodes
//   function createBambooNode(radius, color) {
//     const geometry = new THREE.SphereGeometry(radius, 8, 8);
//     const material = new THREE.MeshStandardMaterial({ color: color });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.receiveShadow = true;
//     sphere.castShadow = true; // Enable shadow casting
//     return sphere;
//   }
  
//   const bambooGroup = new THREE.Group();

//   const segmentHeight = 5;
//   const segmentRadius = 0.4;
//   const nodeRadius = 0.45;
//   const color = 0x57f26e; // Bamboo green color

//   // Create multiple segments with nodes
//   for (let i = 0; i < 6; i++) {
//       const segment = createBambooSegment(segmentHeight, segmentRadius, color);
//       segment.position.y = (i * segmentHeight) - (segmentHeight * 2); // Adjust position

//       bambooGroup.add(segment);

//       // Add node at the top of each segment
//       if (i < 5) { // No node on the last segment
//           const node = createBambooNode(nodeRadius, color);
//           node.position.y = segment.position.y + (segmentHeight / 2); // Position at the center of the segment
//           bambooGroup.add(node);
//       }
//   }

//   bambooGroup.position.set(x, y, z);

//   return bambooGroup;
// }

function createCabin(x, y ,z){
  const textureLoader = new THREE.TextureLoader();

  const brickTexture = textureLoader.load('/brick-texture.jpg');
  const bodyGeometry = new THREE.CylinderGeometry(11, 11, 14, 4);
  const bodyMaterial = new THREE.MeshLambertMaterial({ 
    map: brickTexture,
    // color: 0xffe5ba, 
    flatShading: true 
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;

  
  const roofGeometry = new THREE.ConeGeometry(14, 7, 4);
  const roofMaterial = new THREE.MeshStandardMaterial( { 
    color: 0x942719, 
    flatShading: true 
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = y + 3;
  roof.castShadow = true;
  roof.receiveShadow = true;

  const doorGeometry = new THREE.BoxGeometry(5, 12, 1);
  const doorMaterial = new THREE.MeshStandardMaterial({color: 0xb55b50});
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.receiveShadow = true;
  door.position.set(x + 0.2, -4, z + 10.5)
  const frontWallAngle = Math.PI / 4 ;
  door.rotation.y = frontWallAngle;

  const doorKnobGeometry = new THREE.SphereGeometry(0.4);
  const doorKnobMaterial = new THREE.MeshPhongMaterial( { color: 0xfdc404, shininess: 100});
  const doorKnob = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial);
  doorKnob.castShadow = true;
  doorKnob.receiveShadow = true;
  doorKnob.position.set(x, -2, z + 12);

  const cabin = new THREE.Group();
  cabin.add(body);
  cabin.add(roof);
  cabin.add(door);
  cabin.add(doorKnob);

  cabin.position.set(x, y ,z);

  scene.add(cabin)
}

function createStones(firePosition, radius) {
  const stoneGeometry = new THREE.DodecahedronGeometry(1, 0);
  const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0xb8b8b8 });
  const stones = [];
  
  const numStones = 9; // Number of stones to place around the fire
  for (let i = 0; i < numStones; i++) {
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.castShadow = true;
    stone.receiveShadow = true;
    
    // Calculate the angle for each stone
    const angle = (i / numStones) * Math.PI * 2; // Full circle in radians
    const x = firePosition.x + Math.cos(angle) * radius; // X position based on the angle
    const z = firePosition.z + Math.sin(angle) * radius; // Z position based on the angle
    
    // Position the stone around the fire
    stone.position.set(x, 1, z); // Set height based on fire position
    
    // Randomize rotation and scale for variety
    stone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    stone.scale.set(1 + Math.random(), 1 + Math.random(), 1 + Math.random());
    
    scene.add(stone);
    stones.push(stone);
  }
}


function createPineTree (x, z, height) {
  const trunkGeometry = new THREE.CylinderGeometry(height / 5, height / 5, 10, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 2, z);
  trunk.receiveShadow = true;
  trunk.castShadow = true;

  function createPineFoliage (size){
    const foliageGeometry = new THREE.ConeGeometry(size, 8, 6);
    const foliageMaterial = new THREE.MeshStandardMaterial({color: 0x004b23, flatShading: true});
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.receiveShadow = true;
    foliage.castShadow = true;
    return foliage;
  }

  const pineGroup = new THREE.Group();
  pineGroup.add(trunk);

  for (var i = 0; i < 6; i++) {
    const crown = createPineFoliage(height - (i + 1));

    crown.position.set(x, 8 + 4 * i, z)
    pineGroup.add(crown)
  }

  scene.add(pineGroup)
}

function createFruitTree(x, y, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.8, 1.5, 15, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, y + 5, z);
  trunk.receiveShadow = true;
  trunk.castShadow = true;

  const foliageGeometry = new THREE.TetrahedronGeometry(8, 2);
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0xccff33, flatShading: true });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial)
  foliage.position.set(x, y + 15, z);
  foliage.receiveShadow = true;
  foliage.castShadow = true;

  function createFruit(x, y, z) {
    const fruitGeometry = new THREE.IcosahedronGeometry(1, 0);
    const fruitMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruit.position.set(x, y, z);
    fruit.castShadow = true;
    return fruit;
  }

  const fruits = new THREE.Group();
  const fruitPositions = [
    { x: -5, y: 18, z: -4.5 },
    { x: 0, y: 13, z: -7 },
    { x: 6, y: 17, z: -3 },
    { x: 4, y: 12, z: 5 },
    { x: -2, y: 9, z: -3 },
    { x: -4, y: 14, z: 6 },
    { x: -1, y: 20, z: 4.5 },
  ];

  fruitPositions.forEach(pos => {
    const fruit = createFruit(x + pos.x, y + pos.y, z + pos.z);
    fruits.add(fruit);
  });

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(foliage);
  tree.add(fruits);

  scene.add(tree)
}

function createBunny (x, y, z) {
  function createEar(x, y, z) {
    const earMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    const earGeometry = new THREE.CapsuleGeometry(0.8, 5, 32, 32);
    const ear = new THREE.Mesh(earGeometry, earMaterial);
    ear.castShadow = true;
    ear.receiveShadow = true;
    ear.position.set(x, y, z);
    return ear;
  }

  function createSphere(radius, x, y, z, color) {
    const sphereGeometry = new THREE.SphereGeometry(radius);
    const sphereMaterial = new THREE.MeshStandardMaterial({color});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    sphere.position.set(x, y, z);

    return sphere
  }

  const body = createSphere(4, x, y + 4.2, z, 0xffffff);
  const leftFoot = createSphere(0.8, x + 1, y + 1, z + 2.5, 0xffffff);
  const rightFoot = createSphere(0.8, x + 2.6, y + 1, z + 1.2, 0xffffff);
  const tail = createSphere(1, x - 1, y + 2.2, z - 3.5, 0xffffff);
  const leftEar = createEar(x - 1.2, y + 9, z + 1);
  const rightEar = createEar(x + 1, y + 9, z - 1.5);
  const leftEye = createSphere(0.4, x + 2, y + 6, z + 2.8, 0x000000);
  const rightEye = createSphere(0.4, x + 3.5, y + 6, z + 0.8, 0x000000);
  const nose = createSphere(0.4, x + 3, y + 5, z + 2, 0xffabf1);

  const bunny = new THREE.Group();
  bunny.add(body);
  bunny.add(leftFoot);
  bunny.add(rightFoot);
  bunny.add(tail);
  bunny.add(leftEar);
  bunny.add(rightEar);
  bunny.add(leftEye);
  bunny.add(rightEye);
  bunny.add(nose);

  scene.add(bunny);
}

function createBush (x, y, z, radius){
  const bushGeometry = new THREE.IcosahedronGeometry(radius, 0);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x588157, flatShading: true });
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);

  bush.receiveShadow = true;
  bush.castShadow = true;
  bush.position.set(x, y, z);
  bush.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  
  function createFruit(x, y, z) {
    const fruitGeometry = new THREE.DodecahedronGeometry(0.5, 0);
    const fruitMaterial = new THREE.MeshStandardMaterial({ color: 0xff84b5, flatShading: true });
    const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruit.position.set(x, y, z);
    fruit.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    fruit.castShadow = true;
    return fruit;
  }

  const numberOfFruits = 15;
  for (let i = 0; i < numberOfFruits; i++) {
    // Generate random spherical coordinates
    const theta = Math.random() * Math.PI * 2; // Random angle around the Y-axis
    const phi = Math.acos(2 * Math.random() - 1); // Random angle for elevation

    // Convert spherical coordinates to Cartesian coordinates
    const r = radius * Math.random(); // Random distance from the center
    const xFruit = x + r * Math.sin(phi) * Math.cos(theta);
    const yFruit = y + r * Math.cos(phi);
    const zFruit = z + r * Math.sin(phi) * Math.sin(theta);

    // Create and add the fruit
    const fruit = createFruit(xFruit, yFruit, zFruit);
    scene.add(fruit);
  }

  scene.add(bush);
}

function createFire () {
  const fireGeometry = new THREE.ConeGeometry(3, 4, 10);
  const fireMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff4500,
    emissiveIntensity: 4,
    transparent: true,
    opacity: 0.7,
    roughness: 0.3,   
    flatShading: true
  });
  const fire = new THREE.Mesh(fireGeometry, fireMaterial);
  fire.castShadow = true;
  fire.position.set(15, 3, 15);

  const fireLight = new THREE.PointLight(0xff4500, 1.5, 20);
  fireLight.position.set(0, 5, 0);

  const fireGroup = new THREE.Group();
  fireGroup.add(fire);
  fireGroup.add(fireLight);
  scene.add(fireGroup);
}

function createCloud(x, y, z) {
  const cloudGroup = new THREE.Group();

  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
    transparent: true,
    opacity: 0.8,
  });

  const formCount = 3;
  for (let i = 0; i < formCount; i++) {
    const radius = Math.random() * 1.5 + 1;
    const cloudGeometry = new THREE.TetrahedronGeometry(radius, 4);
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.castShadow = true;

    cloud.position.set(
      x + (Math.random() - 0.5) * 2,
      y + (Math.random() - 0.5) * 1,
      z + (Math.random() - 0.5) * 3
    );
    cloudGroup.add(cloud);
  }

  cloudGroup.scale.set(2, 1.2, 1.5);

  cloudGroup.position.set(x, y, z);
  scene.add(cloudGroup);

  return cloudGroup;
}

function generateClouds(cloudCount) {
  const clouds = [];
  for (let i = 0; i < cloudCount; i++) {
    const x = Math.random() * 30 - 10;
    const y = Math.random() * 15 + 5;
    const z = Math.random() * 20 - 10;
    const cloud = createCloud(x, y, z);
    clouds.push(cloud);
  }
  return clouds;
}

function animateClouds() {
  clouds.forEach((cloud, index) => {
    cloud.position.x -= 0.05;

    // Check if the cloud has gone off screen
    if (cloud.position.x < -50) {
      // Reset position
      cloud.position.x = 50 + Math.random() * 10; // Randomize new x position
      cloud.position.y = Math.random() * 5 + 5;    // Randomize new y position
      cloud.position.z = Math.random() * 20 - 10;  // Randomize new z position
    }
  });

  requestAnimationFrame(animateClouds);
  renderer.render(scene, camera);
}

function createFish(x, y, z) {
  function createBox(size, thickness, x, y, z, color) {
    const boxGeometry = new THREE.BoxGeometry(size, size, thickness);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: color,
      flatShading: true
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(x, y, z);
    return box;
  }

  const body = createBox(4, 1, x, y, z, 0xfb6107);
  const tail = createBox(1.5, 1, x + 2.5, y, z, 0xfb6107);
  const eyeball = createBox(1.8, 1.2, x - 1, y + 1, z, 0xffffff);
  const iris = createBox(1, 1.3, x - 1.3, y + 0.8, z, 0x000000);

  const fish = new THREE.Group();
  fish.add(body);
  fish.add(tail);
  fish.add(eyeball);
  fish.add(iris);

  fish.rotation.y = Math.PI / 4;
  scene.add(fish);
}

const loader = new GLTFLoader();

loader.load(
  'boat.glb',
  function (gltf) {
    const boat = gltf.scene;
    boat.scale.set(9, 16, 10);
    boat.rotation.y = Math.PI / 2 + (Math.PI / 2) ;
    boat.position.set(0, -3.8, 45);
    scene.add(boat);
  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the glTF model:', error);
  }
);

createGround();
createFruitTree(20, 0, -20);
createFruitTree(-12, 1, 29);
createFire();
createStones({ x: 15, y: 3, z: 15 }, 4.2);
createPineTree(-30, -5, 11);
createPineTree(-14, 9, 9);
createPineTree(-10, -2, 5);
createPineTree(-28, 15, 8);
createPineTree(-20, -20, 8);
createPineTree(-10, -15, 5);
createPineTree(10, -25, 6);
createPineTree(-3, -30, 10);
createBunny(8, -0.5, 25);
createCabin(5, 7, -5);
createBush(-20, 2.2, 20, 5.5);
createBush(-22, 2.2, 27, 3);
createBush(1, 2.2, 10, 4);
createBush(-3, 2.2, 4, 2.5);
createBush(-10, 2.2, 16, 6);
createBush(30, 2.2, 2, 4);
createBush(28, 2.2, 10, 3.5);
createWater();
const clouds = generateClouds(5);
animateClouds();
createFish(5, -14, 35);
createFish(0, -21, 33);
createFish(15, -27, 30);

camera.position.set(35, 15, 65);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );