class Profile2D {
    constructor(points2dArray) {
        this.points2dArray = points2dArray;
    }
    getBoundingBox() {
        var xList = [];
        var yList = [];
        var min_x, max_x;
        var min_y, max_y;

        for (let i = 0; i < this.points2dArray.length; i++) {
            xList.push(this.points2dArray[i].x);
            yList.push(this.points2dArray[i].y);
        }

        max_x = Math.max(...xList);
        min_x = Math.min(...xList);
        max_y = Math.max(...yList);
        min_y = Math.min(...yList);

        return new BoundingBox(min_x, max_x, min_y, max_y);
    }
}