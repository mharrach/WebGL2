class Polygon2D {
    constructor(pointsArray) {
        this.pointsArray = pointsArray;
    }
    getSegment2d(index) {
        var currPt = this.pointsArray[index];
        var nextPt = this.pointsArray[ThreeDLib.getNextIdx(index, this.pointsArray.length)];
        return new Segment2D(currPt, nextPt);
    }
    getPolygonNormals() {
        var len = this.pointsArray.length;
        var prevPoint;
        var currPoint;
        var nextPoint;
        var normalsList = [];
        for (let i = 0; i < len; i++) {

            var nextIdx = ThreeDLib.getNextIdx(i, len);
            var prevIdx = ThreeDLib.getPrevIdx(i, len);
            prevPoint = this.pointsArray[prevIdx];
            currPoint = this.pointsArray[i];
            nextPoint = this.pointsArray[nextIdx];

            var normal = ThreeDLib.get2DpointNormal(prevPoint, currPoint, nextPoint);
            normalsList.push(normal);
        }
        return normalsList;
    }
    getConcavePointIndexArray() {
        var normalsArray = this.getPolygonNormals(this.pointsArray);
        var concavePtsIndices = [];

        // Store the concave points indices
        for (let i = 0; i < normalsArray.length; i++) {
            const element = normalsArray[i];
            // if concave point
            if (element < 0) {
                concavePtsIndices.push(i);
            }
        }

        return concavePtsIndices;
    }
    _findPositionInsideSortedDictionary(data, dictionary) {
        var resultIdx = -1;
        var elemsCount = dictionary.length;
        var foundTargetValue = false;
        for (var i = 0; i < elemsCount; i++) {
            if (dictionary[i].value > data.value) {
                resultIdx = i;
                foundTargetValue = true;
                break;
            }
        }

        if (!foundTargetValue) {
            resultIdx = dictionary.length;
        }
        return resultIdx;
    }
    _insertValueSortByDist(data, dictionary) {
        if (dictionary.length === 0) {
            dictionary.push(data);
        } else {
            var idx = this._findPositionInsideSortedDictionary(data, dictionary);
            dictionary.splice(idx, 0, data);
        }
    }

    getNearToFarPointsSkipAdjacents(pointIdx) {
        var nearToFarPtsArr = [];
        var concavePoint = this.pointsArray[pointIdx];
        var dict = [];

        var currIndex = pointIdx;
        var nextIndex = ThreeDLib.getNextIdx(pointIdx, this.pointsArray.length);
        var prevIndex = ThreeDLib.getPrevIdx(pointIdx, this.pointsArray.length);

        for (let k = 0; k < this.pointsArray.length; k++) {

            //skip adjacent points
            if (k != currIndex && k != prevIndex && k != nextIndex) {
                var convexePoint = this.pointsArray[k]
                var dist = ThreeDLib.distance2D(concavePoint, convexePoint);
                var data = {
                    key: k,
                    value: dist
                }
                this._insertValueSortByDist(data, dict);

            }
        }

        for (let l = 0; l < dict.length; l++) {
            var value = dict[l].key;
            nearToFarPtsArr.push(value);
        }

        return nearToFarPtsArr;
    }
    intersectsWithSegment2D(newSegment) {
        var len = this.pointsArray.length;
        var resultsList = [];
        for (let i = 0; i < len; i++) {
            var existantSegment = this.getSegment2d(i);
            var result = newSegment.getRelativePositionOfSegment2D(existantSegment);
            // check if the two segments intersect
            resultsList.push(result);
        }

        return resultsList;
    }
    isSegmentValidToSplitPolygon(newSegment) {
        var resultsList = this.intersectsWithSegment2D(newSegment);
        for (let i = 0; i < resultsList.length; i++) {
            if (resultsList[i] === 0 || resultsList[i] === 3) {
                return true;
            }
        }
        return false;
    }
    splitIntoPolygonsUsingIndices(indxA, indxB) {
        var listOfPolygons = [];
        var pointsArrayA = [];
        var pointsArrayB = [];
        for (let i = 0; i < this.pointsArray.length; i++) {
            if (i >= indxA && i <= indxB) {
                pointsArrayA.push(this.pointsArray[i]);
            }
            if (i <= indxA || i >= indxB) {
                pointsArrayB.push(this.pointsArray[i]);
            }
        }
        var polygonA = new Polygon2D(pointsArrayA);
        var polygonB = new Polygon2D(pointsArrayB);
        listOfPolygons.push(polygonA, polygonB);
        return listOfPolygons;
    }
    getConvexPolygons(polygonsList, resultTessellatedPolygons) {
        //var polygons = [];
        for (let i = 0; i < polygonsList.length; i++) {
            var pointsArray = polygonsList[i].pointsArray;
            if (ThreeDLib.isPolygonCCW(pointsArray) && ThreeDLib.isConvex(pointsArray)) {
                //polygons.push(polygonsList[i]);
                resultTessellatedPolygons.push(polygonsList[i]);
            } else {
                polygonsList[i].tesselate(resultTessellatedPolygons);
            }
        }
        //return polygons;
    }
    tesselate(resultTessellatedPolygons) {
        // 1rst, take concave points array.
        var concPtIndices = this.getConcavePointIndexArray();

        // if concave points exist
        if (concPtIndices.length != 0) {
            var concPtIndex = concPtIndices[0];
            var concPt = this.pointsArray[concPtIndex];
            var nearestPtsIdx = this.getNearToFarPointsSkipAdjacents(concPtIndex);
        } else {
            resultTessellatedPolygons.push(this);
            return resultTessellatedPolygons;
        }

        if (nearestPtsIdx) {
            for (let i = 0; i < nearestPtsIdx.length; i++) {
                var index = nearestPtsIdx[i];
                var newSegment = new Segment2D(concPt, this.pointsArray[index]);
                if (this.isSegmentValidToSplitPolygon(newSegment)) {
                    var polygons = this.splitIntoPolygonsUsingIndices(concPtIndex, index);
                    this.getConvexPolygons(polygons, resultTessellatedPolygons);
                    break;
                }
            }
        }


    }
}