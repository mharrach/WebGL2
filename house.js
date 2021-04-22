class House {
    constructor(pos3d, height, roofHeight, width, length) {
        this.pos3d = pos3d;
        this.height = height;
        this.roofHeight = roofHeight;
        this.width = width;
        this.length = length;
        this.vbo = undefined;
        this.colorVbo = undefined;
        this.normalVbo = undefined;
        this.pointsArray = [];
        this.normalsArray = [];
        this.colorsArray = [];
    }
    _getVbo(gl) {
        if (!this.vbo) {
            var vertices = [];
            var colors = [];
            var normals = [];

            var totalH = this.height;
            var rh = this.roofHeight;
            var halfWidth = this.width / 2;
            var halfLen = this.length / 2;
            var h = totalH - rh;
            var frontLeftBottom = new Point(-halfWidth, -halfLen, 0);
            var frontLeftTop = new Point(-halfWidth, -halfLen, h);
            var frontRightBottom = new Point(halfWidth, -halfLen, 0);
            var frontRightTop = new Point(halfWidth, -halfLen, h);
            var frontCenterTop = new Point(0, -halfLen, totalH);
            var backRightBottom = new Point(halfWidth, halfLen, 0);
            var backRightTop = new Point(halfWidth, halfLen, h);
            var backLeftBottom = new Point(-halfWidth, halfLen, 0);
            var backLeftTop = new Point(-halfWidth, halfLen, h);
            var backCenterTop = new Point(0, halfLen, totalH);
            var blueColor = new Color(0, 0, 1, 1);
            var redColor = new Color(1, 0, 0, 1);
            var greenColor = new Color(0, 1, 0, 1);

            // Front face. *************************************************************************
            this.pointsArray.push(frontLeftTop, frontRightTop, frontCenterTop);
            var normalA = ThreeDLib.getNormalVect(frontLeftTop, frontRightTop, frontCenterTop);
            this.normalsArray.push(normalA, normalA, normalA);
            this.colorsArray.push(redColor, redColor, redColor);

            this.pointsArray.push(frontLeftTop, frontLeftBottom, frontRightBottom);
            this.pointsArray.push(frontLeftTop, frontRightBottom, frontRightTop);
            var normalB = ThreeDLib.getNormalVect(frontLeftTop, frontLeftBottom, frontRightBottom);
            var normalC = ThreeDLib.getNormalVect(frontLeftTop, frontRightBottom, frontRightTop);
            this.normalsArray.push(normalB, normalB, normalB);
            this.normalsArray.push(normalC, normalC, normalC);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            // end.*********************************************************************************

            // Right side face. *********************************************************************
            this.pointsArray.push(frontRightTop, frontRightBottom, backRightBottom);
            this.pointsArray.push(frontRightTop, backRightBottom, backRightTop);
            var normalD = ThreeDLib.getNormalVect(frontRightTop, frontRightBottom, backRightBottom);
            var normalE = ThreeDLib.getNormalVect(frontRightTop, backRightBottom, backRightTop);
            this.normalsArray.push(normalD, normalD, normalD);
            this.normalsArray.push(normalE, normalE, normalE);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            // end.*********************************************************************************

            // Left side face. *********************************************************************
            this.pointsArray.push(backLeftBottom, frontLeftBottom, frontLeftTop);
            this.pointsArray.push(backLeftBottom, frontLeftTop, backLeftTop);
            var normalF = ThreeDLib.getNormalVect(backLeftBottom, frontLeftBottom, frontLeftTop);
            var normalG = ThreeDLib.getNormalVect(backLeftBottom, frontLeftBottom, frontLeftTop);
            this.normalsArray.push(normalF, normalF, normalF);
            this.normalsArray.push(normalG, normalG, normalG);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            // end.*********************************************************************************

            // Back face. *************************************************************************
            this.pointsArray.push(backCenterTop, backRightTop, backLeftTop);
            var normalH = ThreeDLib.getNormalVect(backCenterTop, backRightTop, backLeftTop);
            this.normalsArray.push(normalH, normalH, normalH);
            this.colorsArray.push(redColor, redColor, redColor);

            this.pointsArray.push(backRightTop, backRightBottom, backLeftBottom);
            this.pointsArray.push(backRightTop, backLeftBottom, backLeftTop);
            var normalI = ThreeDLib.getNormalVect(backRightTop, backRightBottom, backLeftBottom);
            var normalJ = ThreeDLib.getNormalVect(backRightTop, backRightBottom, backLeftTop);
            this.normalsArray.push(normalI, normalI, normalI);
            this.normalsArray.push(normalJ, normalJ, normalJ);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            this.colorsArray.push(blueColor, blueColor, blueColor);
            // end.*********************************************************************************

            // Roof Right side. *********************************************************************
            this.pointsArray.push(frontCenterTop, frontRightTop, backRightTop);
            this.pointsArray.push(frontCenterTop, backRightTop, backCenterTop);
            var normalK = ThreeDLib.getNormalVect(frontCenterTop, frontRightTop, backRightTop);
            var normalL = ThreeDLib.getNormalVect(frontCenterTop, frontRightTop, backRightTop);
            this.normalsArray.push(normalK, normalK, normalK);
            this.normalsArray.push(normalL, normalL, normalL);
            this.colorsArray.push(redColor, redColor, redColor);
            this.colorsArray.push(redColor, redColor, redColor);
            // end.*********************************************************************************

            // Roof Left side. *********************************************************************
            this.pointsArray.push(frontLeftTop, frontCenterTop, backLeftTop);
            this.pointsArray.push(backLeftTop, frontCenterTop, backCenterTop);
            var normalM = ThreeDLib.getNormalVect(frontLeftTop, frontCenterTop, backLeftTop);
            var normalN = ThreeDLib.getNormalVect(backLeftTop, frontCenterTop, backCenterTop);
            this.normalsArray.push(normalM, normalM, normalM);
            this.normalsArray.push(normalN, normalN, normalN);
            this.colorsArray.push(redColor, redColor, redColor);
            this.colorsArray.push(redColor, redColor, redColor);
            // end.**********************************************************************************

            // Bottom face. ************************************************************************
            this.pointsArray.push(frontLeftBottom, backLeftBottom, frontRightBottom);
            this.pointsArray.push(backLeftBottom, backRightBottom, frontRightBottom);
            var normalO = ThreeDLib.getNormalVect(frontLeftBottom, backLeftBottom, frontRightBottom);
            var normalP = ThreeDLib.getNormalVect(backLeftBottom, backRightBottom, frontRightBottom);
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