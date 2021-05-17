var ThreeDLib = function() {

}

ThreeDLib.random = function(min, max) {
    return min + Math.random() * (max - min);
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


ThreeDLib.checkLineIntersection = function(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {

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
}