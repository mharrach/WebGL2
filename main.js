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

function initMyProgram() {
    var that = this;
    if (!this.sceneControl) {
        var camPos = [0, -0.6, 0.6];
        var camDir = glMatrix.vec4.fromValues(0, 1, 0, 1);
        var camUp = glMatrix.vec4.fromValues(0, 0, 1, 1);
        var camFovyRad = Math.PI / 2;
        var cameraInit = new Camera(camPos, camDir, camUp, camFovyRad);
        this.sceneControl = new SceneController(canvas.width, canvas.height, cameraInit);

        var pitchRadInit = -45 * Math.PI / 180;
        this.sceneControl.camera.setRotation(0, pitchRadInit, 0);
    }

    canvas.addEventListener("wheel", event => {
        var camDirection = that.sceneControl.camera.getDirection();
        const delta = -Math.sign(event.deltaY) / 50;
        that.sceneControl.camera.position[0] += delta * camDirection[0];
        that.sceneControl.camera.position[1] += delta * camDirection[1];
        that.sceneControl.camera.position[2] += delta * camDirection[2];
    });

    var isDown;
    var currentX;
    var currentY;
    var initialX;
    var initialY;

    canvas.addEventListener('mousedown', function(e) {
        isDown = true;
        initialX = e.clientX;
        initialY = e.clientY;
        var startCamera = that.sceneControl.startCamera;
        startCamera.copyFromCamera(that.sceneControl.camera);
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
            var pitchRad = -deltaY * Math.PI / 180;
            // Heading
            var headingRad = -deltaX * Math.PI / 180;
            // Apply rotation
            var camera = that.sceneControl.camera;
            camera.copyFromCamera(that.sceneControl.startCamera);

            camera.setRotation(headingRad, pitchRad, 0);
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
        var avatar = that.gameControls.avatar;
        switch (event.key) {
            case "ArrowLeft":
                deltaT = -0.01;
                break;
            case "ArrowRight":
                deltaT = 0.01;
                break;
        }
        avatar.renderableObj.pos3d[0] += deltaT;

        event.preventDefault();
    }, true);

}

function createShapes() {
    if (!this.objManager) {
        this.objManager = new ObjectManager();

        var groundOptions = { width: 1, length: 1, position: [0, 0, 0] };
        this.objManager.createObject("ground", groundOptions);
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

    /*****************************Scene render*****************************/

    // Render ground
    var objectsManager = createShapes();
    var objects = objectsManager.objectsArray;
    for (let index = 0; index < objects.length; index++) {
        //if the object exists
        if (objects[index]) {
            objects[index].render(gl, shaderProgram);
        }
    }

    // Cube animation
    var currentTime = (new Date()).getTime();
    this.gameControls.updateEnemyPosition(currentTime);

    // render
    this.gameControls.renderAvatar(gl, shaderProgram);
    this.gameControls.renderEnemy(gl, shaderProgram);


    /**********************************************************************/
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

function initMyGame() {
    if (!this.gameControls) {
        this.gameControls = new GameControls();
    }
}

function onLoad() {
    initWebGL();
    initMyProgram();
    initMyGame();
    if (gl) {
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        renderLoop();
    }
}