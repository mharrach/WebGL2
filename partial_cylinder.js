class PartialCylinder {
    constructor(pos3d, radius, height, nb_sections, startAngDeg, endAngDeg) {
        this.pos3d = pos3d;
        this.radius = radius;
        this.height = height;
        this.nb_sections = nb_sections;
        this.startAngDeg = startAngDeg;
        this.endAngDeg = endAngDeg;
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
            var rad = this.radius;
            var pts = this.nb_sections;
            var segments = pts - 1;
            var startAngRad = this.startAngDeg * Math.PI / 180;
            var endAngRad = this.endAngDeg * Math.PI / 180;
            var sweepAngRad = (endAngRad - startAngRad);
            var incAngRad = sweepAngRad / segments;
            var colors = [];
            var normals = [];
            var vertices = [];
            var x;
            var y;
            var z = h / 2;

            // Init
            var centerTop = new Point(0, 0, z);
            var centerBottom = new Point(0, 0, -z);

            var topPointsArray = [];
            var bottomPointsArray = [];

            for (let i = 0; i < pts; i++) {
                x = rad * Math.cos(startAngRad + i * incAngRad);
                y = rad * Math.sin(startAngRad + i * incAngRad);
                z = h / 2;

                topPointsArray.push(new Point(x, y, z));
                bottomPointsArray.push(new Point(x, y, -z));
            }

            var r = 1.0;
            var g = 0.5;
            var b = 0.25;
            var color = new Color(r, g, b, 1);
            var currTopPoint;
            var currBottomPoint;
            var nextTopPoint;
            var nextBottomPoint;

            // Top cap.**************************************************************************
            for (let n = 0; n < topPointsArray.length - 1; n++) {
                currTopPoint = topPointsArray[n];
                nextTopPoint = topPointsArray[n + 1];

                this.pointsArray.push(centerTop, currTopPoint, nextTopPoint);
                var normalVect = ThreeDLib.getNormalVect(centerTop, currTopPoint, nextTopPoint);
                this.normalsArray.push(normalVect, normalVect, normalVect);
                this.colorsArray.push(color, color, color);
            }
            // end--------------------------------------------------------------------------------

            // Bottom cap. ***********************************************************************
            for (let n = 0; n < bottomPointsArray.length - 1; n++) {
                currBottomPoint = bottomPointsArray[n];
                nextBottomPoint = bottomPointsArray[n + 1];

                this.pointsArray.push(centerBottom, nextBottomPoint, currBottomPoint);
                var normalVect = ThreeDLib.getNormalVect(centerBottom, nextBottomPoint, currBottomPoint);
                this.normalsArray.push(normalVect, normalVect, normalVect);
                this.colorsArray.push(color, color, color);
            }
            // end--------------------------------------------------------------------------------

            // body (lateral faces). *************************************************************
            for (let n = 0; n < topPointsArray.length - 1; n++) {
                currTopPoint = topPointsArray[n];
                currBottomPoint = bottomPointsArray[n];
                nextTopPoint = topPointsArray[n + 1];
                nextBottomPoint = bottomPointsArray[n + 1];

                this.pointsArray.push(currTopPoint, currBottomPoint, nextBottomPoint);
                var vectorNormalA = ThreeDLib.getNormalVect(currTopPoint, currBottomPoint, nextBottomPoint);
                this.normalsArray.push(vectorNormalA, vectorNormalA, vectorNormalA);
                this.colorsArray.push(color, color, color);

                this.pointsArray.push(currTopPoint, nextBottomPoint, nextTopPoint);
                var vectorNormalB = ThreeDLib.getNormalVect(currTopPoint, nextBottomPoint, nextTopPoint);
                this.normalsArray.push(vectorNormalB, vectorNormalB, vectorNormalB);
                this.colorsArray.push(color, color, color);
            }
            // end--------------------------------------------------------------------------------

            // start panel. ***********************************************************************
            this.pointsArray.push(centerBottom, bottomPointsArray[0], centerTop);
            var vectorNormalC = ThreeDLib.getNormalVect(centerBottom, bottomPointsArray[0], centerTop);
            this.normalsArray.push(vectorNormalC, vectorNormalC, vectorNormalC);
            this.colorsArray.push(color, color, color);

            this.pointsArray.push(centerTop, bottomPointsArray[0], topPointsArray[0]);
            var vectorNormalD = ThreeDLib.getNormalVect(centerTop, bottomPointsArray[0], topPointsArray[0]);
            this.normalsArray.push(vectorNormalD, vectorNormalD, vectorNormalD);
            this.colorsArray.push(color, color, color);

            // end panel. *************************************************************************
            this.pointsArray.push(topPointsArray[topPointsArray.length - 1], bottomPointsArray[bottomPointsArray.length - 1], centerBottom);
            var vectorNormalE = ThreeDLib.getNormalVect(topPointsArray[topPointsArray.length - 1], bottomPointsArray[bottomPointsArray.length - 1], centerBottom);
            this.normalsArray.push(vectorNormalE, vectorNormalE, vectorNormalE);
            this.colorsArray.push(color, color, color);

            this.pointsArray.push(topPointsArray[topPointsArray.length - 1], centerBottom, centerTop);
            var vectorNormalF = ThreeDLib.getNormalVect(topPointsArray[topPointsArray.length - 1], centerBottom, centerTop);
            this.normalsArray.push(vectorNormalF, vectorNormalF, vectorNormalF);
            this.colorsArray.push(color, color, color);
            // end--------------------------------------------------------------------------------

            //vertices
            for (let j = 0; j < this.pointsArray.length; j++) {
                const element = this.pointsArray[j];
                vertices.push(element.x, element.y, element.z);
            }

            //colors
            for (let k = 0; k < this.colorsArray.length; k += 1) {
                const element = this.colorsArray[k];
                colors.push(element.r, element.g, element.b, element.alpha);
            }

            //normals
            for (let l = 0; l < this.normalsArray.length; l++) {
                const element = this.normalsArray[l];
                normals.push(element.x, element.y, element.z);
            }

            this.vertexCount = this.pointsArray.length;

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