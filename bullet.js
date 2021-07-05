class Bullet {
    constructor(renderableObj, direction, velocity) {
        this.renderableObj = renderableObj;
        this.direction = direction;
        this.velocity = velocity;
    }
    getDirection() {
        return this.direction;
    }
    setDirection(newDir) {
        this.direction = newDir;
    }
    renderObject(gl, shaderProgram) {
        this.renderableObj.render(gl, shaderProgram);
    }
    timeChanged(deltaTimeSec) {
        var velocity = this.velocity;
        var dist = velocity * deltaTimeSec;
        this.renderableObj.addPosition(dist * this.direction[0], dist * this.direction[1], dist * this.direction[2]);
    }
}