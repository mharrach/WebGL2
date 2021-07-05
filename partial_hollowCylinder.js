class PartialHollowCylinder {
    constructor(pos3d, rgb, radiusIn, radiusOut, height, nb_sections, startAngDeg, endAngDeg) {
        this.pos3d = pos3d;
        this.rgb = rgb;
        this.radiusIn = radiusIn;
        this.radiusOut = radiusOut;
        this.height = height;
        this.nb_sections = nb_sections;
        this.startAngDeg = startAngDeg;
        this.endAngDeg = endAngDeg;
    }
    createMesh() {
        var r1 = this.radiusIn;
        var r2 = this.radiusOut;
        var pts = this.nb_sections;
        var segments = pts - 1;
        var startAngRad = this.startAngDeg * Math.PI / 180;
        var endAngRad = this.endAngDeg * Math.PI / 180;
        var sweepAngRad = (endAngRad - startAngRad);
        var incAngRad = sweepAngRad / segments;
        var pointsArray = [];
        var xIn, xOut;
        var yIn, yOut;

        for (let o = 0; o < pts; o++) {
            xOut = r2 * Math.cos(startAngRad + o * incAngRad);
            yOut = r2 * Math.sin(startAngRad + o * incAngRad);

            pointsArray.push(new Point2D(xOut, yOut));
        }

        for (let i = pts - 1; i >= 0; i--) {
            xIn = r1 * Math.cos(startAngRad + i * incAngRad);
            yIn = r1 * Math.sin(startAngRad + i * incAngRad);

            pointsArray.push(new Point2D(xIn, yIn));
        }

        var profile2d = new Profile2D(pointsArray);
        var mesh = GeometryModeler.extrudeProfile(this.pos3d, this.height, profile2d, this.rgb);

        return mesh;
    }
}