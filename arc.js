class Arc {
    constructor(center_x, center_y, center_z, radius, startAngDeg, endAngDeg, n, pos3d) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.center_z = center_z;
        this.radius = radius;
        this.startAngDeg = startAngDeg;
        this.endAngDeg = endAngDeg;
        this.n = n; //number of lines
        this.vbo = undefined;
        this.colorsVbo = undefined;
        this.pos3d = pos3d;
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var cx = this.center_x;
            var cy = this.center_y;
            var cz = this.center_z;
            var startAngRad = this.startAngDeg * Math.PI / 180;
            var endAngRad = this.endAngDeg * Math.PI / 180;
            var positions = [];
            var colors = [];

            for (let i = 0; i <= this.n; i++) {
                var angle = (startAngRad - endAngRad) * i / this.n;
                var x = cx + this.radius * Math.sin(angle);
                var y = cy + this.radius * Math.cos(angle);
                var z = cz;
                positions.push(x, y, z);
                colors.push(Math.random(), Math.random(), Math.random(), 1);

            }

            this.vertexCount = positions.length / 3;

            var vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo = vertex_buffer;

            var color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.colorsVbo = color_buffer;
        }

        return { positions: this.vbo, color: this.colorsVbo };
    }
    render(gl, shaderProgram) {

        var coord = gl.getAttribLocation(shaderProgram, "positions");
        gl.enableVertexAttribArray(coord);

        var color = gl.getAttribLocation(shaderProgram, "colors");
        gl.enableVertexAttribArray(color);

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, this.pos3d);

        var vertex_buffer = this._getVbo(gl).positions;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINE_STRIP, 0, this.vertexCount);
    }
}