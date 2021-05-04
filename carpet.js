class Carpet {
    constructor(pos3d, width, length, n, m) {
        this.pos3d = pos3d;
        this.width = width;
        this.length = length;
        this.n = n;
        this.m = m;
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
            var nWidth = w / this.n;
            var mLength = l / this.m;
            var colors = [];
            var normals = [];
            var vertices = [];

            // Create empty matrix
            var matrix = new Array(this.m);
            for (var i = 0; i < this.m; i++) {
                matrix[i] = new Array(this.n);
            }

            // Fill the matrix with vertices
            for (let i = 0; i < this.m; i++) {
                for (let j = 0; j < this.n; j++) {
                    var x = (j * nWidth - (w / 2)) * Math.PI * 2;
                    var y = (i * mLength - (l / 2)) * Math.PI * 2;
                    var z = Math.sin(x);
                    matrix[i][j] = new Point(x, y, z);
                }
            }

            for (let i = 0; i < this.m - 1; i++) {
                for (let j = 0; j < this.n - 1; j++) {
                    var p1 = matrix[i][j];
                    var p2 = matrix[i + 1][j];
                    var p3 = matrix[i][j + 1];
                    var p4 = matrix[i + 1][j + 1];

                    var color = new Color(Math.random(), Math.random(), Math.random(), 1);

                    this.pointsArray.push(p3, p1, p2);
                    var normalVectA = ThreeDLib.getNormalVect(p3, p2, p1);
                    this.normalsArray.push(normalVectA, normalVectA, normalVectA);
                    this.colorsArray.push(color, color, color);

                    this.pointsArray.push(p3, p2, p4);
                    var normalVectB = ThreeDLib.getNormalVect(p3, p4, p2);
                    this.normalsArray.push(normalVectB, normalVectB, normalVectB);
                    this.colorsArray.push(color, color, color);
                }
            }

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
        gl.enableVertexAttribArray(normal);

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, this.pos3d);

        var vertex_buffer = this._getVbo(gl).position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        var normal_buffer = this._getVbo(gl).normal;
        gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
        gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

    }
}