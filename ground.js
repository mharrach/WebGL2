class Ground {
    constructor(pos3d, width, length) {
        this.pos3d = pos3d;
        this.width = width;
        this.length = length;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
        this.colorsArray = [];
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var w = this.width;
            var l = this.length;
            var colors = [];
            var normals = [];
            var vertices = [];
            var startx, endx;
            var starty, endy;
            var startz, endz;

            // Creating x lines
            for (let i = -l / 2; i <= l / 2; i += 0.1) {
                startx = new Point(-w / 2, i, 0);
                endx = new Point(w / 2, i, 0);
                this.pointsArray.push(startx, endx);
                this.colorsArray.push(new Color(1, 1, 1, 1), new Color(1, 1, 1, 1));
            }
            startx = new Point(-w / 2, 0, 0);
            endx = new Point(w / 2, 0, 0);
            this.pointsArray.push(startx, endx);
            this.colorsArray.push(new Color(1, 0, 0, 1), new Color(1, 0, 0, 1));

            // Creating y lines
            for (let j = -w / 2; j <= w / 2; j += 0.1) {
                starty = new Point(j, -l / 2, 0);
                endy = new Point(j, l / 2, 0);
                this.pointsArray.push(starty, endy);
                this.colorsArray.push(new Color(1, 1, 1, 1), new Color(1, 1, 1, 1));
            }
            starty = new Point(0, -l / 2, 0);
            endy = new Point(0, l / 2, 0);
            this.pointsArray.push(starty, endy);
            this.colorsArray.push(new Color(0, 1, 0, 1), new Color(0, 1, 0, 1));

            // Adding z-axis
            startz = new Point(0, 0, 0);
            endz = new Point(0, 0, 0.5);
            this.pointsArray.push(startz, endz);
            this.colorsArray.push(new Color(0, 0, 1, 1), new Color(0, 0, 1, 1));

            for (let a = 0; a < this.pointsArray.length; a++) {
                const element = this.pointsArray[a];
                vertices.push(element.x, element.y, element.z);
            }

            for (let b = 0; b < this.colorsArray.length; b++) {
                const element = this.colorsArray[b];
                colors.push(element.r, element.g, element.b, element.alpha);
            }

            for (let c = 0; c < this.normalsArray.length; c++) {
                const element = this.normalsArray[c];
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

            // Normals buffer
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
        gl.disableVertexAttribArray(normal); // disable bcos we have no nornals for lines.

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, this.pos3d);

        var hasNormal_loc = gl.getUniformLocation(shaderProgram, "u_hasNormals");
        gl.uniform1i(hasNormal_loc, false);

        var vertex_buffer = this._getVbo(gl).position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        //var normal_buffer = this._getVbo(gl).normal;
        //gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
        //gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);


        gl.drawArrays(gl.LINES, 0, this.vertexCount);

    }
}