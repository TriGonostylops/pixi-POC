import {Graphics, TilingSprite, Assets} from "pixi.js";

export async function createMap(rectX, rectY, rectWidth, rectHeight) {
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

    const floorTexture = await Assets.load("images/ground.jpg");
    const tilingSprite = new TilingSprite(floorTexture, rectWidth, rectHeight);
    tilingSprite.x = rectX;
    tilingSprite.y = rectY;
    tilingSprite.tileScale.set(0.06, 0.06);

    return {rectangle, tilingSprite};
}
