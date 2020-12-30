import { Mesh } from "three";


export class Particle {
    constructor(mass, initialPosition, initialVelocity) {
        this.mass = mass;
        this.position = initialPosition;
        this.velocity = initialVelocity;

        this.mesh = null;
    }

    attachMesh(geometry, material) {
        this.mesh = new Mesh(geometry, material);
        this.mesh.translateX(this.position.x);
        this.mesh.translateY(this.position.y);
        this.mesh.translateZ(this.position.z);
    }

    updateEuler(force) {
        const acceleration = force; // force.divideScalar(this.mass * 10)

        if (this.mesh != null) {
            this.mesh.translateX(this.velocity.x);
            this.mesh.translateY(this.velocity.y);
            this.mesh.translateZ(this.velocity.z);
        }

        this.position.add(this.velocity);
        this.velocity.add(acceleration);
    }
}
