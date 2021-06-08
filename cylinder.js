class Cylinder {
    constructor(pos3d, radius, height, nb_sections, rgb) {
        this.pos3d = pos3d;
        this.radius = radius;
        this.height = height;
        this.nb_sections = nb_sections;
        this.rgb = rgb;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
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
    _getVbo(gl) {
        if (!this.vbo) {
            var h = this.height;
            var rad = this.radius;
            var pts = this.nb_sections;
            var increAngRad = 2 * Math.PI / pts;
            var colors = [];
            var normals = [];
            var vertices = [];
            var x;
            var y;
            var z = h / 2;

            // Creamos topPoints & bottomPoints arrays.
            var centerTop = new Point(0, 0, z);
            var centerBottom = new Point(0, 0, -z);
            var topPointsArray = [];
            var bottomPointsArray = [];
            var normalsMounaArray = [];
            var topNormal;
            var bottomNormal;

            var normalTop = new Point(0, 0, z);
            var lonTop = normalTop.getLength();
            normalTop.scale(1 / lonTop);
            topNormal = normalTop;

            var normalBottom = new Point(0, 0, -z);
            var lonBottom = normalBottom.getLength();
            normalBottom.scale(1 / lonBottom);
            bottomNormal = normalBottom;

            for (let i = 0; i < pts; i++) {
                x = rad * Math.cos(increAngRad + i * increAngRad);
                y = rad * Math.sin(increAngRad + i * increAngRad);
                z = h / 2;

                topPointsArray.push(new Point(x, y, z));
                bottomPointsArray.push(new Point(x, y, -z));

                var normalMouna = new Point(x, y, 0);
                var lon = normalMouna.getLength();
                normalMouna.scale(1 / lon);
                normalsMounaArray.push(normalMouna);
            }

            var triangles = [];
            var r = this.rgb[0];
            var g = this.rgb[1];
            var b = this.rgb[2];
            /*
                var r = 1.0;
                var g = 0.5;
                var b = 0.25;
            */

            for (let n = 0; n < pts; n++) {
                var currTopPoint;
                var currBottomPoint;
                var nextTopPoint;
                var nextBottomPoint;
                var currNormal;
                var nextNormal;

                currTopPoint = topPointsArray[n];
                currBottomPoint = bottomPointsArray[n];
                currNormal = normalsMounaArray[n];

                if (n === pts - 1) {

                    nextTopPoint = topPointsArray[0];
                    nextBottomPoint = bottomPointsArray[0];
                    nextNormal = normalsMounaArray[0];

                } else {
                    nextTopPoint = topPointsArray[n + 1];
                    nextBottomPoint = bottomPointsArray[n + 1];
                    nextNormal = normalsMounaArray[n + 1];
                }

                //top face triangle
                triangles.push(centerTop, currTopPoint, nextTopPoint);
                //bottom face triangle
                triangles.push(currBottomPoint, centerBottom, nextBottomPoint);

                //first triangle
                triangles.push(currBottomPoint, nextBottomPoint, currTopPoint);
                //second triangle
                triangles.push(currTopPoint, nextBottomPoint, nextTopPoint);

                //normals
                //var normal1 = ThreeDLib.getNormalVect(currBottomPoint, nextBottomPoint, currTopPoint);
                //var normal2 = ThreeDLib.getNormalVect(currTopPoint, nextBottomPoint, nextTopPoint);
                //this.normalsArray.push(normal1, normal1, normal1, normal2, normal2, normal2);

                this.normalsArray.push(topNormal, topNormal, topNormal, bottomNormal, bottomNormal, bottomNormal);
                this.normalsArray.push(currNormal, nextNormal, currNormal, currNormal, nextNormal, nextNormal);

                //colors
                for (let index = 0; index < 12; index++) {
                    colors.push(r, g, b, 1);
                }
            }

            for (let l = 0; l < triangles.length; l++) {
                const element = triangles[l];
                vertices.push(element.x, element.y, element.z);
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

            // Normals buffer
            var normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.normalVbo = normal_buffer;
        }

        return { position: this.vbo, color: this.colorsVbo, normal: this.normalVbo };
    }
    setColorsVbo(gl, newColors) {
        gl.deleteBuffer(this.colorVbo);

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

        this.colorsVbo = color_buffer;
    }
    deleteVbo() {
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.normalVbo);
        gl.deleteBuffer(this.colorVbo);
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