class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getModule() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        var module = this.getModule();
        this.x *= 1 / module;
        this.y *= 1 / module;
    }

}
Point2D.getDirFrom2dPoints = function(point2dA, point2dB) {
    var dir = new Point2D(point2dB.x - point2dA.x, point2dB.y - point2dA.y);
    dir.normalize();
    return dir;
}

Point2D.getDistBetweenPoints2D = function(ptA, ptB) {
    return Math.sqrt((ptA.x - ptB.x) * (ptA.x - ptB.x) + (ptA.y - ptB.y) * (ptA.y - ptB.y));
}

Point2D.coincidesPoint = function(ptA, ptB, error) {
    return (Math.abs(ptA.x - ptB.x) < error && Math.abs(ptA.y - ptB.y) < error);
}

Point2D.getAngRadBetweenVectors = function(vectorA, vectorB) {
    var normalSign = Math.sign(ThreeDLib.CrossProduct2D(vectorA, vectorB));
    var dotProd = ThreeDLib.dotProduct2D(vectorA, vectorB);
    var magnitude = ThreeDLib.magnitude2D(vectorA) * ThreeDLib.magnitude2D(vectorB);
    var angRad = normalSign * Math.acos(dotProd / magnitude);
    return angRad;
}