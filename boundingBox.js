class BoundingBox {
    constructor(min_x, max_x, min_y, max_y) {
        this.min_x = min_x;
        this.max_x = max_x;
        this.min_y = min_y;
        this.max_y = max_y;
    }
    getDimension() {
        var dim_x = this.max_x - this.min_x;
        var dim_y = this.max_y - this.min_y;

        return { dimX: dim_x, dimY: dim_y };
    }
}