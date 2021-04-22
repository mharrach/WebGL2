class PartialCone {
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
            var z;

            // Init
            var centerTop = new Point(0, 0, h);
            var centerBottom = new Point(0, 0, 0);
            var bottomPointsArray = [];
            var currBottomPoint;
            var nextBottomPoint;
            var colorRed = new Color(1, 0, 0, 1);
            var colorWhite = new Color(1, 1, 1, 1);

            for (let i = 0; i < pts; i++) {

                x = rad * Math.cos(startAngRad + i * incAngRad);
                y = rad * Math.sin(startAngRad + i * incAngRad);
                z = 0;
                bottomPointsArray.push(new Point(x, y, z));

            }

            // Base.************************************************************************************
            for (let n = 0; n < bottomPointsArray.length - 1; n++) {

                currBottomPoint = bottomPointsArray[n];
                nextBottomPoint = bottomPointsArray[n + 1];

                this.pointsArray.push(centerBottom, nextBottomPoint, currBottomPoint);
                var normalVect = ThreeDLib.getNormalVect(centerBottom, nextBottomPoint, currBottomPoint);
                this.normalsArray.push(normalVect, normalVect, normalVect);
                this.colorsArray.push(colorRed, colorRed, colorRed);

            }
            //------------------------------------------------------------------------------------------

            // Surface lateral. ************************************************************************
            for (let n = 0; n < bottomPointsArray.length - 1; n++) {

                currBottomPoint = bottomPointsArray[n];
                nextBottomPoint = bottomPointsArray[n + 1];

                this.pointsArray.push(centerTop, currBottomPoint, nextBottomPoint);
                var normalVect = ThreeDLib.getNormalVect(centerTop, currBottomPoint, nextBottomPoint);
                this.normalsArray.push(normalVect, normalVect, normalVect);
                this.colorsArray.push(colorWhite, colorRed, colorRed);

            }
            //-------------------------------------------------------------------------------------------

            // Start panel. ****************************************************************************
            this.pointsArray.push(centerTop, centerBottom, bottomPointsArray[0]);
            var normalVectA = ThreeDLib.getNormalVect(centerTop, centerBottom, bottomPointsArray[0]);
            this.normalsArray.push(normalVectA, normalVectA, normalVectA);
            this.colorsArray.push(colorWhite, colorRed, colorRed);
            //-------------------------------------------------------------------------------------------

            // End panel. ****************************************************************************
            var lastElement = bottomPointsArray.length - 1;
            this.pointsArray.push(centerTop, bottomPointsArray[lastElement], centerBottom);
            var normalVectB = ThreeDLib.getNormalVect(centerTop, bottomPointsArray[lastElement], centerBottom);
            this.normalsArray.push(normalVectB, normalVectB, normalVectB);
            this.colorsArray.push(colorWhite, colorRed, colorRed);
            //-------------------------------------------------------------------------------------------

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