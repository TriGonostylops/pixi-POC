import {getBounds, isWithinBounds, isCollidingWithObstacles} from "../utils";

export function handlePlayerMovement(sprite, assets, obstacles, enemies) {
    const speed = 3;
    const diagonalSpeed = speed / Math.sqrt(2);
    const keys = {};
    let frame = 0;
    let lastDirection = "down";
    const frameRate = 5;

    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });

    return function updatePlayer(rectangleBounds) {
        let moving = false;
        let diagonal = false;

        if ((keys["w"] || keys["ArrowUp"]) && (keys["a"] || keys["ArrowLeft"])) {
            sprite.y -= diagonalSpeed;
            sprite.x -= diagonalSpeed;
            if (
                !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                isCollidingWithObstacles(getBounds(sprite), enemies)
            ) {
                sprite.y += diagonalSpeed;
                sprite.x += diagonalSpeed;
            } else {
                sprite.texture =
                    assets.textures.upLeft[
                    Math.floor(frame / frameRate) % assets.textures.upLeft.length
                        ];
                lastDirection = "upLeft";
                diagonal = true;
                moving = true;
            }
        }
        if ((keys["w"] || keys["ArrowUp"]) && (keys["d"] || keys["ArrowRight"])) {
            sprite.y -= diagonalSpeed;
            sprite.x += diagonalSpeed;
            if (
                !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                isCollidingWithObstacles(getBounds(sprite), enemies)
            ) {
                sprite.y += diagonalSpeed;
                sprite.x -= diagonalSpeed;
            } else {
                sprite.texture =
                    assets.textures.upRight[
                    Math.floor(frame / frameRate) % assets.textures.upRight.length
                        ];
                lastDirection = "upRight";
                diagonal = true;
                moving = true;
            }
        }
        if ((keys["s"] || keys["ArrowDown"]) && (keys["a"] || keys["ArrowLeft"])) {
            sprite.y += diagonalSpeed;
            sprite.x -= diagonalSpeed;
            if (
                !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                isCollidingWithObstacles(getBounds(sprite), enemies)
            ) {
                sprite.y -= diagonalSpeed;
                sprite.x += diagonalSpeed;
            } else {
                sprite.texture =
                    assets.textures.downLeft[
                    Math.floor(frame / frameRate) % assets.textures.downLeft.length
                        ];
                lastDirection = "downLeft";
                diagonal = true;
                moving = true;
            }
        }
        if ((keys["s"] || keys["ArrowDown"]) && (keys["d"] || keys["ArrowRight"])) {
            sprite.y += diagonalSpeed;
            sprite.x += diagonalSpeed;
            if (
                !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                isCollidingWithObstacles(getBounds(sprite), enemies)
            ) {
                sprite.y -= diagonalSpeed;
                sprite.x -= diagonalSpeed;
            } else {
                sprite.texture =
                    assets.textures.downRight[
                    Math.floor(frame / frameRate) % assets.textures.downRight.length
                        ];
                lastDirection = "downRight";
                diagonal = true;
                moving = true;
            }
        }

        if (!diagonal) {
            if (keys["w"] || keys["ArrowUp"]) {
                sprite.y -= speed;
                if (
                    !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                    isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                    isCollidingWithObstacles(getBounds(sprite), enemies)
                ) {
                    sprite.y += speed;
                } else {
                    sprite.texture =
                        assets.textures.up[Math.floor(frame / frameRate) % assets.textures.up.length];
                    lastDirection = "up";
                    moving = true;
                }
            }
            if (keys["s"] || keys["ArrowDown"]) {
                sprite.y += speed;
                if (
                    !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                    isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                    isCollidingWithObstacles(getBounds(sprite), enemies)
                ) {
                    sprite.y -= speed;
                } else {
                    sprite.texture =
                        assets.textures.down[Math.floor(frame / frameRate) % assets.textures.down.length];
                    lastDirection = "down";
                    moving = true;
                }
            }
            if (keys["a"] || keys["ArrowLeft"]) {
                sprite.x -= speed;
                if (
                    !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                    isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                    isCollidingWithObstacles(getBounds(sprite), enemies)
                ) {
                    sprite.x += speed;
                } else {
                    sprite.texture =
                        assets.textures.left[Math.floor(frame / frameRate) % assets.textures.left.length];
                    lastDirection = "left";
                    moving = true;
                }
            }
            if (keys["d"] || keys["ArrowRight"]) {
                sprite.x += speed;
                if (
                    !isWithinBounds(getBounds(sprite), rectangleBounds) ||
                    isCollidingWithObstacles(getBounds(sprite), obstacles) ||
                    isCollidingWithObstacles(getBounds(sprite), enemies)
                ) {
                    sprite.x -= speed;
                } else {
                    sprite.texture =
                        assets.textures.right[
                        Math.floor(frame / frameRate) % assets.textures.right.length
                            ];
                    lastDirection = "right";
                    moving = true;
                }
            }
        }

        if (moving) {
            frame++;
        } else {
            sprite.texture = assets.textures.stand[lastDirection];
        }
    };
}
