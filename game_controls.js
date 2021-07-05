class GameControls {
    constructor() {
        this.avatar = undefined;
        this.bulletsArray = [];
        this.enemiesArray = [];
        this.lastUpdateTime = 0;
        this.leftButton = 0;
        this.rightButton = 0;
        this.spaceButton = 0;

        this.createAvatar();
    }
    getEnemy(index) {
        return this.enemiesArray[index];
    }
    getRandomEnemyType() {
        const randomType = Math.floor(Math.random() * 3);
        if (randomType === 0) {
            return "enemyTypeA";
        } else if (randomType === 1) {
            return "enemyTypeB";
        } else {
            return "enemyTypeC";
        }
    }
    createRandomEnemy() {
        var renderableObj;
        var enemyTypeName = this.getRandomEnemyType();
        var randPos = [ThreeDLib.random(-0.5, 0.5), 0.5, 0];
        var randHeight = 0.015;
        var randColors = [ThreeDLib.random(0, 1), ThreeDLib.random(0, 1), ThreeDLib.random(0, 1)];
        switch (enemyTypeName) {
            case "enemyTypeA":
                renderableObj = new EnemyTypeA(randPos, randColors, randHeight);
                break;
            case "enemyTypeB":
                renderableObj = new EnemyTypeB(randPos, randColors, randHeight);
                break;
            case "enemyTypeC":
                renderableObj = new EnemyTypeC(randPos, randColors, randHeight);
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
        var options = { position: [0, -0.5, 0], rgb: [0.5, 0.5, 0.5], height: 0.015 };
        var renderableObj = new Spaceship(options.position, options.rgb, options.height);
        var avatar = new Avatar(renderableObj);
        this.avatar = avatar;
    }
    renderAvatar(gl, shaderProgram) {
        if (this.avatar != undefined) {
            this.avatar.renderObject(gl, shaderProgram);
        }
    }
    createBullet() {
        var avatarPos = this.avatar.renderableObj.getPosition();
        var bulletPos = [avatarPos[0], avatarPos[1] + 0.1, avatarPos[2]];
        var renderableObj = new Cube(bulletPos, [1, 0, 0], 0.015);
        var direction = [0, 1, 0];
        var velocity = 0.1;
        this.bulletsArray.push(new Bullet(renderableObj, direction, velocity));
    }
    renderBullet(gl, shaderProgram) {
        var bulletsCount = this.bulletsArray.length;
        for (let i = 0; i < bulletsCount; i++) {
            const bullet = this.bulletsArray[i];
            bullet.renderObject(gl, shaderProgram);
        }
    }
    updateEnemyPosition(currentTime) {
        var deltaTimeMilisec = currentTime - this.lastUpdateTime;
        var deltaTimeSec = deltaTimeMilisec / 1000.0;
        var enemies = this.enemiesArray;
        var avatar = this.avatar.renderableObj;
        var avatarBoundingBox = avatar.boundingbox;

        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            var oldDir = enemy.getDirection();
            var enemyBoundingBox = enemy.renderableObj.boundingbox;

            if (this.isObjectInGameZone(enemy.renderableObj)) {

                enemy.timeChanged(deltaTimeSec, this);
                this.updateBulletPosition(currentTime); //!!!!

                if (this.ifObjectHitsWall(enemy.renderableObj)) {
                    enemy.setDirection([-oldDir[0], oldDir[1], oldDir[2]]);
                }

                if (this.testCollision(avatar.getPosition(), enemy.renderableObj.getPosition(), avatarBoundingBox.getDimension(), enemyBoundingBox.getDimension())) {
                    avatar.mesh.setColorsVbo(gl, [1, 0, 0]);
                }

            } else {
                avatar.mesh.setColorsVbo(gl, [0.5, 0.5, 0.5]);
                // enemy dies
                enemy.renderableObj.mesh.deleteVbo();
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
    testCollision(avatarPosition, enemyPosition, avatarBoundingBoxDimensions, enemyBoundingBoxDimensions) {
        return (avatarPosition[0] < enemyPosition[0] + enemyBoundingBoxDimensions.dimX &&
            avatarPosition[0] + avatarBoundingBoxDimensions.dimX > enemyPosition[0] &&
            avatarPosition[1] < enemyPosition[1] + enemyBoundingBoxDimensions.dimY &&
            avatarPosition[1] + avatarBoundingBoxDimensions.dimY > enemyPosition[1]);
    }
    updateBulletPosition(currentTime) {
        var deltaTimeMilisec = currentTime - this.lastUpdateTime;
        var deltaTimeSec = deltaTimeMilisec / 1000.0;
        var bullets = this.bulletsArray;
        for (let i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            var bulletPos = bullet.renderableObj.getPosition();
            if (bulletPos[1] <= 0.5) {

                bullet.timeChanged(deltaTimeSec);

            } else {
                bullet.renderableObj.deleteVbo();
                delete this.bulletsArray[i];
                this.bulletsArray.splice(i, 1);
            }
        }
    }
    updateAvatar() {
        var deltaT = 0;

        // handle the different events
        if (this.leftButton == 1) {
            deltaT = -0.01;
        }
        if (this.rightButton == 1) {
            deltaT = 0.01;
        }
        if (this.spaceButton == 1) {
            this.createBullet();
        }
        if (this.leftButton == 1 && this.spaceButton == 1) {
            deltaT = -0.01;
            this.createBullet();
        } else if (this.rightButton == 1 && this.spaceButton == 1) {
            deltaT = 0.01;
            this.createBullet();
        }

        // make sure that the spaceship doesn't go outside the game boundaries
        if (this.avatar.renderableObj.pos3d[0] >= -0.5 && this.avatar.renderableObj.pos3d[0] <= 0.5) {
            this.avatar.renderableObj.pos3d[0] += deltaT;
        } else if (this.avatar.renderableObj.pos3d[0] < -0.5) {
            this.avatar.renderableObj.pos3d[0] = -0.5;
        } else if (this.avatar.renderableObj.pos3d[0] > 0.5) {
            this.avatar.renderableObj.pos3d[0] = 0.5;
        }

    }
}