class Rectangle {
    constructor(width, height, full, center_x, center_y, center_z, pos3d) {
        this.width = width;
        this.height = height;
        this.full = full;
        this.center_x = center_x;
        this.center_y = center_y;
        this.center_z = center_z;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.pos3d = pos3d;
    }
    _getVbo(gl) {
        if (!this.vbo) {

            var width = this.width / 2;
            var height = this.height / 2;
            var cx = this.center_x;
            var cy = this.center_y;
            var cz = this.center_z;
            var vertices = [];
            var colors = [];

            if (this.full == true) {
                vertices = [cx + width, cy + height, cz, cx - width, cy + height, cz,
                    cx - width, cy - height, cz, cx - width, cy - height, cz,
                    cx + width, cy - height, cz, cx + width, cy + height, cz
                ];
                for (let i = 0; i <= 5; i++) {
                    colors.push(0.8, 0.5, 0.2, 1);
                }
            } else {
                vertices = [cx + width / 2, cy + height / 2, cz, cx - width / 2, cy + height / 2, cz,
                    cx - width / 2, cy - height / 2, cz, cx + width / 2, cy - height / 2, cz
                ];
                for (let i = 0; i <= 3; i++) {
                    colors.push(0.8, 0.5, 0.2, 1);
                }
            }

            this.vertexCount = vertices.length / 3;
            // Create a new buffer object
            var vertex_buffer = gl.createBuffer();
            // Bind an empty array buffer to it
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            // Pass the vertices data to the buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            // Unbind the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo = vertex_buffer;

            // Create a new color buffer object
            var color_buffer = gl.createBuffer();
            // Bind an empty array buffer to it
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            // Pass the color data to the buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            // Unbind the buffer
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
        //Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        //point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        var color_buffer = this._getVbo(gl).color;
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

        // Draw the rectangle
        if (this.full == true) {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        } else {
            gl.drawArrays(gl.LINE_LOOP, 0, this.vertexCount);
        }
    }
}