class Enemy {
    constructor(renderableObj, direction, velocity) {
        this.renderableObj = renderableObj;
        this.direction = direction;
        this.velocity = velocity;

        this.dirChangesArray = [];
        this.init();

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
    init() {
        // calculate the number of direction changes.
        const dirChangesCount = Math.floor(Math.random() * 3);

        for (let i = 0; i < 2; i++) {
            var changeDirMoment = ThreeDLib.random(-0.5, 0.5);
            this.dirChangesArray.push(changeDirMoment);
        }

        this.dirChangesArray = [...this.dirChangesArray].sort((a, b) => a - b);
    }
    timeChanged(deltaTimeSec, gameControl) {
        var velocity = this.velocity;
        var dist = velocity * deltaTimeSec;
        this.renderableObj.addPosition(dist * this.direction[0], dist * this.direction[1], dist * this.direction[2]);
        for (let i = 0; i < this.dirChangesArray.length; i++) {
            const change = this.dirChangesArray[i];
            var pos = this.renderableObj.getPosition();
            if (pos[1].toFixed(1) === change.toFixed(1)) {
                this.direction = gameControl.getRandomDirection();
                this.dirChangesArray.splice(i, 1);
            }
        }
    }
}