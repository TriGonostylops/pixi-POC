import {Assets} from "pixi.js";

export async function loadAssets() {
    const font = await Assets.load("fonts/PressStart2P-Regular.ttf");
    const floorTexture = await Assets.load("images/ground.jpg");
    const spritesheet = await Assets.load("images/character_spritesheet.json");
    const grimReaperSpritesheet = await Assets.load("images/grim_reaper.json");

    const textures = {
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

    const grimReaperTextures = {
        stand: {
            up: grimReaperSpritesheet.textures["GrimReaper_stand_N.png"],
            down: grimReaperSpritesheet.textures["GrimReaper_stand_S.png"],
            left: grimReaperSpritesheet.textures["GrimReaper_stand_W.png"],
            right: grimReaperSpritesheet.textures["GrimReaper_stand_E.png"],
            upLeft: grimReaperSpritesheet.textures["GrimReaper_stand_NW.png"],
            upRight: grimReaperSpritesheet.textures["GrimReaper_stand_NE.png"],
            downLeft: grimReaperSpritesheet.textures["GrimReaper_stand_SW.png"],
            downRight: grimReaperSpritesheet.textures["GrimReaper_stand_SE.png"],
        },
    };

    return {
        font,
        floorTexture,
        spritesheet,
        textures,
        grimReaperSpritesheet,
        grimReaperTextures,
    };
}
