class Segment2D {
    constructor(pt2dA, pt2dB) {
        this.ptA = pt2dA;
        this.ptB = pt2dB;
    }
    getLine2d() {
        var line = new Line2D();
        line.setBy2Points(this.ptA, this.ptB);
        return line;
    }
    getLength() {
        return Point2D.getDistBetweenPoints2D(this.ptA, this.ptB);
    }
    isPoint2DInside(intersectionPt) {
        var totalDist = this.getLength();
        var distA = Point2D.getDistBetweenPoints2D(this.ptA, intersectionPt);
        var distB = Point2D.getDistBetweenPoints2D(this.ptB, intersectionPt);
        var error = 1e-8;

        if (Math.abs(totalDist - (distA + distB)) < error) {
            return true;
        }
        return false;
    }
    getRelativePositionOfSegment2D(seg2d_B) {
        //this is segment A
        var lineA = this.getLine2d();
        var lineB = seg2d_B.getLine2d();
        var intersectionPt = lineA.intersectsWithLine(lineB);
        var result;

        // if 2 points from the segments coincide
        if (Point2D.coincidesPoint(seg2d_B.ptA, this.ptA, 1e-8) || Point2D.coincidesPoint(seg2d_B.ptB, this.ptB, 1e-8) ||
            Point2D.coincidesPoint(seg2d_B.ptA, this.ptB, 1e-8) || Point2D.coincidesPoint(seg2d_B.ptB, this.ptA, 1e-8)) {
            result = Case.relativePosition2D.POINTS_COINCIDENT;
        }
        // else if a segment's point is inside the other
        else if (this.isPoint2DInside(seg2d_B.ptA) || this.isPoint2DInside(seg2d_B.ptB) ||
            seg2d_B.isPoint2DInside(this.ptA) || seg2d_B.isPoint2DInside(this.ptB)) {
            result = Case.relativePosition2D.A_POINT_INSIDE_SEG;
        }
        //if none of the above cases
        else {
            if (intersectionPt) {
                // check if the intersection point is not outside
                if (this.isPoint2DInside(intersectionPt) && seg2d_B.isPoint2DInside(intersectionPt)) {
                    result = Case.relativePosition2D.INTERSECTION;
                }
                // if it's outside consider there is no intersection
                else {
                    result = Case.relativePosition2D.NO_INTERSECTION;
                }
            } else {
                result = Case.relativePosition2D.NO_INTERSECTION;
            }
        }

        return result;
    }
}