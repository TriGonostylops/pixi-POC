export function moveEnemies(enemies, assets, getBounds, isWithinBounds, isCollidingWithObstacles, isCollidingWithPlayer, rectangle, sprite, obstacles) {
    enemies.forEach((enemy) => {
        if (!enemy.direction || enemy.stepsRemaining <= 0) {
            enemy.direction = Math.floor(Math.random() * 8);
            enemy.stepsRemaining = 30 + Math.random() * 70;
        }

        const moveDistance = 2;

        switch (enemy.direction) {
            case 0:
                enemy.y -= moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.y += moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.up;
                }
                break;
            case 1: // Move down
                enemy.y += moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.y -= moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.down;
                }
                break;
            case 2: // Move left
                enemy.x -= moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.x += moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.left;
                }
                break;
            case 3: // Move right
                enemy.x += moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.x -= moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.right;
                }
                break;
            case 4: // Move up-left
                enemy.y -= moveDistance;
                enemy.x -= moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.y += moveDistance;
                    enemy.x += moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.upLeft;
                }
                break;
            case 5: // Move up-right
                enemy.y -= moveDistance;
                enemy.x += moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.y += moveDistance;
                    enemy.x -= moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.down;
                }
                break;
            case 6: // Move down-left
                enemy.y += moveDistance;
                enemy.x -= moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.y -= moveDistance;
                    enemy.x += moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.downLeft;
                }
                break;
            case 7:
                enemy.y += moveDistance;
                enemy.x += moveDistance;
                if (
                    !isWithinBounds(getBounds(enemy), getBounds(rectangle)) ||
                    isCollidingWithObstacles(getBounds(enemy), obstacles) ||
                    isCollidingWithObstacles(
                        getBounds(enemy),
                        enemies.filter((e) => e !== enemy)
                    ) ||
                    isCollidingWithPlayer(getBounds(enemy), getBounds(sprite))
                ) {
                    enemy.y -= moveDistance;
                    enemy.x -= moveDistance;
                    enemy.stepsRemaining = 0;
                } else {
                    enemy.texture = assets.grimReaperTextures.stand.downRight;
                }
                break;
        }
        enemy.stepsRemaining--;
    });
}
