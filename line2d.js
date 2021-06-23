class Line2D {
    constructor() {
        this.point2d = undefined;
        this.direction = undefined;
    }
    setByPointAndDir(point2d, direction) {
        this.point2d = point2d;
        this.direction = direction;
    }
    setBy2Points(point2d_A, point2d_B) {
        var dir = Point2D.getDirFrom2dPoints(point2d_A, point2d_B);
        this.setByPointAndDir(point2d_A, dir);
    }
    intersectsWithLine(line2d) {
        var lineA = this;
        var lineB = line2d;

        var dirA = lineA.direction;
        var dirB = lineB.direction;

        var ptA = lineA.point2d;
        var ptB = lineB.point2d;

        var dirAxdirB = ThreeDLib.CrossProduct2D(dirA, dirB); // cross product
        var dotProd = dirAxdirB * dirAxdirB; // dot product

        // if (dirA x dirB = 0) then dirA and dirB are parallel
        if (dotProd === 0) {
            return false;
        }

        // calculate (ptB - ptA) x dirB
        var vectAB = new Point2D(ptB.x - ptA.x, ptB.y - ptA.y);
        var b = ThreeDLib.CrossProduct2D(vectAB, dirB);

        // calculate (b.dirAxdirB)/(dirAxdirB.dirAxdirB)
        var a = b * dirAxdirB / dotProd;

        // find intersection point by replacing a in Line A equation
        var result = new Point2D(ptA.x + (a * dirA.x), ptA.y + (a * dirA.y));

        return result;
    }
}