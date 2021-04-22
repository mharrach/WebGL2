var ThreeDLib = function() {

}

ThreeDLib.getCrossProduct = function(vectorA, vectorB) {
    var a = vectorA.x;
    var b = vectorA.y;
    var c = vectorA.z;
    var x = vectorB.x;
    var y = vectorB.y;
    var z = vectorB.z;
    var crossProduct = new Point(b * z - y * c, c * x - a * z, a * y - x * b);
    return crossProduct;
}

ThreeDLib.getVector = function(startPoint, endPoint) {
    if (startPoint === undefined || endPoint === undefined) {
        var hola = 0;
    }
    var vector = new Point(endPoint.x - startPoint.x, endPoint.y - startPoint.y, endPoint.z - startPoint.z);
    return vector;
}


ThreeDLib.getNormalVect = function(ptA, ptB, ptC) {
    var vectorK = ThreeDLib.getVector(ptA, ptB);
    var vectorL = ThreeDLib.getVector(ptA, ptC);
    var normalVector = ThreeDLib.getCrossProduct(vectorK, vectorL);
    var length = normalVector.getLength();
    normalVector.scale(1 / length);
    return normalVector;
}