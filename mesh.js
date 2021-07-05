class Mesh {
    constructor(pos3d, pointsArray, colorsArray, normalsArray) {
        this.pos3d = pos3d;
        this.vbo = undefined;
        this.pointsArray = pointsArray;
        this.colorsArray = colorsArray;
        this.normalsArray = normalsArray;
    }
    getVbo(gl) {
        var vertices = [];
        var colors = [];
        var normals = [];

        if (!this.vbo) {

            for (let i = 0; i < this.pointsArray.length; i++) {
                const element = this.pointsArray[i];
                vertices.push(element.x, element.y, element.z);
            }

            for (let j = 0; j < this.colorsArray.length; j++) {
                const element = this.colorsArray[j];
                colors.push(element.r, element.g, element.b, element.alpha);
            }

            for (let k = 0; k < this.normalsArray.length; k++) {
                const element = this.normalsArray[k];
                normals.push(element.x, element.y, element.z);
            }

            this.vertexCount = vertices.length / 3;

            var vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo = vertex_buffer;

            var color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.colorsVbo = color_buffer;

            var normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.normalVbo = normal_buffer;
        }

        return { position: this.vbo, color: this.colorsVbo, normal: this.normalVbo };
    }
    render(gl, shaderProgram) {

        var coord = gl.getAttribLocation(shaderProgram, "positions");
        gl.enableVertexAttribArray(coord);

        var color = gl.getAttribLocation(shaderProgram, "colors");
        gl.enableVertexAttribArray(color);

        var normal = gl.getAttribLocation(shaderProgram, "normals");
        gl.enableVertexAttribArray(normal);

        var hasNormal_loc = gl.getUniformLocation(shaderProgram, "u_hasNormals");
        gl.uniform1i(hasNormal_loc, true);

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, this.pos3d);

        var vertex_buffer = this.getVbo(gl).position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this.getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        var normal_buffer = this.getVbo(gl).normal;
        gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
        gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

    }
    setColorsVbo(gl, newColors) {
        gl.deleteBuffer(this.colorVbo);

        var pts = this.vertexCount;
        var colors = [];
        for (let i = 0; i < pts; i++) {
            colors.push(newColors[0], newColors[1], newColors[2], 1);
        }

        var color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.colorsVbo = color_buffer;
    }
    deleteVbo() {
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.normalVbo);
        gl.deleteBuffer(this.colorVbo);
    }
}