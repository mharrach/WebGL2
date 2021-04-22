class Star {
    constructor(centro, radio_interior, radio_exterior, numero_puntas, full, pos3d) {
        this.centro = centro;
        this.radio_interior = radio_interior;
        this.radio_exterior = radio_exterior;
        this.numero_puntas = numero_puntas;
        this.full = full;
        this.pos3d = pos3d;
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var x = this.centro[0];
            var y = this.centro[1];
            var z = this.centro[2];
            var pts = this.numero_puntas;
            var increAngRad = 2 * Math.PI / pts;
            var positions = [];
            var colors = [];
            for (var i = 0; i <= pts; i++) {
                var angRad = i * increAngRad;

                // p1.***
                var p1x = x + this.radio_exterior * Math.cos(angRad);
                var p1y = y + this.radio_exterior * Math.sin(angRad);
                var p1z = z;

                // p2.***
                var p2x = x + this.radio_interior * Math.cos(angRad + increAngRad / 2);
                var p2y = y + this.radio_interior * Math.sin(angRad + increAngRad / 2);
                var p2z = z;

                // p3.***
                var p3x = x + this.radio_exterior * Math.cos(angRad + increAngRad);
                var p3y = y + this.radio_exterior * Math.sin(angRad + increAngRad);
                var p3z = z;

                if (this.full == true) {
                    positions.push(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z);
                    colors.push(1, 0, 0, 1);
                    colors.push(0, 1, 0, 1);
                    colors.push(0, 0, 1, 1);
                } else {
                    positions.push(p1x, p1y, p1z, p2x, p2y, p2z);
                    colors.push(1, 0, 0, 1,
                        1, 0, 0, 1);
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

        // Draw the star
        if (this.full) {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        } else {
            gl.drawArrays(gl.LINE_STRIP, 0, this.vertexCount);
        }
    }
}