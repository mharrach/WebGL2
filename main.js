var timeSpent = 0;
var gl;

function createShader() {
    /* Step3: Create and compile Shader programs */
    var canvas = document.getElementById('glcanvas');
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
    gl = canvas.getContext('experimental-webgl');

    // Vertex shader source code
    var vertCode =
        'attribute vec3 positions;' +
        'attribute vec3 normals;' +
        'attribute vec4 colors;' +
        'uniform mat4 tMatMouna;' +
        'uniform mat4 mvMat;' +
        'uniform mat4 projMat;' +
        'uniform mat4 normalMat;' +
        'varying vec4 vColor;' +
        'varying vec3 vNormal;' +
        'uniform vec3 objectPos;' +
        'void main(void) {' +
        'mat4 mvpMat = projMat * mvMat;' +
        'vec4 pos = vec4(objectPos + positions, 1.0);' +
        'vec4 posFinal = tMatMouna * pos;' +
        'gl_Position = mvpMat * posFinal;' +
        'vec3 rotatedNormal = (normalMat * vec4(normals, 1.0)).xyz;' +
        'gl_PointSize = 10.0;' +
        'vColor = colors;' +
        'vNormal = normalize(rotatedNormal);' +
        '}';

    //Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    //Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    //Compile the vertex shader
    gl.compileShader(vertShader);

    //Fragment shader source code
    var fragCode =
        'precision mediump float;' +
        'varying vec4 vColor;' +
        'varying vec3 vNormal;' +
        'void main(void) {' +
        'vec3 camDirCC = vec3(0.0, 0.0, 1.0);' + //camera coordinates (0, 0, -z)
        'float dotProd = dot(camDirCC, vNormal);' +
        'vec3 finalColor = vColor.rgb * dotProd;' +
        'gl_FragColor = vec4(finalColor, vColor.a);' +
        '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    //gl.useProgram(shaderProgram);

    return shaderProgram;
}

var shaderProgram = createShader();

function getWebglPos(event, context) {
    var clientX = event.clientX;
    var clientY = event.clientY;

    var midX = context.width / 2,
        midY = context.height / 2;

    var rect = event.target.getBoundingClientRect();

    x = ((clientX - rect.left) - midX) / midX;
    y = (midY - (clientY - rect.top)) / midY;

    return { x: x, y: y };
}

var that = this;
var lastDownTarget;
var canvas = document.getElementById('glcanvas');
var x, y;
var isDrawing = false;

/*canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    // Convert mouse position (window coordinates) to WebGL canvas coordinates
    x = getWebglPos(e, canvas).x;
    y = getWebglPos(e, canvas).y;

    if (!that.star) {
        that.star = new Star([0, 0, 0], 0.2, 0.4, 5, false, [x, y, 0]);
        that.objectsContainer.push(that.star);
    }
}, false);

canvas.addEventListener('mousemove', function(e) {
    if (isDrawing === true) {
        that.star.pos3d = [getWebglPos(e, canvas).x, getWebglPos(e, canvas).y, 0];
    }
}, false);

canvas.addEventListener('mouseup', function(e) {
    isDrawing = false;
}, false);*/


