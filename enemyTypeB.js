class EnemyTypeB {
    constructor(pos3d, rgb, height) {
        this.pos3d = pos3d;
        this.rgb = rgb;
        this.height = height;
        this.mesh = undefined;
        this.boundingbox = undefined;
        this.createMesh();
    }
    createMesh() {
        var p1 = new Point2D(0.5, 0);
        var p2 = new Point2D(0.5, -0.5);
        var p3 = new Point2D(1.5, -0.5);
        var p4 = new Point2D(1.5, 1);
        var p5 = new Point2D(2, 1);
        var p6 = new Point2D(2, 0);
        var p7 = new Point2D(2.5, 0);
        var p8 = new Point2D(2.5, 1);
        var p9 = new Point2D(1.5, 2);
        var p10 = new Point2D(2, 3);
        var p11 = new Point2D(1, 2);
        var p12 = new Point2D(-1, 2);
        var p13 = new Point2D(-2, 3);
        var p14 = new Point2D(-1.5, 2);
        var p15 = new Point2D(-2.5, 1);
        var p16 = new Point2D(-2.5, 0);
        var p17 = new Point2D(-2, 0);
        var p18 = new Point2D(-2, 1);
        var p19 = new Point2D(-1.5, 1);
        var p20 = new Point2D(-1.5, -0.5);
        var p21 = new Point2D(-0.5, -0.5);
        var p22 = new Point2D(-0.5, 0);
        var p23 = new Point2D(-1, 0);
        var p24 = new Point2D(-1, 0.5);
        var p25 = new Point2D(1, 0.5);
        var p26 = new Point2D(1, 0);

        var pointsArray = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26];

        // reduce size
        for (let i = 0; i < pointsArray.length; i++) {
            pointsArray[i].x *= 0.025;
            pointsArray[i].y *= 0.025;
        }

        var profile2d = new Profile2D(pointsArray);

        this.mesh = GeometryModeler.extrudeProfile(this.pos3d, this.height, profile2d, this.rgb);
        this.boundingbox = profile2d.getBoundingBox();
    }

    render(gl, shaderProgram) {
        if (this.mesh != undefined) {
            this.mesh.render(gl, shaderProgram);
        }
    }
    getPosition() {
        return this.pos3d;
    }
    addPosition(x, y, z) {
        this.pos3d[0] += x;
        this.pos3d[1] += y;
        this.pos3d[2] += z;
    }
    setPositionX(newPositionX) {
        this.pos3d[0] = newPositionX;
    }
    setPositionY(newPositionY) {
        this.pos3d[1] = newPositionY;
    }
    setPositionZ(newPositionZ) {
        this.pos3d[2] = newPositionZ;
    }
}