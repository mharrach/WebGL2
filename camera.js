class Camera {
    constructor(position, direction, up, fovyRad) {
        this.position = position;
        this.direction = direction;
        this.up = up;
        this.fovyRad = fovyRad;
    }
    copyFromCamera(camera) {
        this.position[0] = camera.position[0];
        this.position[1] = camera.position[1];
        this.position[2] = camera.position[2];
        this.direction = glMatrix.vec4.fromValues(camera.direction[0], camera.direction[1], camera.direction[2], 1);
        this.up = glMatrix.vec4.fromValues(camera.up[0], camera.up[1], camera.up[2], 1);
        this.camRight = glMatrix.vec4.fromValues(camera.getRight()[0], camera.getRight()[1], camera.getRight()[2], 1);
    }
    getPosition() {
        return this.position;
    }
    getDirection() {
        return this.direction;
    }
    getUp() {
        return this.up;
    }
    getFovy() {
        return this.fovyRad;
    }
    getRight() {
        var camDir = glMatrix.vec3.fromValues(this.direction[0], this.direction[1], this.direction[2]);
        var camUp = glMatrix.vec3.fromValues(this.up[0], this.up[1], this.up[2]);
        var camRight = glMatrix.vec3.create();
        camRight = glMatrix.vec3.cross(camRight, camDir, camUp);
        return camRight;
    }
    setRotation(headingRad, pitchRad, rollRad) {
        var camDir = this.getDirection();
        var camUp = this.getUp();
        var camRight = this.getRight();
        var planeNormal = glMatrix.vec3.fromValues(0, 0, 1);
        // Pitch
        var pitchRotMat = glMatrix.mat4.create();
        var quatPitch = glMatrix.quat.create();
        quatPitch = glMatrix.quat.setAxisAngle(quatPitch, camRight, pitchRad);
        pitchRotMat = glMatrix.mat4.fromQuat(pitchRotMat, quatPitch);
        // Heading
        var headingRotMat = glMatrix.mat4.create();
        var quatHeading = glMatrix.quat.create();
        quatHeading = glMatrix.quat.setAxisAngle(quatHeading, planeNormal, headingRad);
        headingRotMat = glMatrix.mat4.fromQuat(headingRotMat, quatHeading);
        // Roll
        var rollRotMat = glMatrix.mat4.create();
        var quatRoll = glMatrix.quat.create();
        quatRoll = glMatrix.quat.setAxisAngle(quatRoll, camDir, rollRad);
        rollRotMat = glMatrix.mat4.fromQuat(rollRotMat, quatRoll);

        // Combined rotations
        var headingPitchRotMat = glMatrix.mat4.create();
        glMatrix.mat4.multiply(headingPitchRotMat, headingRotMat, pitchRotMat);
        var totalRotMat = glMatrix.mat4.create();
        glMatrix.mat4.multiply(totalRotMat, headingPitchRotMat, rollRotMat);

        // Apply rotation
        glMatrix.vec4.transformMat4(camDir, camDir, totalRotMat);
        glMatrix.vec4.transformMat4(camUp, camUp, totalRotMat);
        glMatrix.vec4.transformMat4(camRight, camRight, totalRotMat);
    }
}