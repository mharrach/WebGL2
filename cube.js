class Cube {
    constructor(dimension, pos3d, tMat) {
        this.dimension = dimension;
        this.pos3d = pos3d;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
        this.tMat;
    }
    _getVbo(gl) {
        if (!this.vbo) {

            var l = this.dimension / 2;
            var vertices = [];
            var colors = [];

            var frontLeftBottom = new Point(-l, -l, -l); //lfb
            var frontRightBottom = new Point(l, -l, -l); //rfb
            var frontRightTop = new Point(l, -l, l); //rft
            var frontLeftTop = new Point(-l, -l, l); //lft
            var backRightBottom = new Point(l, l, -l); //rbb
            var backLeftBottom = new Point(-l, l, -l); //lbb
            var backRightTop = new Point(l, l, l); //rbt
            var backLeftTop = new Point(-l, l, l); //lbt


            //var pointsArray = [];
            var normals = [];
            // front face.
            this.pointsArray.push(frontLeftBottom, frontRightBottom, frontLeftTop, frontLeftTop, frontRightBottom, frontRightTop);
            var normal1 = ThreeDLib.getNormalVect(frontLeftBottom, frontRightBottom, frontLeftTop);
            var normal2 = ThreeDLib.getNormalVect(frontLeftTop, frontRightBottom, frontRightTop);
            this.normalsArray.push(normal1, normal1, normal1, normal2, normal2, normal2);

            // back face
            this.pointsArray.push(backRightBottom, backLeftBottom, backLeftTop, backRightBottom, backLeftTop, backRightTop);
            var normal3 = ThreeDLib.getNormalVect(backRightBottom, backLeftBottom, backLeftTop);
            var normal4 = ThreeDLib.getNormalVect(backRightBottom, backLeftTop, backRightTop);
            this.normalsArray.push(normal3, normal3, normal3, normal4, normal4, normal4);

            // bottom face
            this.pointsArray.push(frontLeftBottom, backLeftBottom, frontRightBottom, backLeftBottom, backRightBottom, frontRightBottom);
            var normal5 = ThreeDLib.getNormalVect(frontLeftBottom, backLeftBottom, frontRightBottom);
            var normal6 = ThreeDLib.getNormalVect(backLeftBottom, backRightBottom, frontRightBottom);
            this.normalsArray.push(normal5, normal5, normal5, normal6, normal6, normal6);

            // top face
            this.pointsArray.push(frontLeftTop, frontRightTop, backLeftTop, backLeftTop, frontRightTop, backRightTop);
            var normal7 = ThreeDLib.getNormalVect(frontLeftTop, frontRightTop, backLeftTop);
            var normal8 = ThreeDLib.getNormalVect(backLeftTop, frontRightTop, backRightTop);
            this.normalsArray.push(normal7, normal7, normal7, normal8, normal8, normal8);

            // left face
            this.pointsArray.push(backLeftTop, backLeftBottom, frontLeftTop, backLeftBottom, frontLeftBottom, frontLeftTop);
            var normal9 = ThreeDLib.getNormalVect(backLeftTop, backLeftBottom, frontLeftTop);
            var normal10 = ThreeDLib.getNormalVect(backLeftBottom, frontLeftBottom, frontLeftTop);
            this.normalsArray.push(normal9, normal9, normal9, normal10, normal10, normal10);

            // right face
            this.pointsArray.push(frontRightTop, frontRightBottom, backRightBottom, frontRightTop, backRightBottom, backRightTop);
            var normal11 = ThreeDLib.getNormalVect(frontRightTop, frontRightBottom, backRightBottom);
            var normal12 = ThreeDLib.getNormalVect(frontRightTop, backRightBottom, backRightTop);
            this.normalsArray.push(normal11, normal11, normal11, normal12, normal12, normal12);

            for (let m = 0; m < this.normalsArray.length; m++) {
                const element = this.normalsArray[m];
                normals.push(element.x, element.y, element.z);
            }

            for (let n = 0; n < this.pointsArray.length; n++) {
                const element = this.pointsArray[n];
                vertices.push(element.x, element.y, element.z);
            }

            var randomColorR = Math.random();
            var randomColorG = Math.random();
            var randomColorB = Math.random();
            for (let i = 0; i < 36; i += 6) {
                for (let j = 0; j < 6; j++) {
                    colors.push(randomColorR, randomColorG, randomColorB, 1);
                }
            }

            this.vertexCount = vertices.length / 3;
            // Create a new buffer object
            var vertex_buffer = gl.createBuffer();
            // Bind an empty array buffer to it
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            // Pass the vertices data to the buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            // Unbind the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo = vertex_buffer;

            // Create a new color buffer object
            var color_buffer = gl.createBuffer();
            // Bind an empty array buffer to it
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            // Pass the color data to the buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            // Unbind the buffer
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

        for (let k = 0; k < this.pointsArray.length; k++) {
            const element = this.pointsArray[k];
            element.render(gl, shaderProgram);
        }

        var coord = gl.getAttribLocation(shaderProgram, "positions");
        gl.enableVertexAttribArray(coord);

        var color = gl.getAttribLocation(shaderProgram, "colors");
        gl.enableVertexAttribArray(color);

        var normal = gl.getAttribLocation(shaderProgram, "normals");
        gl.enableVertexAttribArray(normal);

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, this.pos3d);

        var vertex_buffer = this._getVbo(gl).position;
        //Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        //point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        var normal_buffer = this._getVbo(gl).normal;
        gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
        gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

        // Draw the cube
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

    }
}