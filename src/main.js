import {Application, Assets, Graphics, Text, TextStyle, TilingSprite} from "pixi.js";
import { initDevtools } from "@pixi/devtools";
try {
  console.log("Initializing PixiJS application...");

  const app = new Application();
  await app.init({
    resizeTo: window,
    //backgroundAlpha: 0.5,
    backgroundColor: 0x4169e1,
  });
  
  initDevtools({app});   

  app.canvas.style.position = "absolute";

  console.log("PixiJS application initialized:", app);
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

  const style = new TextStyle({
    fill: 0xffffff,
    fontSize: 48,
    fontFamily: '"Press Start 2P", sans-serif',
  });

  const text = new Text({
    text: "404 - Exit Not Found",
    style,
  });
  
  text.x = 110;
  text.y = 60;
  app.stage.addChild(text);

  const floorTexture = await Assets.load('images/ground.jpg');
  const tilingSprite = new TilingSprite(floorTexture, rectWidth, rectHeight);
  tilingSprite.x = rectX;
  tilingSprite.y = rectY;
  tilingSprite.tileScale.set(0.125, 0.125);

  app.stage.addChild(tilingSprite);

  document.body.appendChild(app.canvas);
  console.log("Canvas appended to document body.");
} catch (error) {
  console.error(
    "An error occurred while initializing the PixiJS application:",
    error
  );
}
