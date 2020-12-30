import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Particle } from './Particle.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,  // Field Of View
    window.innerWidth / window.innerHeight,  // aspect ratio
    0.1, 1000);  // near and far clipping plane


const renderer = new THREE.WebGLRenderer({'antialias': true});
renderer.setSize(3 * window.innerWidth / 4, 3 * window.innerHeight / 4);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00dd00 } );

class PositionGenerator {

    static grid(x_amount, y_amount, z_amount) {
        let allPositions = [];
        let start_x = -x_amount / 2;
        let start_y = -y_amount / 2;
        let start_z = -z_amount / 2;
        for (let x = 0; x < x_amount; x++) {
            for (let y = 0; y < y_amount; y++) {
                for (let z = 0; z < z_amount; z++) {
                    let position = new Vector3();
                    position.x = start_x + x;
                    position.y = start_y + y;
                    position.z = start_z + z;
                    allPositions.push(position);
                }
            }
        }
        return allPositions;
    }

    static random(amount, start_x, start_y, start_z, end_x, end_y, end_z) {
        const allPositions = [];
        for(let i = 0; i < amount; i++) {
            let x = Math.random() * (end_x - start_x);
            let y = Math.random() * (end_y - start_y);
            let z = Math.random() * (end_z - start_z);

            let position = new Vector3();
            position.x = start_x + x;
            position.y = start_y + y;
            position.z = start_z + z;
            allPositions.push(position);
        }
        return allPositions;
    }

}

// const particles = gen_grid_of(smallerGeometry, material, 10, 10, 10);
const positions = PositionGenerator.random(100, -20, -20, -20, 20, 20, 20);

let particles = [];
positions.forEach(position => {
    let particle = new Particle(Math.random(), position, new Vector3());
    particles.push(particle);
});

particles = [new Particle(Math.random(), new Vector3(), new Vector3(0, .05, .05))]

const smallerGeometry = geometry.scale(.3, .3, .3);
particles.forEach(particle => {
    let customMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(particle.mass, 1 - particle.mass, .5)});

    particle.attachMesh(smallerGeometry, customMaterial);
    scene.add(particle.mesh);
})

console.log(scene.children);
// particles.push(new Particle(Math.random(), new Vector3().random(), new Vector3()));
// particles[0].attachMesh(geometry, material);

// console.log(particles)

//// CAMERA SETTINGS
// by default, all objects are at (0, 0, 0)
// therefore we need to move the camera in order to see anything
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;

const gravitational_force = new Vector3(0, -9, 0);
gravitational_force.multiplyScalar(0.0001);
console.log(gravitational_force);

function update() {
    particles.forEach(particle => {
        particle.updateEuler(gravitational_force);
    });

    // for autorotate
    controls.update();
}

// "animate loop" (or "render loop")
function animate() {
    requestAnimationFrame(animate);

    setTimeout(update, 1000);

    renderer.render(scene, camera);
}

animate();
