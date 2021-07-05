class Spaceship {
    constructor(pos3d, rgb, height) {
        this.pos3d = pos3d;
        this.rgb = rgb;
        this.height = height;
        this.mesh = undefined;
        this.boundingbox = undefined;
        this.createMesh();
    }
    createMesh() {
        var p1 = new Point2D(0, -0.5);
        var p2 = new Point2D(0.5, 0.5);
        var p3 = new Point2D(1, 1);
        var p4 = new Point2D(1, -0.5);
        var p5 = new Point2D(1.5, 0.5);
        var p6 = new Point2D(1.5, 1.5);
        var p7 = new Point2D(1, 1.5);
        var p8 = new Point2D(0.5, 2);
        var p9 = new Point2D(-0.5, 2);
        var p10 = new Point2D(-1, 1.5);
        var p11 = new Point2D(-1.5, 1.5);
        var p12 = new Point2D(-1.5, 0.5);
        var p13 = new Point2D(-1, -0.5);
        var p14 = new Point2D(-1, 1);
        var p15 = new Point2D(-0.5, 0.5);

        var pointsArray = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15];

        // reduce size
        for (let i = 0; i < pointsArray.length; i++) {
            pointsArray[i].x *= 0.04;
            pointsArray[i].y *= 0.04;
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