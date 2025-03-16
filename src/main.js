import {Application, Assets, Graphics, Text, TextStyle, TilingSprite, Sprite} from "pixi.js";
import { initDevtools } from "@pixi/devtools";
try {
  console.log("Initializing PixiJS application...");

  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x4169e1,
  });
  
  initDevtools({app});   

  app.canvas.style.position = "absolute";
  console.log("PixiJS application initialized:", app);
  const font = await Assets.load("fonts/PressStart2P-Regular.ttf");

  const style = new TextStyle({
    fill: 0xffffff,
    fontSize: 48,
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
    .rect(rectX, rectY, rectWidth, rectHeight)
    .fill({
      color: 0x1099bb,
      alpha: 0.9,
    })
    .stroke({
      width: 8,
      color: 0xffffff,
    });

  app.stage.addChild(rectangle);
  console.log("Rectangle added to stage.");

  const floorTexture = await Assets.load('images/ground.jpg');
  const tilingSprite = new TilingSprite(floorTexture, rectWidth, rectHeight);
  tilingSprite.x = rectX;
  tilingSprite.y = rectY;
  tilingSprite.tileScale.set(0.125, 0.125);

  app.stage.addChild(tilingSprite);

  
  // Load the spritesheet
  const spritesheet = await Assets.load('images/character_spritesheet.json');
  console.log("Spritesheet loaded:", spritesheet);

  // Create a sprite from the spritesheet
  const sprite = new Sprite(spritesheet.textures['boy_stand_S.png']);
  sprite.x = 400;
  sprite.y = 300;
  sprite.scale.set(2, 2);
  app.stage.addChild(sprite);
  console.log("Sprite added to stage.");

  // Define textures for each direction
const textures = {
// We need more frames for the animation to "look smooth"...
  up: [
    spritesheet.textures['boy_run_N_1.png'],
    spritesheet.textures['boy_run_N_2.png'],
    spritesheet.textures['boy_run_N_1.png'],
    spritesheet.textures['boy_run_N_2.png']
  ],
  down: [
    spritesheet.textures['boy_run_S_1.png'],
    spritesheet.textures['boy_run_S_2.png'],
    spritesheet.textures['boy_run_S_1.png'],
    spritesheet.textures['boy_run_S_2.png']
  ],
  left: [
    spritesheet.textures['boy_run_W_1.png'],
    spritesheet.textures['boy_run_W_2.png'],
    spritesheet.textures['boy_run_W_1.png'],
    spritesheet.textures['boy_run_W_2.png']
  ],
  right: [
    spritesheet.textures['boy_run_E_1.png'],
    spritesheet.textures['boy_run_E_2.png'],
    spritesheet.textures['boy_run_E_1.png'],
    spritesheet.textures['boy_run_E_2.png']
  ],
  upLeft: [
    spritesheet.textures['boy_run_NW_1.png'],
    spritesheet.textures['boy_run_NW_2.png']
  ],
  upRight: [
    spritesheet.textures['boy_run_NE_1.png'],
    spritesheet.textures['boy_run_NE_2.png']
  ],
  downLeft: [
    spritesheet.textures['boy_run_SW_1.png'],
    spritesheet.textures['boy_run_SW_2.png']
  ],
  downRight: [
    spritesheet.textures['boy_run_SE_1.png'],
    spritesheet.textures['boy_run_SE_2.png']
  ],
  stand: {
    up: spritesheet.textures['boy_stand_N.png'],
    down: spritesheet.textures['boy_stand_S.png'],
    left: spritesheet.textures['boy_stand_W.png'],
    right: spritesheet.textures['boy_stand_E.png'],
    upLeft: spritesheet.textures['boy_stand_NW.png'],
    upRight: spritesheet.textures['boy_stand_NE.png'],
    downLeft: spritesheet.textures['boy_stand_SW.png'],
    downRight: spritesheet.textures['boy_stand_SE.png']
  }
};

  document.body.appendChild(app.canvas);
  console.log("Canvas appended to document body.");

  // Implement movement for the sprite
  const speed = 3;
  const diagonalSpeed = speed / Math.sqrt(2); // Adjust speed for diagonal movement
  const keys = {};
  let frame = 0;
  let lastDirection = 'down'; 
  const frameRate = 5; // Adjust frame rate

  window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
  });

  window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
  });

  app.ticker.add(() => {
    let moving = false;
    let diagonal = false;
  
    if ((keys['w'] || keys['ArrowUp']) && (keys['a'] || keys['ArrowLeft'])) {
      sprite.y -= diagonalSpeed;
      sprite.x -= diagonalSpeed;
      sprite.texture = textures.upLeft[Math.floor(frame / frameRate) % textures.upLeft.length];
      lastDirection = 'upLeft';
      diagonal = true;
      moving = true;
    }
    if ((keys['w'] || keys['ArrowUp']) && (keys['d'] || keys['ArrowRight'])) {
      sprite.y -= diagonalSpeed;
      sprite.x += diagonalSpeed;
      sprite.texture = textures.upRight[Math.floor(frame / frameRate) % textures.upRight.length];
      lastDirection = 'upRight';
      diagonal = true;
      moving = true;
    }
    if ((keys['s'] || keys['ArrowDown']) && (keys['a'] || keys['ArrowLeft'])) {
      sprite.y += diagonalSpeed;
      sprite.x -= diagonalSpeed;
      sprite.texture = textures.downLeft[Math.floor(frame / frameRate) % textures.downLeft.length];
      lastDirection = 'downLeft';
      diagonal = true;
      moving = true;
    }
    if ((keys['s'] || keys['ArrowDown']) && (keys['d'] || keys['ArrowRight'])) {
      sprite.y += diagonalSpeed;
      sprite.x += diagonalSpeed;
      sprite.texture = textures.downRight[Math.floor(frame / frameRate) % textures.downRight.length];
      lastDirection = 'downRight';
      diagonal = true;
      moving = true;
    }
  
    if (!diagonal) {
      if (keys['w'] || keys['ArrowUp']) {
        sprite.y -= speed;
        sprite.texture = textures.up[Math.floor(frame / frameRate) % textures.up.length];
        lastDirection = 'up';
        moving = true;
      }
      if (keys['s'] || keys['ArrowDown']) {
        sprite.y += speed;
        sprite.texture = textures.down[Math.floor(frame / frameRate) % textures.down.length];
        lastDirection = 'down';
        moving = true;
      }
      if (keys['a'] || keys['ArrowLeft']) {
        sprite.x -= speed;
        sprite.texture = textures.left[Math.floor(frame / frameRate) % textures.left.length];
        lastDirection = 'left';
        moving = true;
      }
      if (keys['d'] || keys['ArrowRight']) {
        sprite.x += speed;
        sprite.texture = textures.right[Math.floor(frame / frameRate) % textures.right.length];
        lastDirection = 'right';
        moving = true;
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