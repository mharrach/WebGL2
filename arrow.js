class Arrow {
    constructor(pos3d, height, width, length, arrowHeadLen) {
        this.pos3d = pos3d;
        this.height = height;
        this.width = width;
        this.length = length;
        this.arrowHeadLen = arrowHeadLen;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
        this.colorsArray = [];
    }
    getPosition() {
        return this.pos3d;
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var vertices = [];
            var colors = [];
            var normals = [];

            var totalLen = this.length;
            var arrowLen = this.arrowHeadLen;
            var halfWidth = this.width / 2;
            var halfLen = this.length / 2;
            var h = this.height;
            var len = totalLen - arrowLen;

            var frontLeftBottom = new Point(-halfWidth, -halfLen, 0);
            var frontLeftTop = new Point(-halfWidth, -halfLen, h);
            var frontRightBottom = new Point(halfWidth, -halfLen, 0);
            var frontRightTop = new Point(halfWidth, -halfLen, h);
            var backRightBottom = new Point(halfWidth, halfLen, 0);
            var backRightTop = new Point(halfWidth, halfLen, h);
            var backLeftBottom = new Point(-halfWidth, halfLen, 0);
            var backLeftTop = new Point(-halfWidth, halfLen, h);
            var backCenterBottom = new Point(0, halfLen + arrowLen, 0);
            var backCenterTop = new Point(0, halfLen + arrowLen, h);
            var greenColor = new Color(0, 1, 0, 1);

            // Front face. *************************************************************************
            this.pointsArray.push(frontLeftTop, frontRightTop, backRightTop);
            var normalA = ThreeDLib.getNormalVect(frontLeftTop, frontRightTop, backRightTop);
            this.normalsArray.push(normalA, normalA, normalA);
            this.colorsArray.push(greenColor, greenColor, greenColor);

            this.pointsArray.push(frontLeftTop, backRightTop, backLeftTop);
            var normalB = ThreeDLib.getNormalVect(frontLeftTop, backRightTop, backLeftTop);
            this.normalsArray.push(normalB, normalB, normalB);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.*********************************************************************************

            // Right side face. *********************************************************************
            this.pointsArray.push(frontRightTop, frontRightBottom, backRightBottom);
            this.pointsArray.push(frontRightTop, backRightBottom, backRightTop);
            var normalC = ThreeDLib.getNormalVect(frontRightTop, frontRightBottom, backRightBottom);
            var normalD = ThreeDLib.getNormalVect(frontRightTop, backRightBottom, backRightTop);
            this.normalsArray.push(normalC, normalC, normalC);
            this.normalsArray.push(normalD, normalD, normalD);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.*********************************************************************************

            // Left side face. *********************************************************************
            this.pointsArray.push(backLeftBottom, frontLeftBottom, frontLeftTop);
            this.pointsArray.push(backLeftBottom, frontLeftTop, backLeftTop);
            var normalE = ThreeDLib.getNormalVect(backLeftBottom, frontLeftBottom, frontLeftTop);
            var normalF = ThreeDLib.getNormalVect(backLeftBottom, frontLeftBottom, frontLeftTop);
            this.normalsArray.push(normalE, normalE, normalE);
            this.normalsArray.push(normalF, normalF, normalF);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.*********************************************************************************

            // Back face. *************************************************************************
            this.pointsArray.push(frontLeftBottom, backRightBottom, frontRightBottom);
            var normalG = ThreeDLib.getNormalVect(frontLeftBottom, backRightBottom, frontRightBottom);
            this.normalsArray.push(normalG, normalG, normalG);
            this.colorsArray.push(greenColor, greenColor, greenColor);

            this.pointsArray.push(frontLeftBottom, backLeftBottom, backRightBottom);
            var normalH = ThreeDLib.getNormalVect(frontLeftBottom, backLeftBottom, backRightBottom);
            this.normalsArray.push(normalH, normalH, normalH);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.*********************************************************************************

            // Arrow Right side. *********************************************************************
            this.pointsArray.push(backRightTop, backRightBottom, backCenterBottom);
            this.pointsArray.push(backRightTop, backCenterBottom, backCenterTop);
            var normalI = ThreeDLib.getNormalVect(backRightTop, backRightBottom, backCenterBottom);
            var normalJ = ThreeDLib.getNormalVect(backRightTop, backRightBottom, backCenterTop);
            this.normalsArray.push(normalI, normalI, normalI);
            this.normalsArray.push(normalJ, normalJ, normalJ);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.*********************************************************************************

            // Arrow Left side. *********************************************************************
            this.pointsArray.push(backLeftBottom, backLeftTop, backCenterBottom);
            this.pointsArray.push(backCenterBottom, backLeftTop, backCenterTop);
            var normalK = ThreeDLib.getNormalVect(backLeftBottom, backLeftTop, backCenterBottom);
            var normalL = ThreeDLib.getNormalVect(backCenterBottom, backLeftTop, backCenterTop);
            this.normalsArray.push(normalK, normalK, normalK);
            this.normalsArray.push(normalL, normalL, normalL);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.**********************************************************************************

            // Arrow Top side. *********************************************************************
            this.pointsArray.push(backLeftTop, backRightTop, backCenterTop);
            var normalM = ThreeDLib.getNormalVect(backLeftTop, backRightTop, backCenterTop);
            this.normalsArray.push(normalM, normalM, normalM);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.**********************************************************************************

            // Arrow Bottom side. *********************************************************************
            this.pointsArray.push(backLeftBottom, backCenterBottom, backRightBottom);
            var normalN = ThreeDLib.getNormalVect(backLeftBottom, backCenterBottom, backRightBottom);
            this.normalsArray.push(normalN, normalN, normalN)
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.**********************************************************************************

            // Bottom face. ************************************************************************
            this.pointsArray.push(frontLeftBottom, frontRightBottom, frontLeftTop);
            this.pointsArray.push(frontLeftTop, frontRightBottom, frontRightTop);
            var normalO = ThreeDLib.getNormalVect(frontLeftBottom, frontRightBottom, frontLeftTop);
            var normalP = ThreeDLib.getNormalVect(frontLeftTop, frontRightBottom, frontRightTop);
            this.normalsArray.push(normalO, normalO, normalO);
            this.normalsArray.push(normalP, normalP, normalP);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            this.colorsArray.push(greenColor, greenColor, greenColor);
            // end.*********************************************************************************

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
    setColorsVbo(gl, newColors) {
        gl.deleteBuffer(this.colorVbo);

        var pts = this.vertexCount;
        var colors = [];
        for (let i = 0; i < pts; i++) {
            colors.push(newColors[0], newColors[1], newColors[2], 1);
        }

        var color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.colorsVbo = color_buffer;
    }
    render(gl, shaderProgram) {

        var coord = gl.getAttribLocation(shaderProgram, "positions");
        gl.enableVertexAttribArray(coord);

        var color = gl.getAttribLocation(shaderProgram, "colors");
        gl.enableVertexAttribArray(color);

        var normal = gl.getAttribLocation(shaderProgram, "normals");
        gl.enableVertexAttribArray(normal);

        var hasNormal_loc = gl.getUniformLocation(shaderProgram, "u_hasNormals");
        gl.uniform1i(hasNormal_loc, true);

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