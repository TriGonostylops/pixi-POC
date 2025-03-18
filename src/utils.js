export function getBounds(obj) {
    return {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
    };
}

export function isWithinBounds(spriteBounds, rectBounds) {
    return (
        spriteBounds.x >= rectBounds.x &&
        spriteBounds.x + spriteBounds.width <= rectBounds.x + rectBounds.width &&
        spriteBounds.y >= rectBounds.y &&
        spriteBounds.y + spriteBounds.height <= rectBounds.y + rectBounds.height
    );
}

export function isCollidingWithObstacles(spriteBounds, obstacles) {
    return obstacles.some((obstacle) => {
        const obstacleBounds = getBounds(obstacle);
        return (
            spriteBounds.x < obstacleBounds.x + obstacleBounds.width &&
            spriteBounds.x + spriteBounds.width > obstacleBounds.x &&
            spriteBounds.y < obstacleBounds.y + obstacleBounds.height &&
            spriteBounds.y + spriteBounds.height > obstacleBounds.y
        );
    });
}

export function isCollidingWithPlayer(enemyBounds, playerBounds) {
    return (
        enemyBounds.x < playerBounds.x + playerBounds.width &&
        enemyBounds.x + enemyBounds.width > playerBounds.x &&
        enemyBounds.y < playerBounds.y + playerBounds.height &&
        enemyBounds.y + enemyBounds.height > playerBounds.y
    );
}
