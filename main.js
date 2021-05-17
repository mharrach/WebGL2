var lastUpdateTime = 0;
var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('experimental-webgl');
var shaderProgram = createShader();

function createShader() {
    /* Step3: Create and compile Shader programs */
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;

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
        'uniform bool u_hasNormals;' +
        'varying vec4 vColor;' +
        'varying vec3 vNormal;' +
        'void main(void) {' +
        'vec3 camDirCC = vec3(0.0, 0.0, 1.0);' + //camera coordinates (0, 0, -z)
        'float dotProd = dot(camDirCC, vNormal);' +
        'vec3 finalColor;' +
        'if (u_hasNormals){' +
        'finalColor = vColor.rgb * dotProd;' +
        '}' +
        'else{' +
        'finalColor = vColor.rgb;' +
        '}' +
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

function initProgram() {
    var that = this;
    if (!this.sceneControl) {
        var camPos = [0, -0.5, 0.1];
        var camDir = glMatrix.vec4.fromValues(0, 1, 0, 1);
        var camUp = glMatrix.vec4.fromValues(0, 0, 1, 1);
        var camFovyRad = Math.PI / 2;
        var cameraInit = new Camera(camPos, camDir, camUp, camFovyRad);
        this.sceneControl = new SceneController(canvas.width, canvas.height, cameraInit);
    }

    canvas.addEventListener("wheel", event => {
        var camera = that.sceneControl.camera;
        var camDirection = camera._getDirection();
        const delta = -Math.sign(event.deltaY) / 50;
        camera.position[0] += delta * camDirection[0];
        camera.position[1] += delta * camDirection[1];
        camera.position[2] += delta * camDirection[2];
    });

    var isDown;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var camera;
    var camDirInit;
    var camUpInit;
    var camRightInit;
    var startCameraDir;
    var startCameraUp;
    var startCameraRight;

    canvas.addEventListener('mousedown', function(e) {
        isDown = true;
        initialX = e.clientX;
        initialY = e.clientY;
        camera = that.sceneControl.camera;
        camDirInit = camera._getDirection();
        camUpInit = camera._getUp();
        camRightInit = camera._getRight();
        startCameraDir = glMatrix.vec4.fromValues(camDirInit[0], camDirInit[1], camDirInit[2], 1);
        startCameraUp = glMatrix.vec4.fromValues(camUpInit[0], camUpInit[1], camUpInit[2], 1);
        startCameraRight = glMatrix.vec4.fromValues(camRightInit[0], camRightInit[1], camRightInit[2], 1);
    }, false);

    canvas.addEventListener('mousemove', function(e) {
        if (isDown === true) {
            currentX = e.clientX;
            currentY = e.clientY;

            var sensitivity = 0.1;

            var deltaY = currentY - initialY;
            var deltaX = currentX - initialX;

            deltaX *= sensitivity;
            deltaY *= sensitivity;

            // Pitch
            camera = that.sceneControl.camera;
            var camRight = camera._getRight();
            var currCamDir = camera._getDirection();
            var currCamUp = camera._getUp();
            var xRotMat = glMatrix.mat4.create();

            var yawRad = -deltaX * Math.PI / 180;
            var pitchRad = -deltaY * Math.PI / 180;

            var quatPitch = glMatrix.quat.create();
            quatPitch = glMatrix.quat.setAxisAngle(quatPitch, camRight, pitchRad);

            xRotMat = glMatrix.mat4.fromQuat(xRotMat, quatPitch);

            // Heading
            var planeNormal = glMatrix.vec3.fromValues(0, 0, 1);

            var quatHeading = glMatrix.quat.create();
            quatHeading = glMatrix.quat.setAxisAngle(quatHeading, planeNormal, yawRad);
            var headingRotMat = glMatrix.mat4.create();
            headingRotMat = glMatrix.mat4.fromQuat(headingRotMat, quatHeading);

            var totalRotMat = glMatrix.mat4.create();
            glMatrix.mat4.multiply(totalRotMat, xRotMat, headingRotMat);

            glMatrix.vec4.transformMat4(currCamDir, startCameraDir, totalRotMat);
            glMatrix.vec4.transformMat4(currCamUp, startCameraUp, totalRotMat);
            glMatrix.vec4.transformMat4(camRight, startCameraRight, totalRotMat);

        }
    }, false);

    canvas.addEventListener('mouseup', function(e) {
        isDown = false;
    }, false);


    window.addEventListener("keydown", function(event) {
        if (event.defaultPrevented) {
            return;
        }
        var deltaT = 0;
        camera = that.sceneControl.camera;
        var camRight = camera._getRight();
        switch (event.key) {
            case "ArrowLeft":
                deltaT = -0.1;
                break;
            case "ArrowRight":
                deltaT = 0.1;
                break;
        }

        camera.position[0] += deltaT * camRight[0];
        camera.position[1] += deltaT * camRight[1];
        camera.position[2] += deltaT * camRight[2];

        event.preventDefault();
    }, true);

    document.getElementById("test").addEventListener("click", function() {
        var camera = that.sceneControl.camera;
        var camRight = glMatrix.vec3.fromValues(1, 0, 0);
        var currCamDir = camera._getDirection();
        var currCamUp = camera._getUp();
        var camPos = camera._getPosition();
        camPos[0] = 0.0;
        camPos[1] = 0.0;
        camPos[2] = 1.0;
        var pitchRad = 90 * Math.PI / 180;

        var quatPitch = glMatrix.quat.create();
        quatPitch = glMatrix.quat.setAxisAngle(quatPitch, camRight, pitchRad);

        var xRotMat = glMatrix.mat4.create();
        xRotMat = glMatrix.mat4.fromQuat(xRotMat, quatPitch);
        glMatrix.vec4.transformMat4(currCamDir, startCameraDir, xRotMat);
        glMatrix.vec4.transformMat4(currCamUp, startCameraUp, xRotMat);
    });

}

function createShapes() {
    var n;
    if (!this.objManager) {
        n = 0;
        this.objManager = new ObjectManager();

        var groundOptions = { width: 1, length: 1, position: [0, 0, 0] };
        this.objManager.createObject("ground", groundOptions);
    }
    while (n <= 5) {
        var randomX = ThreeDLib.random(-0.5, 0.5);
        var randomY = ThreeDLib.random(-0.5, 0.5);
        var cubeOptions = { dimension: 0.1, position: [randomX, randomY, 0.0] };
        this.objManager.createObject("cube", cubeOptions);
        n++;
    }
    return this.objManager;
}

function render(shaderProgram) {
    /* Step1: Prepare the canvas and get WebGL context */
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
    var mvMat = this.sceneControl._getModelViewMat();
    mvMat = glMatrix.mat4.identity(mvMat);

    this.sceneControl.setProjMatPersp(gl, shaderProgram);

    var normalMat = this.sceneControl._getNormalMat();
    var out = glMatrix.mat4.create();
    var mvmInv = glMatrix.mat4.invert(out, this.sceneControl._getModelViewMat());
    normalMat = glMatrix.mat4.transpose(normalMat, mvmInv);

    this.sceneControl.setNormalMat(gl, shaderProgram);

    // Render objects
    var objectsManager = createShapes();
    var objects = objectsManager.objectsArray;
    for (let index = 0; index < objects.length; index++) {
        //if the object exists
        if (objects[index]) {
            objects[index].render(gl, shaderProgram);
        }
    }

    // Animate the cube
    var currentTime = (new Date()).getTime();
    var gameControls = new GameControls(0.1);
    var deltaTimeMilisec = currentTime - lastUpdateTime;
    var velocity = gameControls._getVelocity();
    var deltaY = velocity * deltaTimeMilisec / 1000.0;
    var objectsCount = objects.length;
    for (var i = 0; i < objectsCount; i++) {
        var cube = objectsManager._getObject(i);
        if (cube instanceof Cube && lastUpdateTime > 0.0) {
            if (cube.pos3d[1] <= 0.5 && cube.pos3d[1] >= -0.5) {
                cube.addPositionY(-deltaY);
            } else {
                //objectsManager.deleteObject(i);
                cube.setPositionY(0.5);
            }
        }
    }
    // Update time
    lastUpdateTime = currentTime;

}

function renderLoop() {
    render(shaderProgram);
    window.setTimeout(renderLoop, 1000 / 60);
}

function initWebGL() {
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}

function onLoad() {
    //this.lastUpdateTime = 0.0;
    initWebGL();
    initProgram();
    if (gl) {
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        renderLoop();
    }
}