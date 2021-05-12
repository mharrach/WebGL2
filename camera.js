class Camera {
    constructor(position, direction, up, fovyRad) {
        this.position = position;
        this.direction = direction;
        this.up = up;
        this.fovyRad = fovyRad;
    }
    _getPosition() {
        return this.position;
    }
    _getDirection() {
        return this.direction;
    }
    _getUp() {
        return this.up;
    }
    _getFovy() {
        return this.fovyRad;
    }
    _getRight() {
        var camDir = glMatrix.vec3.fromValues(this.direction[0], this.direction[1], this.direction[2]);
        var camUp = glMatrix.vec3.fromValues(this.up[0], this.up[1], this.up[2]);
        var camRight = glMatrix.vec3.create();
        camRight = glMatrix.vec3.cross(camRight, camDir, camUp);
        return camRight;
    }
}