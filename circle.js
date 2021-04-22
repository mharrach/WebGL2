class Circle {
    constructor(center_x, center_y, center_z, radius, pts_count, full, pos3d) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.center_z = center_z;
        this.radius = radius;
        this.pts_count = pts_count;
        this.full = full;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.pos3d = pos3d;
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var x = this.center_x;
            var y = this.center_y;
            var z = this.center_z;
            var pts = this.pts_count;
            var increAngRad = 2 * Math.PI / pts;
            var positions = [];
            var colors = [];
            for (var i = 0; i < pts; i++) {
                var angRad = i * increAngRad;

                // p1.***
                var p1x = x;
                var p1y = y;
                var p1z = z;

                // p2.***
                var p2x = x + this.radius * Math.sin(angRad);
                var p2y = y + this.radius * Math.cos(angRad);
                var p2z = z;

                // p3.***
                var p3x = x + this.radius * Math.sin(angRad + increAngRad);
                var p3y = y + this.radius * Math.cos(angRad + increAngRad);
                var p3z = z;

                if (this.full == true) {
                    positions.push(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z);
                    colors.push(Math.random(), Math.random(), Math.random(), 1);
                    colors.push(Math.random(), Math.random(), Math.random(), 1);
                    colors.push(Math.random(), Math.random(), Math.random(), 1);
                } else {
                    positions.push(p2x, p2y, p2z);
                    colors.push(Math.random(), Math.random(), Math.random(), 1);
                }
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

        if (this.full == true) {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        } else {
            gl.drawArrays(gl.LINE_LOOP, 0, this.vertexCount);
        }
    }
}