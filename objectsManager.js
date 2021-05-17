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