class Cone {
    constructor(pos3d, radius, height, nb_sections) {
        this.pos3d = pos3d;
        this.radius = radius;
        this.height = height;
        this.nb_sections = nb_sections;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
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
            var z;

            // Creamos topPoints & bottomPoints arrays.
            var centerTop = new Point(0, 0, h);
            var centerBottom = new Point(0, 0, 0);
            var bottomPointsArray = [];

            // first point
            x = rad;
            y = 0;
            z = 0;
            bottomPointsArray.push(new Point(x, y, z));

            for (let i = 0; i < pts; i++) {
                x = rad * Math.cos(increAngRad + i * increAngRad);
                y = rad * Math.sin(increAngRad + i * increAngRad);
                z = 0;

                bottomPointsArray.push(new Point(x, y, z));
            }

            var r = 0.75;
            var g = 0.25;
            var b = 0.80;
            // Base.************************************************************************************
            for (let n = 0; n < pts; n++) {
                var currBottomPoint;
                var nextBottomPoint;
                currBottomPoint = bottomPointsArray[n];
                nextBottomPoint = bottomPointsArray[n + 1];

                this.pointsArray.push(centerBottom, nextBottomPoint, currBottomPoint);
                var normalVect = ThreeDLib.getNormalVect(centerBottom, nextBottomPoint, currBottomPoint);
                this.normalsArray.push(normalVect, normalVect, normalVect);
                //colors
                for (let index = 0; index < 3; index++) {
                    colors.push(r, g, b, 1);
                }
            }
            //------------------------------------------------------------------------------------------

            // Surface lateral. ************************************************************************
            for (let n = 0; n < pts; n++) {
                var currBottomPoint;
                var nextBottomPoint;
                currBottomPoint = bottomPointsArray[n];
                nextBottomPoint = bottomPointsArray[n + 1];

                this.pointsArray.push(centerTop, currBottomPoint, nextBottomPoint);
                var normalVect = ThreeDLib.getNormalVect(centerTop, currBottomPoint, nextBottomPoint);
                this.normalsArray.push(normalVect, normalVect, normalVect);
                for (let index = 0; index < 3; index++) {
                    colors.push(r, g, b, 1);
                }
            }
            //-------------------------------------------------------------------------------------------

            for (let l = 0; l < this.pointsArray.length; l++) {
                const element = this.pointsArray[l];
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