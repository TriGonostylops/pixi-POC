import {
  Application,
  Assets,
  Graphics,
  Text,
  TextStyle,
  TilingSprite,
  Sprite,
} from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { loadAssets } from "./assets"

try {
  console.log("Initializing PixiJS application...");

  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x4169e1,
  });

  initDevtools({ app });
  const assets = await loadAssets();

  app.canvas.style.position = "absolute";
  console.log("PixiJS application initialized:", app);
  const font = await Assets.load("fonts/PressStart2P-Regular.ttf");

  const style = new TextStyle({
    fill: 0xffffff,
    fontSize: 48,
    fontFamily: font.family,
  });
  const buttonStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 24,
    fontFamily: font.family,
  });
  const text = new Text({
    text: "404 - Exit Not Found",
    style,
  });

  text.x = 110;
  text.y = 60;
  app.stage.addChild(text);

  const rectX = 255;
  const rectY = 200;
  const rectWidth = 750;
  const rectHeight = 500;

  const rectangle = new Graphics()
    .rect(0, 0, rectWidth, rectHeight)
    .fill({
      color: 0x1099bb,
      alpha: 0.9,
    })
    .stroke({
      width: 8,
      color: 0xffffff,
    });
  rectangle.x = rectX;
  rectangle.y = rectY;
  app.stage.addChild(rectangle);
  console.log("Rectangle added to stage.");

  const floorTexture = await Assets.load("images/ground.jpg");
  const tilingSprite = new TilingSprite(floorTexture, rectWidth, rectHeight);
  tilingSprite.x = rectX;
  tilingSprite.y = rectY;
  tilingSprite.tileScale.set(0.06, 0.06);
  // We may use skew to simulate a 3D effect
  // tilingSprite.skew.x = 0.5;

  app.stage.addChild(tilingSprite);

  const sprite = new Sprite(assets.textures.down);
  sprite.x = 400;
  sprite.y = 300;
  sprite.scale.set(2, 2);
  app.stage.addChild(sprite);
  console.log("Sprite added to stage.");

  document.body.appendChild(app.canvas);
  console.log("Canvas appended to document body.");

  // Function to get bounds of a display object
  function getBounds(obj) {
    return {
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
    };
  }

  // Function to check if the sprite is within the rectangle bounds
  function isWithinBounds(spriteBounds, rectBounds) {
    return (
      spriteBounds.x >= rectBounds.x &&
      spriteBounds.x + spriteBounds.width <= rectBounds.x + rectBounds.width &&
      spriteBounds.y >= rectBounds.y &&
      spriteBounds.y + spriteBounds.height <= rectBounds.y + rectBounds.height
    );
  }

  // Implement movement for the sprite
  const speed = 3;
  const diagonalSpeed = speed / Math.sqrt(2); // Adjust speed for diagonal movement
  const keys = {};
  let frame = 0;
  let lastDirection = "down";
  const frameRate = 5; // Adjust frame rate

  window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  const obstacles = [];
  const enemies = [];

  const button = new Text({text: "Generate obstacle", style: buttonStyle});
  button.x = rectX + rectWidth + 20; // Move to the right side of the rectangle
  button.y = rectY;
  button.interactive = true;
  button.buttonMode = true;

  // Add background to the button
  const buttonBackground = new Graphics()
    .rect(button.x - 10, button.y - 10, button.width + 20, button.height + 20)
    .fill({
      color: 0x000000,
      alpha: 0.5,
    })
    .stroke({
      width: 2,
      color: 0xffffff,
    });
  app.stage.addChild(buttonBackground);

  button.on("pointerover", () => {
    buttonBackground.tint = 0x555555;
    button.style.fill = 0xffff00;
  });

  button.on("pointerout", () => {
    buttonBackground.tint = 0x000000;
    button.style.fill = 0xffffff;
  });

  button.on("pointerdown", () => {
    const smallRectWidth = 30 + Math.random() * 20; // Random width between 30 and 50
    const smallRectHeight = 30 + Math.random() * 20; // Random height between 30 and 50
    let randomX, randomY;
    let isColliding;

    do {
      randomX = rectX + Math.random() * (rectWidth - smallRectWidth);
      randomY = rectY + Math.random() * (rectHeight - smallRectHeight);
      const tempRect = {
        x: randomX,
        y: randomY,
        width: smallRectWidth,
        height: smallRectHeight,
      };
      isColliding =
        isCollidingWithObstacles(tempRect, obstacles) ||
        isCollidingWithObstacles(tempRect, [sprite]);
    } while (isColliding);

    const smallRectangle = new Graphics()
      .rect(0, 0, smallRectWidth, smallRectHeight)
      .fill({
        color: 0xff0000,
        alpha: 0.9,
      })
      .stroke({
        width: 4,
        color: 0xffffff,
      });
    smallRectangle.x = randomX;
    smallRectangle.y = randomY;

    app.stage.addChild(smallRectangle);
    obstacles.push(smallRectangle);
    console.log("Small rectangle generated at:", randomX, randomY);
  });

  app.stage.addChild(button);
  console.log("Button added to stage.");

  // Add enemy button
  const enemyButton = new Text({text: "Add enemy", style: buttonStyle});
  enemyButton.x = rectX + rectWidth + 20; // Move to the right side of the rectangle
  enemyButton.y = button.y + button.height + 50;
  enemyButton.interactive = true;
  enemyButton.buttonMode = true;

  // Add background to the enemy button
  const enemyButtonBackground = new Graphics()
    .rect(
      enemyButton.x - 10,
      enemyButton.y - 10,
      enemyButton.width + 20,
      enemyButton.height + 20
    )
    .fill({
      color: 0x000000,
      alpha: 0.5,
    })
    .stroke({
      width: 2,
      color: 0xffffff,
    });
  app.stage.addChild(enemyButtonBackground);

  enemyButton.on("pointerover", () => {
    enemyButtonBackground.tint = 0x555555;
    enemyButton.style.fill = 0xffff00;
  });

  enemyButton.on("pointerout", () => {
    enemyButtonBackground.tint = 0x000000;
    enemyButton.style.fill = 0xffffff;
  });

  enemyButton.on("pointerdown", async () => {
    let randomX, randomY;
    let isColliding;

    do {
      randomX = rectX + Math.random() * (rectWidth - 50);
      randomY = rectY + Math.random() * (rectHeight - 50);
      const tempRect = { x: randomX, y: randomY, width: 50, height: 50 };
      isColliding =
        isCollidingWithObstacles(tempRect, obstacles) ||
        isCollidingWithObstacles(tempRect, [sprite]);
    } while (isColliding);

    const enemy = new Sprite(assets.grimReaperTextures.stand.down);
    enemy.x = randomX;
    enemy.y = randomY;
    enemy.scale.set(1.5, 1.5);

    app.stage.addChild(enemy);
    enemies.push(enemy);
    console.log("Enemy added at:", randomX, randomY);
  });

  app.stage.addChild(enemyButton);
  console.log("Enemy button added to stage.");

  // Function to check if the sprite is colliding with any obstacles or enemies
  function isCollidingWithObstacles(spriteBounds, obstacles) {
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

  // Function to check if the enemy is colliding with the player
  function isCollidingWithPlayer(enemyBounds, playerBounds) {
    return (
      enemyBounds.x < playerBounds.x + playerBounds.width &&
      enemyBounds.x + enemyBounds.width > playerBounds.x &&
      enemyBounds.y < playerBounds.y + playerBounds.height &&
      enemyBounds.y + enemyBounds.height > playerBounds.y
    );
  }

  // Function to move enemies
  function moveEnemies() {
    enemies.forEach((enemy) => {
      if (!enemy.direction || enemy.stepsRemaining <= 0) {
        enemy.direction = Math.floor(Math.random() * 8); // Randomize direction (0 for up, 1 for down, 2 for left, 3 for right, 4 for up-left, 5 for up-right, 6 for down-left, 7 for down-right)
        enemy.stepsRemaining = 30 + Math.random() * 70; // Randomize steps between 30 and 100
      }

      const moveDistance = 2; // Use a consistent move distance

      switch (enemy.direction) {
        case 0: // Move up
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.up; // Use static image for up direction
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.down; // Use static image for down direction
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.left; // Use static image for left direction
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.right; // Use static image for right direction
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.upLeft; // Use static image for up-left direction
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.down; // Use static image for up-right direction
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.downLeft; // Use static image for down-left direction
          }
          break;
        case 7: // Move down-right
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
            enemy.stepsRemaining = 0; // Change direction if collision occurs
          } else {
            enemy.texture = assets.grimReaperTextures.stand.downRight; // Use static image for down-right direction
          }
          break;
      }
      
      enemy.stepsRemaining--;
    });
  }

  app.ticker.add(() => {
    let moving = false;
    let diagonal = false;
    const rectangleBounds = getBounds(rectangle);

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
      sprite.texture = assets.textures.stand[lastDirection]; // Keep the last directional sprite
    }

    moveEnemies(); // Move enemies
  });
} catch (error) {
  console.error(
    "An error occurred while initializing the PixiJS application:",
    error
  );
}
