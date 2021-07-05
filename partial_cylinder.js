class PartialCylinder {
    constructor(pos3d, rgb, radius, height, nb_sections, startAngDeg, endAngDeg) {
        this.pos3d = pos3d;
        this.rgb = rgb;
        this.radius = radius;
        this.height = height;
        this.nb_sections = nb_sections;
        this.startAngDeg = startAngDeg;
        this.endAngDeg = endAngDeg;
    }
    createMesh() {
        var rad = this.radius;
        var pts = this.nb_sections;
        var segments = pts - 1;
        var startAngRad = this.startAngDeg * Math.PI / 180;
        var endAngRad = this.endAngDeg * Math.PI / 180;
        var sweepAngRad = (endAngRad - startAngRad);
        var incAngRad = sweepAngRad / segments;
        var center = new Point2D(0, 0);
        var pointsArray = [];
        var x;
        var y;

        pointsArray.push(center); // add center point
        for (let i = 0; i < pts; i++) {
            x = rad * Math.cos(startAngRad + i * incAngRad);
            y = rad * Math.sin(startAngRad + i * incAngRad);

            pointsArray.push(new Point2D(x, y));
        }

        var profile2d = new Profile2D(pointsArray);
        var mesh = GeometryModeler.extrudeProfile(this.pos3d, this.height, profile2d, this.rgb);

        return mesh;
    }
}