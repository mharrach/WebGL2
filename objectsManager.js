class ObjectManager {
    constructor() {
        this.objectsArray = [];
    }
    createObject(objectNameType, options) {
        switch (objectNameType) {
            case "cube":
                var dimension = options.dimension;
                var position = options.position;
                var cube = new Cube(dimension, position);
                this.objectsArray.push(cube);
                return cube;

            case "ground":
                var width = options.width;
                var length = options.length;
                var position = options.position;
                var ground = new Ground(position, width, length);
                this.objectsArray.push(ground);
                return ground;

            case "cylinder":
                var position = options.position;
                var radius = options.radius;
                var height = options.height;
                var nbSections = options.nbSections;
                var rgb = options.rgb;
                var cylinder = new Cylinder(position, radius, height, nbSections, rgb);
                this.objectsArray.push(cylinder);
                return cylinder;

            default:
                break;
        }
    }
    _getObject(index) {
        return this.objectsArray[index];
    }
    deleteObject(index) {
        delete this.objectsArray[index];
        this.objectsArray.splice(index, 1);
    }
}