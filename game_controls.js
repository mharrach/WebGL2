class GameControls {
    constructor(velocity) {
        this.velocity = velocity;
    }
    _getVelocity() {
        return this.velocity;
    }
    setVelocity(newVelocityValue) {
        this.velocity = newVelocityValue;
    }
}