class SinusGraph {
    constructor(nbPts) {
        this.nbPts = nbPts;
        this.vbo = undefined;
        this.colorsVbo = undefined;
        this.pointsArray = [];
        this.colorsArray = [];
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var pts = this.nbPts;
            var vertices = [];
            var colors = [];

            for (var i = 0; i < pts; i++) {

                var val = (i / pts) * (Math.PI * 2); // lerp 0..points => 0..2PI
                var x = ((i / pts) * 2) - 1; // x, lerp 0..points => -1..1 range
                var y = Math.sin(val); // y, the sinus function...
                this.pointsArray.push(new Point(x, y, 0));
                this.colorsArray.push(new Color(0, 0, 1, 1));

            }

            for (let j = 0; j < this.pointsArray.length; j++) {
                const element = this.pointsArray[j];
                vertices.push(element.x, element.y, element.z);
            }

            for (let k = 0; k < this.colorsArray.length; k++) {
                const element = this.colorsArray[k];
                colors.push(element.r, element.g, element.b, element.alpha);
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
        }
        return { position: this.vbo, color: this.colorsVbo };
    }
    render(gl, shaderProgram) {
        var coord = gl.getAttribLocation(shaderProgram, "positions");
        gl.enableVertexAttribArray(coord);

        var color = gl.getAttribLocation(shaderProgram, "colors");
        gl.enableVertexAttribArray(color);

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, [0, 0, 0]);

        var vertex_buffer = this._getVbo(gl).position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, this.vertexCount);
    }
}