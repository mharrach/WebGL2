class GameControls {
    constructor() {
        this.avatar = undefined;
        this.enemiesArray = [];
        this.lastUpdateTime = 0;

        this.createAvatar();
    }
    getEnemy(index) {
        return this.enemiesArray[index];
    }
    getRandomEnemyType() {
        const randomType = Math.floor(Math.random() * 3);
        if (randomType === 0) {
            return "cube";
        } else if (randomType === 1) {
            return "cylinder";
        } else {
            return "cone";
        }
    }
    createRandomEnemy() {
        var renderableObj;
        var enemyTypeName = this.getRandomEnemyType();
        var randDimension = 0.05;
        var randPos = [ThreeDLib.random(-0.5, 0.5), 0.5, 0];
        var randRadius = 0.025;
        var randHeight = 0.08;
        var randPointsCount = 12;
        var randColors = [ThreeDLib.random(0, 1), ThreeDLib.random(0, 1), ThreeDLib.random(0, 1)];
        switch (enemyTypeName) {
            case "cube":
                renderableObj = new Cube(randDimension, randPos);
                break;
            case "cylinder":
                renderableObj = new Cylinder(randPos, randRadius, randHeight, randPointsCount, randColors);
                break;
            case "cone":
                renderableObj = new Cone(randPos, randRadius, randHeight, randPointsCount);
                break;
            default:
                break;
        }
        return renderableObj;
    }
    createEnemy(options) {
        var renderableObj;
        var direction;
        var velocity = 0.1;
        if (options) {
            // check options.
            if (options.renderableObj) {
                renderableObj = options.renderableObj;
            } else {
                renderableObj = this.createRandomEnemy();
            }
            if (options.direction) {
                direction = options.direction;
            } else {
                direction = this.getRandomDirection();
            }
        } else {
            renderableObj = this.createRandomEnemy();
            direction = this.getRandomDirection();
        }
        var newEnemy = new Enemy(renderableObj, direction, velocity);

        this.enemiesArray.push(newEnemy);
    }
    renderEnemy(gl, shaderProgram) {
        var enemyCount = this.enemiesArray.length;
        for (let i = 0; i < enemyCount; i++) {
            const enemy = this.enemiesArray[i];
            enemy.renderObject(gl, shaderProgram);
        }
    }
    createAvatar() {
        var arrowOptions = { position: [0, -0.5, 0], height: 0.03, width: 0.06, length: 0.05, arrowLen: 0.03 };
        var renderableObj = new Arrow(arrowOptions.position, arrowOptions.height, arrowOptions.width, arrowOptions.length, arrowOptions.arrowLen);
        var avatar = new Avatar(renderableObj);
        this.avatar = avatar;
    }
    renderAvatar(gl, shaderProgram) {
        if (this.avatar != undefined) {
            this.avatar.renderObject(gl, shaderProgram);
        }
    }
    updateEnemyPosition(currentTime) {
        var deltaTimeMilisec = currentTime - this.lastUpdateTime;
        var deltaTimeSec = deltaTimeMilisec / 1000.0;
        var enemies = this.enemiesArray;
        var avatar = this.avatar.renderableObj;
        var avatarRadius = avatar.length / 2 + avatar.arrowHeadLen;
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            var oldDir = enemy.getDirection();
            var enemyBoudingSphereRadius = enemy.renderableObj.dimension / Math.sqrt(2) || enemy.renderableObj.radius;

            if (this.isObjectInGameZone(enemy.renderableObj)) {

                enemy.timeChanged(deltaTimeSec, this);

                if (this.ifObjectHitsWall(enemy.renderableObj)) {
                    enemy.setDirection([-oldDir[0], oldDir[1], oldDir[2]]);
                }

                if (this.testCollision(enemy.renderableObj.getPosition(), avatar.getPosition(), enemyBoudingSphereRadius, avatarRadius)) {
                    avatar.setColorsVbo(gl, [1, 0, 0]);
                }

            } else {
                avatar.setColorsVbo(gl, [0.1, 0.2, 0.3]);
                // enemy dies
                enemy.renderableObj.deleteVbo();
                delete this.enemiesArray[i];
                this.enemiesArray.splice(i, 1);
            }
        }

        var enemiesCount = enemies.length;
        if (enemiesCount < 6) {
            this.createEnemy();
        }

        // Update time
        this.lastUpdateTime = currentTime;
    }
    isObjectInGameZone(object) {
        var position = object.getPosition();
        return (position[1] <= 0.5 && position[1] >= -0.5 && position[0] <= 0.5 && position[0] >= -0.5);
    }
    ifObjectHitsWall(object) {
        var position = object.getPosition();
        var radius = object.radius || object.dimension;
        return (0.5 - position[0] <= radius || position[0] + 0.5 <= radius);
    }
    getRandomDirection() {
        return [Math.sin(ThreeDLib.random(-Math.PI, Math.PI)), -1, 0];
    }
    testCollision(firstObjectPosition, secondObjectPosition, firstObjectBoundingSphereRadius, secondObjectBoundingSphereRadius) {
        var distance = ThreeDLib.distance3D(firstObjectPosition[0], firstObjectPosition[1], firstObjectPosition[2], secondObjectPosition[0], secondObjectPosition[1], secondObjectPosition[2]);
        return (distance <= (firstObjectBoundingSphereRadius + secondObjectBoundingSphereRadius));
    }
}