class SceneController {
    constructor(canvasWidth, canvasHeight, camera) {
        this.modelViewMat = undefined;
        this.projMat = undefined;
        this.normalMat = undefined;
        this._tMatRotXZ = undefined;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.camera = camera;
        var position = [0, 0, 0];
        var direction = glMatrix.vec4.fromValues(0, 0, 0, 1);
        var up = glMatrix.vec4.fromValues(0, 0, 0, 1);
        var fovyRad = 0;
        this.startCamera = new Camera(position, direction, up, fovyRad);
        //this.startCamera.copyFromCamera(this.camera); //optional
    }
    _getNormalMat() {
        if (!this.normalMat) {
            this.normalMat = glMatrix.mat4.create();
        }
        return this.normalMat;
    }
    _getModelViewMat() {
        if (!this.modelViewMat) {
            this.modelViewMat = glMatrix.mat4.create();
        }
        return this.modelViewMat;
    }
    _getProjMat() {
        if (!this.projMat) {
            this.projMat = glMatrix.mat4.create();
        }
        return this.projMat;
    }
    _getXZRotMAt() {
        if (!this._tMatRotXZ) {
            this._tMatRotXZ = glMatrix.mat4.create();
        }
        return this._tMatRotXZ;
    }
    setModelViewMat(gl, shaderProgram, outputMatrix, inputMatrix1, inputMatrix2) {
        this.modelViewMat = glMatrix.mat4.multiply(outputMatrix, inputMatrix1, inputMatrix2);
        var umvMat_loc = gl.getUniformLocation(shaderProgram, "mvMat");
        gl.uniformMatrix4fv(umvMat_loc, false, this.modelViewMat);
    }
    setNormalMat(gl, shaderProgram) {
        var normalMat_loc = gl.getUniformLocation(shaderProgram, "normalMat");
        gl.uniformMatrix4fv(normalMat_loc, false, this.normalMat);
    }
    setProjMatOrtho(gl, shaderProgram, range) {
        const w = this.canvasWidth;
        const h = this.canvasHeight;
        var aspectRatio = w / h;
        var left = -range / 2,
            right = range / 2,
            bottom = (-range / 2) / aspectRatio,
            top = (range / 2) / aspectRatio,
            near = -range / 2,
            far = range / 2;
        this.projMat = glMatrix.mat4.ortho(this._getProjMat(), left, right, bottom, top, near, far);
        var uprojMat_loc = gl.getUniformLocation(shaderProgram, "projMat");
        gl.uniformMatrix4fv(uprojMat_loc, false, this.projMat);
    }
    setProjMatPersp(gl, shaderProgram) {
        const w = this.canvasWidth;
        const h = this.canvasHeight;
        var aspectRatio = w / h;

        // projection matrix.
        this.projMat = glMatrix.mat4.perspective(this._getProjMat(), this.camera.fovyRad, aspectRatio, 0.01, 1000);
        var uprojMat_loc = gl.getUniformLocation(shaderProgram, "projMat");
        gl.uniformMatrix4fv(uprojMat_loc, false, this.projMat);

        // modelView matrix.
        var camDir = this.camera.getDirection();
        var camUp = this.camera.getUp();
        var camPos = this.camera.getPosition();
        var dist = 100; // if changed the outcome ramins the same
        var camTarget = [dist * camDir[0], dist * camDir[1], dist * camDir[2]];
        var target = [camPos[0] + camTarget[0], camPos[1] + camTarget[1], camPos[2] + camTarget[2]];
        this.modelViewMat = glMatrix.mat4.lookAt(this.modelViewMat, camPos, target, [camUp[0], camUp[1], camUp[2]]);
        var umvMat_loc = gl.getUniformLocation(shaderProgram, "mvMat");
        gl.uniformMatrix4fv(umvMat_loc, false, this.modelViewMat);
    }
    setRotationMat(rotationAxisChar, rotationAngleRad) {
        var rotationAxis;
        var output = glMatrix.mat4.create();
        if (rotationAxisChar.toUpperCase() === "X") {
            rotationAxis = glMatrix.vec3.fromValues(1, 0, 0);
        } else if (rotationAxisChar.toUpperCase() === "Y") {
            rotationAxis = glMatrix.vec3.fromValues(0, 1, 0);
        } else if (rotationAxisChar.toUpperCase() === "Z") {
            rotationAxis = glMatrix.vec3.fromValues(0, 0, 1);
        } else {
            console.error("Rotation axis incorrect");
        }
        var rotationMatrix = glMatrix.mat4.fromRotation(output, rotationAngleRad, rotationAxis);

        return rotationMatrix;
    }
    setRotationMatXZ(tMatRotX, tMatRotZ) {
        this._tMatRotXZ = glMatrix.mat4.multiply(this._getXZRotMAt(), tMatRotX, tMatRotZ);
        return this._tMatRotXZ;
    }

}