function createShapes() {
    var canvas = document.getElementById('glcanvas');
    gl = canvas.getContext('experimental-webgl');

    if (!this.objectsContainer || this.objectsContainer.length === 0) {
        this.objectsContainer = [];
        /* Step2: Define the geometry and store it in buffer objects */

        //this.spiral = new Spiral([0.3, -0.3, 0], 0.001, 1.75);
        if (!this.line1) {
            this.line1 = new Line(-0.95, 0, 0, 0.95, 0, 0);
            //this.objectsContainer.push(this.line1);
        }
        if (!this.line2) {
            this.line2 = new Line(0, -0.95, 0, 0, 0.95, 0);
            //this.objectsContainer.push(this.line2);
        }
        if (!this.cylinder) {
            this.cylinder = new Cylinder([0, 0, 0], 0.6, 1, 24);
            //this.objectsContainer.push(this.cylinder);
        }
        if (!this.cube) {
            this.cube = new Cube(4, [0, 0, 0]);
            //this.objectsContainer.push(this.cube);
        }
        if (!this.partCylind) {
            this.partCylind = new PartialCylinder([0, 0, 0], 0.5, 1, 56, 90, 270);
            this.objectsContainer.push(this.partCylind);
        }
        if (!this.cone) {
            this.cone = new Cone([0, 0, 0], 1, 1.2, 24);
            //this.objectsContainer.push(this.cone);
        }
        if (!this.partCone) {
            this.partCone = new PartialCone([0, 0, 0], 0.5, 1, 6, 90, 180);
            //this.objectsContainer.push(this.partCone);
        }
        if (!this.house) {
            this.house = new House([0, 0, 0], 0.8, 0.3, 0.6, 0.8);
            //this.objectsContainer.push(this.house);
        }
    }
    return this.objectsContainer;
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {

    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    return result;
};


function render(shaderProgram) {
    /* Step1: Prepare the canvas and get WebGL context */

    var canvas = document.getElementById('glcanvas');
    gl = canvas.getContext('experimental-webgl');
    this.sceneControl = new SceneController(canvas.width, canvas.height);

    //********************************************************************/
    /* Step5: Drawing the required objects */

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height);

    // use shader.
    gl.useProgram(shaderProgram);

    /*******************Transformation matrices***************************/
    // Scale matrix
    if (!this.tMat) {
        this.tMat = glMatrix.mat4.create();
    }
    var scale = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
    var tMatScal = glMatrix.mat4.fromScaling(this.tMat, scale);
    var utMatMouna_loc = gl.getUniformLocation(shaderProgram, "tMatMouna");
    gl.uniformMatrix4fv(utMatMouna_loc, false, tMatScal);

    // Rotation matrix
    // this.mvMat = glMatrix.mat4.create(); //identity??
    var mvMat = this.sceneControl._getModelViewMat();
    mvMat = glMatrix.mat4.identity(mvMat); //identity??

    //Slider
    var sliderZ = document.getElementById("rotValSliderZ");
    var outputZ = document.getElementById("resultZ");
    var angleRadZ = sliderZ.value * Math.PI / 180;
    sliderZ.oninput = function() {
        outputZ.innerHTML = this.value;
        angleRadZ = parseInt(this.value) * Math.PI / 180;
    };

    var sliderX = document.getElementById("rotValSliderX");
    var outputX = document.getElementById("resultX");
    var angleRadX = sliderX.value * Math.PI / 180;
    sliderX.oninput = function() {
        outputX.innerHTML = this.value;
        angleRadX = parseInt(this.value) * Math.PI / 180;
    };

    var tMatRotZ = this.sceneControl.setRotationMat("z", angleRadZ);
    var tMatRotX = this.sceneControl.setRotationMat("x", angleRadX);
    var tMatRotXZ = this.sceneControl.setRotationMatXZ(tMatRotX, tMatRotZ);

    this.sceneControl.setModelViewMat(gl, shaderProgram, mvMat, mvMat, tMatRotXZ);

    var normalMat = this.sceneControl._getNormalMat();
    var out = glMatrix.mat4.create();
    var out2 = glMatrix.mat4.create();
    var mvmInv = glMatrix.mat4.invert(out, this.sceneControl._getModelViewMat());
    normalMat = glMatrix.mat4.transpose(normalMat, mvmInv);

    this.sceneControl.setNormalMat(gl, shaderProgram);

    // Projection Matrix
    var rangeSlider = document.getElementById("rangeSlider");
    var rangeHtmlValue = document.getElementById("rangeValue");
    var range = rangeSlider.value;
    rangeSlider.oninput = function() {
        rangeHtmlValue.innerHTML = this.value;
        range = this.value;
    };

    this.sceneControl.setProjMat(gl, shaderProgram, range);

    //gl.enable(gl.CULL_FACE);
    // Render objects
    this.objectsContainer = createShapes();
    var objectsCount = this.objectsContainer.length;
    for (var i = 0; i < objectsCount; i++) {
        var object = this.objectsContainer[i];
        object.render(gl, shaderProgram);
    }

}

function renderLoop() {
    render(shaderProgram);
    window.setTimeout(renderLoop, 1000 / 60);
}

function initWebGL(canvas) {
    gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}

function onLoad() {
    var canvas = document.getElementById("glcanvas");
    initWebGL(canvas);
    if (gl) {
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        renderLoop();
    }
}