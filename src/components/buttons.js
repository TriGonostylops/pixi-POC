import {Graphics, Text} from "pixi.js";

export function createButton(text, style, x, y, onClick) {
    const button = new Text({text, style});
    button.x = x;
    button.y = y;
    button.interactive = true;
    button.buttonMode = true;

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

    button.on("pointerover", () => {
        buttonBackground.tint = 0x555555;
        button.style.fill = 0xffff00;
    });

    button.on("pointerout", () => {
        buttonBackground.tint = 0x000000;
        button.style.fill = 0xffffff;
    });

    button.on("pointerdown", onClick);

    return {button, buttonBackground};
}
