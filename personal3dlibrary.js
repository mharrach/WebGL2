var ThreeDLib = function() {

}

ThreeDLib.random = function(min, max) {
    return min + Math.random() * (max - min);
}

ThreeDLib.distance3D = function(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
}

ThreeDLib.getCrossProduct = function(vectorA, vectorB) {
    if (vectorA != undefined && vectorB != undefined) {
        var a = vectorA.x;
        var b = vectorA.y;
        var c = vectorA.z;
        var x = vectorB.x;
        var y = vectorB.y;
        var z = vectorB.z;
        var crossProduct = new Point(b * z - y * c, c * x - a * z, a * y - x * b);
        return crossProduct;
    } else {
        return;
    }
}

ThreeDLib.getVector = function(startPoint, endPoint) {
    if (startPoint === undefined || endPoint === undefined) {
        return;
    }
    var vector = new Point(endPoint.x - startPoint.x, endPoint.y - startPoint.y, endPoint.z - startPoint.z);
    return vector;
}


ThreeDLib.getNormalVect = function(ptA, ptB, ptC) {
    var vectorK = ThreeDLib.getVector(ptA, ptB);
    var vectorL = ThreeDLib.getVector(ptA, ptC);
    var normalVector = ThreeDLib.getCrossProduct(vectorK, vectorL);
    if (normalVector != undefined) {
        var length = normalVector.getLength();
        normalVector.scale(1 / length);
        return normalVector;
    } else {
        return;
    }

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

ThreeDLib.CrossProduct2D = function(vectorA, vectorB) {
    return (vectorA.x * vectorB.y - vectorA.y * vectorB.x);
}

ThreeDLib.dotProduct2D = function(vectorA, vectorB) {
    return (vectorA.x * vectorB.x + vectorA.y * vectorB.y);
}

ThreeDLib.magnitude2D = function(vectorA) {
    return Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
}

ThreeDLib.distance2D = function(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

// Function to check if the polygon is convex or not
ThreeDLib.isConvex = function(points) {

    // count of edges in polygon
    var N = points.length;
    var result = true;

    // Stores direction of cross product
    // of previous traversed edges
    var prev = 0;

    // Stores direction of cross product
    // of current traversed edges
    var curr = 0;

    // Traverse the array
    for (var i = 0; i < N; i++) {

        // Stores three adjacent edges of the polygon
        var temp = [points[i],
            points[(i + 1) % N],
            points[(i + 2) % N]
        ];

        var vectA = new Point2D(points[(i + 1) % N].x - points[i].x, points[(i + 1) % N].y - points[i].y);
        var vectB = new Point2D(points[(i + 2) % N].x - points[i].x, points[(i + 2) % N].y - points[i].y);

        // Update curr
        curr = ThreeDLib.CrossProduct2D(vectA, vectB);

        if (curr != 0) {

            // If direction of cross product of all adjacent edges are not same
            if (curr * prev < 0) {
                result = false;
            } else {
                // Update curr
                prev = curr;
            }
        }
    }
    return result;
}

ThreeDLib.isPolygonCCW = function(polygon) {
    var len = polygon.length;
    var angDegAmount = 0.0;
    var prevPoint;
    var currPoint;
    var nextPoint;
    for (let i = 0; i < len; i++) {
        if (i === 0) {
            prevPoint = polygon[len - 1];
            currPoint = polygon[i];
            nextPoint = polygon[i + 1];
        } else if (i === len - 1) {
            prevPoint = polygon[i - 1];
            currPoint = polygon[i];
            nextPoint = polygon[0];
        } else {
            prevPoint = polygon[i - 1];
            currPoint = polygon[i];
            nextPoint = polygon[i + 1];
        }

        var vectorA = new Point(currPoint.x - prevPoint.x, currPoint.y - prevPoint.y);
        var vectorB = new Point(nextPoint.x - currPoint.x, nextPoint.y - currPoint.y);
        var angRad = Point2D.getAngRadBetweenVectors(vectorA, vectorB);
        var angDeg = angRad * 180 / Math.PI;
        angDegAmount += angDeg;
    }
    return (angDegAmount === 360);
}

ThreeDLib.get2DpointNormal = function(prevPoint, currPoint, nextPoint) {
    var vectorA = new Point(currPoint.x - prevPoint.x, currPoint.y - prevPoint.y);
    var vectorB = new Point(nextPoint.x - currPoint.x, nextPoint.y - currPoint.y);
    var crossProd = ThreeDLib.CrossProduct2D(vectorA, vectorB);
    return Math.sign(crossProd);
}

ThreeDLib.getNextIdx = function(curIdx, arrayLenth) {
    var nextIdx = -1;

    if (curIdx === arrayLenth - 1) {
        nextIdx = 0;
    } else {
        nextIdx = curIdx + 1;
    }

    return nextIdx;
}

ThreeDLib.getPrevIdx = function(curIdx, arrayLenth) {
    var prevIdx = -1;

    if (curIdx === 0) {
        prevIdx = arrayLenth - 1;
    } else {
        prevIdx = curIdx - 1;
    }

    return prevIdx;
}