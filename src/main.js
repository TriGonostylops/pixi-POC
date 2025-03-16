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
try {
  console.log("Initializing PixiJS application...");

  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x4169e1,
  });

  initDevtools({ app });

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

  app.stage.addChild(tilingSprite);

  // Load the spritesheet
  const spritesheet = await Assets.load("images/character_spritesheet.json");
  console.log("Spritesheet loaded:", spritesheet);

  // Create a sprite from the spritesheet
  const sprite = new Sprite(spritesheet.textures["boy_stand_S.png"]);
  sprite.x = 400;
  sprite.y = 300;
  sprite.scale.set(2, 2);
  app.stage.addChild(sprite);
  console.log("Sprite added to stage.");

  // Define textures for each direction
  const textures = {
    // We need more frames for the animation to "look smooth"...
    up: [
      spritesheet.textures["boy_run_N_1.png"],
      spritesheet.textures["boy_run_N_2.png"],
      spritesheet.textures["boy_run_N_1.png"],
      spritesheet.textures["boy_run_N_2.png"],
    ],
    down: [
      spritesheet.textures["boy_run_S_1.png"],
      spritesheet.textures["boy_run_S_2.png"],
      spritesheet.textures["boy_run_S_1.png"],
      spritesheet.textures["boy_run_S_2.png"],
    ],
    left: [
      spritesheet.textures["boy_run_W_1.png"],
      spritesheet.textures["boy_run_W_2.png"],
      spritesheet.textures["boy_run_W_1.png"],
      spritesheet.textures["boy_run_W_2.png"],
    ],
    right: [
      spritesheet.textures["boy_run_E_1.png"],
      spritesheet.textures["boy_run_E_2.png"],
      spritesheet.textures["boy_run_E_1.png"],
      spritesheet.textures["boy_run_E_2.png"],
    ],
    upLeft: [
      spritesheet.textures["boy_run_NW_1.png"],
      spritesheet.textures["boy_run_NW_2.png"],
    ],
    upRight: [
      spritesheet.textures["boy_run_NE_1.png"],
      spritesheet.textures["boy_run_NE_2.png"],
    ],
    downLeft: [
      spritesheet.textures["boy_run_SW_1.png"],
      spritesheet.textures["boy_run_SW_2.png"],
    ],
    downRight: [
      spritesheet.textures["boy_run_SE_1.png"],
      spritesheet.textures["boy_run_SE_2.png"],
    ],
    stand: {
      up: spritesheet.textures["boy_stand_N.png"],
      down: spritesheet.textures["boy_stand_S.png"],
      left: spritesheet.textures["boy_stand_W.png"],
      right: spritesheet.textures["boy_stand_E.png"],
      upLeft: spritesheet.textures["boy_stand_NW.png"],
      upRight: spritesheet.textures["boy_stand_NE.png"],
      downLeft: spritesheet.textures["boy_stand_SW.png"],
      downRight: spritesheet.textures["boy_stand_SE.png"],
    },
  };

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

  const button = new Text("Generate obstacle", buttonStyle);
  button.x = rectX + rectWidth / 2 - button.width / 2;
  button.y = rectY + rectHeight + 20;
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

  button.on('pointerover', () => {
    buttonBackground.tint = 0x555555;
    button.style.fill = 0xffff00;
  });

  button.on('pointerout', () => {
    buttonBackground.tint = 0x000000;
    button.style.fill = 0xffffff;
  });

  button.on('pointerdown', () => {
    const smallRectWidth = 30 + Math.random() * 20; // Random width between 30 and 50
    const smallRectHeight = 30 + Math.random() * 20; // Random height between 30 and 50
    let randomX, randomY;
    let isColliding;

    do {
      randomX = rectX + Math.random() * (rectWidth - smallRectWidth);
      randomY = rectY + Math.random() * (rectHeight - smallRectHeight);
      const tempRect = { x: randomX, y: randomY, width: smallRectWidth, height: smallRectHeight };
      isColliding = isCollidingWithObstacles(tempRect, obstacles) || isCollidingWithObstacles(tempRect, [sprite]);
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

  // Function to check if the sprite is colliding with any obstacles
  function isCollidingWithObstacles(spriteBounds, obstacles) {
    return obstacles.some(obstacle => {
      const obstacleBounds = getBounds(obstacle);
      return (
        spriteBounds.x < obstacleBounds.x + obstacleBounds.width &&
        spriteBounds.x + spriteBounds.width > obstacleBounds.x &&
        spriteBounds.y < obstacleBounds.y + obstacleBounds.height &&
        spriteBounds.y + spriteBounds.height > obstacleBounds.y
      );
    });
  }

  app.ticker.add(() => {
    let moving = false;
    let diagonal = false;
    const rectangleBounds = getBounds(rectangle);

    if ((keys["w"] || keys["ArrowUp"]) && (keys["a"] || keys["ArrowLeft"])) {
      sprite.y -= diagonalSpeed;
      sprite.x -= diagonalSpeed;
      if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
        sprite.y += diagonalSpeed;
        sprite.x += diagonalSpeed;
      } else {
        sprite.texture = textures.upLeft[Math.floor(frame / frameRate) % textures.upLeft.length];
        lastDirection = "upLeft";
        diagonal = true;
        moving = true;
      }
    }
    if ((keys["w"] || keys["ArrowUp"]) && (keys["d"] || keys["ArrowRight"])) {
      sprite.y -= diagonalSpeed;
      sprite.x += diagonalSpeed;
      if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
        sprite.y += diagonalSpeed;
        sprite.x -= diagonalSpeed;
      } else {
        sprite.texture = textures.upRight[Math.floor(frame / frameRate) % textures.upRight.length];
        lastDirection = "upRight";
        diagonal = true;
        moving = true;
      }
    }
    if ((keys["s"] || keys["ArrowDown"]) && (keys["a"] || keys["ArrowLeft"])) {
      sprite.y += diagonalSpeed;
      sprite.x -= diagonalSpeed;
      if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
        sprite.y -= diagonalSpeed;
        sprite.x += diagonalSpeed;
      } else {
        sprite.texture = textures.downLeft[Math.floor(frame / frameRate) % textures.downLeft.length];
        lastDirection = "downLeft";
        diagonal = true;
        moving = true;
      }
    }
    if ((keys["s"] || keys["ArrowDown"]) && (keys["d"] || keys["ArrowRight"])) {
      sprite.y += diagonalSpeed;
      sprite.x += diagonalSpeed;
      if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
        sprite.y -= diagonalSpeed;
        sprite.x -= diagonalSpeed;
      } else {
        sprite.texture = textures.downRight[Math.floor(frame / frameRate) % textures.downRight.length];
        lastDirection = "downRight";
        diagonal = true;
        moving = true;
      }
    }

    if (!diagonal) {
      if (keys["w"] || keys["ArrowUp"]) {
        sprite.y -= speed;
        if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
          sprite.y += speed;
        } else {
          sprite.texture = textures.up[Math.floor(frame / frameRate) % textures.up.length];
          lastDirection = "up";
          moving = true;
        }
      }
      if (keys["s"] || keys["ArrowDown"]) {
        sprite.y += speed;
        if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
          sprite.y -= speed;
        } else {
          sprite.texture = textures.down[Math.floor(frame / frameRate) % textures.down.length];
          lastDirection = "down";
          moving = true;
        }
      }
      if (keys["a"] || keys["ArrowLeft"]) {
        sprite.x -= speed;
        if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
          sprite.x += speed;
        } else {
          sprite.texture = textures.left[Math.floor(frame / frameRate) % textures.left.length];
          lastDirection = "left";
          moving = true;
        }
      }
      if (keys["d"] || keys["ArrowRight"]) {
        sprite.x += speed;
        if (!isWithinBounds(getBounds(sprite), rectangleBounds) || isCollidingWithObstacles(getBounds(sprite), obstacles)) {
          sprite.x -= speed;
        } else {
          sprite.texture = textures.right[Math.floor(frame / frameRate) % textures.right.length];
          lastDirection = "right";
          moving = true;
        }
      }
    }

    if (moving) {
      frame++;
    } else {
      sprite.texture = textures.stand[lastDirection]; // Keep the last directional sprite
    }
  });

} catch (error) {
  console.error(
    "An error occurred while initializing the PixiJS application:",
    error
  );
}
