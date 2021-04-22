class Spiral {
    constructor(pos3d, angle, rounds) {
        this.pos3d = pos3d;
        this.angle = angle;
        this.rounds = rounds;
        this.vbo = undefined;
        this.colorVbo = undefined;
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var x = this.pos3d[0];
            var y = this.pos3d[1];
            var z = this.pos3d[2];
            var increAng = this.angle;
            var lastPoint = [0, 0];
            var turns = this.rounds;
            const a = 0;
            const b = 0.05;
            var positions = [];
            var colors = [];
            for (var theta = 0; theta < turns * 2 * Math.PI; theta += increAng) {
                var r = a + b * theta;
                var thisPoint = [r * Math.cos(theta), r * Math.sin(theta)];
                positions.push(x + lastPoint[0], y + lastPoint[1], z, x + thisPoint[0], y + thisPoint[1], z);
                colors.push(1, 0, 0, 1);
                colors.push(1, 0, 0, 1);
                lastPoint = thisPoint;
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

        return { position: this.vbo, color: this.colorsVbo };
    }
    render(gl, shaderProgram) {

        var coord = gl.getAttribLocation(shaderProgram, "positions");
        gl.enableVertexAttribArray(coord);

        var color = gl.getAttribLocation(shaderProgram, "colors");
        gl.enableVertexAttribArray(color);

        var uObjectPos_loc = gl.getUniformLocation(shaderProgram, "objectPos");
        gl.uniform3fv(uObjectPos_loc, this.pos3d);

        var vertex_buffer = this._getVbo(gl).position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINE_STRIP, 0, this.vertexCount);
    }
}