import {canvas as cnv, context as ctx, sprite} from "./script.js";
let X;
let Y;
let additionalRandom;
let img = new Image()
img.src = "images/monster.png";
img.width = 100;
img.height = 100;
export const enemySpawn = (numberOfEnemys) => {
    for (let i = 1; i <= numberOfEnemys; i++){
        additionalRandom = Math.random().toFixed(3) * 1000;
        if (Math.random().toFixed(1) * 10 >= 5) {
            additionalRandom *= -1;
        }
        X = sprite.X - 500 - additionalRandom;
        console.log(X);
        Y = sprite.Y - 500 - additionalRandom;
        console.log(Y);
        ctx.drawImage(img, X, Y);
    }
}