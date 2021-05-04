class HollowCylinder {
    constructor(pos3d, radiusIn, radiusOut, height, nb_sections) {
        this.pos3d = pos3d;
        this.radiusIn = radiusIn;
        this.radiusOut = radiusOut;
        this.height = height;
        this.nb_sections = nb_sections;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
        this.colorsArray = [];
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var h = this.height;
            var r1 = this.radiusIn;
            var r2 = this.radiusOut;
            var pts = this.nb_sections;
            var increAngRad = 2 * Math.PI / pts;
            var colors = [];
            var normals = [];
            var vertices = [];
            var x;
            var y;
            var z = h / 2;

            // Creating the inside Cylinder
            var topPointsArrayIn = [];
            var bottomPointsArrayIn = [];

            var topPointsArrayOut = [];
            var bottomPointsArrayOut = [];

            for (let i = 0; i < pts; i++) {
                x = r1 * Math.cos(increAngRad + i * increAngRad);
                y = r1 * Math.sin(increAngRad + i * increAngRad);
                z = h / 2;

                topPointsArrayIn.push(new Point(x, y, z));
                bottomPointsArrayIn.push(new Point(x, y, -z));
            }

            for (let o = 0; o < pts; o++) {
                x = r2 * Math.cos(increAngRad + o * increAngRad);
                y = r2 * Math.sin(increAngRad + o * increAngRad);
                z = h / 2;

                topPointsArrayOut.push(new Point(x, y, z));
                bottomPointsArrayOut.push(new Point(x, y, -z));
            }

            var r = 1.0;
            var g = 0.5;
            var b = 0.25;
            var color = new Color(r, g, b, 1);

            for (let n = 0; n < pts; n++) {
                var currTopPointIn;
                var currBottomPointIn;
                var nextTopPointIn;
                var nextBottomPointIn;

                var currTopPointOut;
                var currBottomPointOut;
                var nextTopPointOut;
                var nextBottomPointOut;

                currTopPointIn = topPointsArrayIn[n];
                currBottomPointIn = bottomPointsArrayIn[n];

                currTopPointOut = topPointsArrayOut[n];
                currBottomPointOut = bottomPointsArrayOut[n];

                if (n === pts - 1) {
                    nextTopPointIn = topPointsArrayIn[0];
                    nextBottomPointIn = bottomPointsArrayIn[0];

                    nextTopPointOut = topPointsArrayOut[0];
                    nextBottomPointOut = bottomPointsArrayOut[0];
                } else {
                    nextTopPointIn = topPointsArrayIn[n + 1];
                    nextBottomPointIn = bottomPointsArrayIn[n + 1];

                    nextTopPointOut = topPointsArrayOut[n + 1];
                    nextBottomPointOut = bottomPointsArrayOut[n + 1];
                }

                // Creating the inside Cylinder********************************************************************
                this.pointsArray.push(currBottomPointIn, nextBottomPointIn, currTopPointIn);
                var normalVectA = ThreeDLib.getNormalVect(currBottomPointIn, currTopPointIn, nextBottomPointIn);
                this.normalsArray.push(normalVectA, normalVectA, normalVectA);
                this.colorsArray.push(color, color, color);

                this.pointsArray.push(currTopPointIn, nextBottomPointIn, nextTopPointIn);
                var normalVectB = ThreeDLib.getNormalVect(currTopPointIn, nextTopPointIn, nextBottomPointIn);
                this.normalsArray.push(normalVectB, normalVectB, normalVectB);
                this.colorsArray.push(color, color, color);
                // *************************************************************************************************

                // Creating the outside Cylinder********************************************************************
                this.pointsArray.push(currBottomPointOut, nextBottomPointOut, currTopPointOut);
                var normalVectC = ThreeDLib.getNormalVect(currBottomPointOut, nextBottomPointOut, currTopPointOut);
                this.normalsArray.push(normalVectC, normalVectC, normalVectC);
                this.colorsArray.push(color, color, color);

                this.pointsArray.push(currTopPointOut, nextBottomPointOut, nextTopPointOut);
                var normalVectD = ThreeDLib.getNormalVect(currTopPointOut, nextBottomPointOut, nextTopPointOut);
                this.normalsArray.push(normalVectD, normalVectD, normalVectD);
                this.colorsArray.push(color, color, color);
                // *************************************************************************************************

                // Creating the top face****************************************************************************
                this.pointsArray.push(currTopPointIn, currTopPointOut, nextTopPointOut);
                var normalVectE = ThreeDLib.getNormalVect(currTopPointIn, currTopPointOut, nextTopPointOut);
                this.normalsArray.push(normalVectE, normalVectE, normalVectE);
                this.colorsArray.push(color, color, color);

                this.pointsArray.push(currTopPointIn, nextTopPointOut, nextTopPointIn);
                var normalVectF = ThreeDLib.getNormalVect(currTopPointIn, nextTopPointOut, nextTopPointIn);
                this.normalsArray.push(normalVectF, normalVectF, normalVectF);
                this.colorsArray.push(color, color, color);
                // *************************************************************************************************

                // Creating the bottom face*************************************************************************
                this.pointsArray.push(currBottomPointOut, currBottomPointIn, nextBottomPointOut);
                var normalVectG = ThreeDLib.getNormalVect(currBottomPointOut, currBottomPointIn, nextBottomPointOut);
                this.normalsArray.push(normalVectG, normalVectG, normalVectG);
                this.colorsArray.push(color, color, color);

                this.pointsArray.push(nextBottomPointOut, currBottomPointIn, nextBottomPointIn);
                var normalVectH = ThreeDLib.getNormalVect(nextBottomPointOut, currBottomPointIn, nextBottomPointIn);
                this.normalsArray.push(normalVectH, normalVectH, normalVectH);
                this.colorsArray.push(color, color, color);
                // **************************************************************************************************

            }

            for (let j = 0; j < this.pointsArray.length; j++) {
                const element = this.pointsArray[j];
                vertices.push(element.x, element.y, element.z);
            }

            for (let k = 0; k < this.colorsArray.length; k++) {
                const element = this.colorsArray[k];
                colors.push(element.r, element.g, element.b, element.alpha);

            }

            for (let l = 0; l < this.normalsArray.length; l++) {
                const element = this.normalsArray[l];
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