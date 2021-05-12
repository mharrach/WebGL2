class Line {
    constructor(start_x, start_y, start_z, end_x, end_y, end_z) {
        this.start_x = start_x;
        this.start_y = start_y;
        this.start_z = start_z;
        this.end_x = end_x;
        this.end_y = end_y;
        this.end_z = end_z;
        this.vbo = undefined;
        this.colorVbo = undefined;
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var start_x = this.start_x;
            var start_y = this.start_y;
            var start_z = this.start_z;
            var end_x = this.end_x;
            var end_y = this.end_y;
            var end_z = this.end_z;

            var vertices = [start_x, start_y, start_z, end_x, end_y, end_z];
            var color = [0, 1, 0, 1, 1, 0, 0, 1];

            this.vertexCount = vertices.length / 3;

            var vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo = vertex_buffer;

            var color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
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

        var hasNormal_loc = gl.getUniformLocation(shaderProgram, "u_hasNormals");
        gl.uniform1i(hasNormal_loc, false);

        var vertex_buffer = this._getVbo(gl).position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINE_STRIP, 0, this.vertexCount);
    }
}