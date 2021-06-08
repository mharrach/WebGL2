class Avatar {
    constructor(renderableObj) {
        this.renderableObj = renderableObj;
    }
    renderObject(gl, shaderProgram) {
        this.renderableObj.render(gl, shaderProgram);
    }
}