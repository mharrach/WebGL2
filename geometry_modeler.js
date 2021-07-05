class GeometryModeler {
    constructor() {
        //
    }
}
GeometryModeler.extrudeProfile = function(position, h, profile2d, color) {
    var bottomProfile = [];
    var topProfile = [];
    //Mesh array
    var pointsArray = [];
    var len = profile2d.points2dArray.length;
    //Normals
    var normalsArray = [];
    var colorsArray = [];

    //profile 2d to -> 3d bottom profile and 3d top profile
    for (let i = 0; i < len; i++) {
        const point2d = profile2d.points2dArray[i];
        var point3dBottom = new Point(point2d.x, point2d.y, 0);
        var point3dTop = new Point(point2d.x, point2d.y, h);
        bottomProfile.push(point3dBottom);
        topProfile.push(point3dTop);
    }

    //creating the mesh points array for lateral surface
    for (let j = 0; j < len; j++) {

        var currTopPoint = topProfile[j];
        var currBottPoint = bottomProfile[j];

        var nextTopPoint;
        var nextBottPoint;

        if (j === len - 1) {

            nextTopPoint = topProfile[0];
            nextBottPoint = bottomProfile[0];

        } else {

            nextTopPoint = topProfile[j + 1];
            nextBottPoint = bottomProfile[j + 1];

        }

        //first triangle
        pointsArray.push(currBottPoint, nextBottPoint, currTopPoint);
        var normalA = ThreeDLib.getNormalVect(currBottPoint, nextBottPoint, currTopPoint);
        normalsArray.push(normalA, normalA, normalA);
        //second triangle
        pointsArray.push(currTopPoint, nextBottPoint, nextTopPoint);
        var normalB = ThreeDLib.getNormalVect(currTopPoint, nextBottPoint, nextTopPoint);
        normalsArray.push(normalB, normalB, normalB);

        //colors
        for (let index = 0; index < 6; index++) {
            var col = new Color(color[0], color[1], color[2], 1);
            colorsArray.push(col);
        }

    }

    //creating the mesh points array for top and bottom surface
    if (ThreeDLib.isConvex(topProfile)) {

        //top face
        GeometryModeler.createTopFace(topProfile, pointsArray, normalsArray, colorsArray, color);
        //bottom face
        GeometryModeler.createBottomFace(bottomProfile, pointsArray, normalsArray, colorsArray, color);

    } else {

        // top profile
        var topProfilePolygon = new Polygon2D(topProfile);
        var tesselatedTopProfile = [];
        topProfilePolygon.tesselate(tesselatedTopProfile);

        for (let i = 0; i < tesselatedTopProfile.length; i++) {
            var singlePolygonPointsArrayTop = tesselatedTopProfile[i].pointsArray;
            this.createTopFace(singlePolygonPointsArrayTop, pointsArray, normalsArray, colorsArray, color);
        }

        // bottom face
        var bottomProfilePolygon = new Polygon2D(bottomProfile);
        var tesselatedBottomProfile = [];
        bottomProfilePolygon.tesselate(tesselatedBottomProfile);

        for (let j = 0; j < tesselatedBottomProfile.length; j++) {
            var singlePolygonPointsArrayBottom = tesselatedBottomProfile[j].pointsArray;
            this.createBottomFace(singlePolygonPointsArrayBottom, pointsArray, normalsArray, colorsArray, color);
        }

    }

    return new Mesh(position, pointsArray, colorsArray, normalsArray);
}

GeometryModeler.createTopFace = function(topProfile, pointsArray, normalsArray, colorsArray, color) {
    var firstPointTop = topProfile[0];
    for (let k = 1; k < topProfile.length - 1; k++) {

        var secondPointTop = topProfile[k];
        var lastPointTop = topProfile[k + 1];
        pointsArray.push(firstPointTop, secondPointTop, lastPointTop);
        var normal = ThreeDLib.getNormalVect(firstPointTop, secondPointTop, lastPointTop);
        normalsArray.push(normal, normal, normal);

        for (let index = 0; index < 3; index++) {
            var col = new Color(color[0], color[1], color[2], 1);
            colorsArray.push(col);
        }
    }
}

GeometryModeler.createBottomFace = function(bottomProfile, pointsArray, normalsArray, colorsArray, color) {
    var firstPointBottom = bottomProfile[0];
    for (let l = bottomProfile.length - 1; l >= 1; l--) {

        var secondPointBottom = bottomProfile[l];
        var lastPointBottom = bottomProfile[l - 1];
        pointsArray.push(firstPointBottom, secondPointBottom, lastPointBottom);
        var normal = ThreeDLib.getNormalVect(firstPointBottom, secondPointBottom, lastPointBottom);
        normalsArray.push(normal, normal, normal);

        for (let index = 0; index < 3; index++) {
            var col = new Color(color[0], color[1], color[2], 1);
            colorsArray.push(col);
        }
    }
}