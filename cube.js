class Cube {
    constructor(pos3d, rgb, dimension) {
        this.pos3d = pos3d;
        this.rgb = rgb;
        this.dimension = dimension;
        this.mesh = undefined;
        this.createMesh();
    }
    createMesh() {
        var l = this.dimension / 2;
        var pointsArray = [];

        var frontRight = new Point2D(l, -l);
        var backRight = new Point2D(l, l);
        var frontLeft = new Point2D(-l, -l);
        var backLeft = new Point2D(-l, l);

        pointsArray.push(frontRight, backRight, backLeft, frontLeft);

        var profile2d = new Profile2D(pointsArray);
        this.mesh = GeometryModeler.extrudeProfile(this.pos3d, this.dimension, profile2d, this.rgb);
    }
    render(gl, shaderProgram) {
        if (this.mesh != undefined) {
            this.mesh.render(gl, shaderProgram);
        }
    }
    getPosition() {
        return this.pos3d;
    }
    addPosition(x, y, z) {
        this.pos3d[0] += x;
        this.pos3d[1] += y;
        this.pos3d[2] += z;
    }
    setPositionX(newPositionX) {
        this.pos3d[0] = newPositionX;
    }
    setPositionY(newPositionY) {
        this.pos3d[1] = newPositionY;
    }
    setPositionZ(newPositionZ) {
        this.pos3d[2] = newPositionZ;
    }
    setColorsVbo(gl, newColors) {
        if (this.mesh != undefined) {
            gl.deleteBuffer(this.mesh.colorVbo);

            var pts = this.nb_sections;
            var colors = [];
            for (let i = 0; i < pts; i++) {
                for (let j = 0; j < 12; j++) {
                    colors.push(newColors[0], newColors[1], newColors[2], 1);
                }
            }

            var color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.mesh.colorsVbo = color_buffer;
        }
    }
    deleteVbo() {
        if (this.mesh != undefined) {
            gl.deleteBuffer(this.mesh.vbo);
            gl.deleteBuffer(this.mesh.normalVbo);
            gl.deleteBuffer(this.mesh.colorVbo);
        }
    }
}