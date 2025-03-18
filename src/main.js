import {
    Application,
    Assets,
    Graphics,
    Text,
    TextStyle,
    TilingSprite,
    Sprite,
} from "pixi.js";
import {initDevtools} from "@pixi/devtools";
import {loadAssets} from "./assets";
import {createButton} from "./components/buttons";
import {handlePlayerMovement} from "./components/player";
import {moveEnemies} from "./components/enemies";
import {createMap} from "./components/map";
import {getBounds, isWithinBounds, isCollidingWithObstacles, isCollidingWithPlayer} from "./utils";

try {
    console.log("Initializing PixiJS application...");

    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundColor: 0x4169e1,
    });

    initDevtools({app});
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

    const {rectangle, tilingSprite} = await createMap(rectX, rectY, rectWidth, rectHeight);
    app.stage.addChild(rectangle);
    app.stage.addChild(tilingSprite);
    console.log("Map added to stage.");

    const sprite = new Sprite(assets.textures.down);
    sprite.x = 400;
    sprite.y = 300;
    sprite.scale.set(2, 2);
    app.stage.addChild(sprite);
    console.log("Sprite added to stage.");

    document.body.appendChild(app.canvas);
    console.log("Canvas appended to document body.");

    const keys = {};

    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });

    const obstacles = [];
    const enemies = [];


    const {button: obstacleButton, buttonBackground: obstacleButtonBackground} = createButton(
        "Generate obstacle",
        buttonStyle,
        rectX + rectWidth + 20,
        rectY,
        () => {
            const smallRectWidth = 30 + Math.random() * 20;
            const smallRectHeight = 30 + Math.random() * 20;
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
        }
    );

    app.stage.addChild(obstacleButtonBackground);
    app.stage.addChild(obstacleButton);
    console.log("Obstacle button added to stage.");

    const {button: enemyButton, buttonBackground: enemyButtonBackground} = createButton(
        "Add enemy",
        buttonStyle,
        rectX + rectWidth + 20,
        obstacleButton.y + obstacleButton.height + 50,
        async () => {
            let randomX, randomY;
            let isColliding;

            do {
                randomX = rectX + Math.random() * (rectWidth - 50);
                randomY = rectY + Math.random() * (rectHeight - 50);
                const tempRect = {x: randomX, y: randomY, width: 50, height: 50};
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
        }
    );

    app.stage.addChild(enemyButtonBackground);
    app.stage.addChild(enemyButton);
    console.log("Enemy button added to stage.");

    const updatePlayer = handlePlayerMovement(
        sprite,
        assets,
        obstacles,
        enemies,
        getBounds,
        isWithinBounds,
        isCollidingWithObstacles
    );

    app.ticker.add(() => {
        const rectangleBounds = getBounds(rectangle);
        updatePlayer(rectangleBounds);
        moveEnemies(enemies, assets, getBounds, isWithinBounds, isCollidingWithObstacles, isCollidingWithPlayer, rectangle, sprite, obstacles); // Move enemies
    });
} catch (error) {
    console.error(
        "An error occurred while initializing the PixiJS application:",
        error
    );
}
