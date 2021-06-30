import {canvas as cnv, context as ctx} from "./script.js";
let X;
let Y;
let img = new Image()
img.src = "";
export const enemySpawn = (numberOfEnemys) => {
    for (let i = 0; i <= numberOfEnemys; i++){
        X = Math.random().toFixed(2) * 100;
        Y = Math.random().toFixed(2) * 100;
        
    }
}