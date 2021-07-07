import { canvas as cnv, context as ctx, sprite, bullet, img as spriteImg } from "./script.js";
let iters;
let CoordX;
let CoordY;
let enemy1;
let enemy2;
let pointX;
let pointY;
let distanceX;
let distanceY;
let myBool = true;
export let img = new Image();
img.src = "images/monster.png";

export let enemyList = {};

// Функия заставляющая всех врагов ходить
export const enemyMovement = (X, Y, key) => {
    if (!enemyList[key].Dead && sprite.Health != 0) {
        distanceX = Math.abs(sprite.X - X);
        distanceY = Math.abs(sprite.Y - Y);
        ctx.clearRect(X, Y, img.width, img.height);
        if (Math.abs(sprite.X - X) > Math.abs(sprite.Y - Y)) {
            iters = Math.abs(sprite.X - X) / enemyList[key].Speed;
            // Лево верх
            if (X <= sprite.X + spriteImg.width / 2 - img.width / 2 && Y <= sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X += enemyList[key].Speed;
                Y += distanceY / iters;
            }
            // Лево низ
            else if (X <= sprite.X + spriteImg.width / 2 - img.width / 2 && Y > sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X += enemyList[key].Speed;
                Y -= distanceY / iters;
            }
            // Право верх
            else if (X > sprite.X + spriteImg.width / 2 - img.width / 2 && Y <= sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X -= enemyList[key].Speed;
                Y += distanceY / iters;
            }
            // Право низ
            else if (X > sprite.X + spriteImg.width / 2 - img.width / 2 && Y > sprite.Y + spriteImg.height / 2 - img.height / 2){
                X -= enemyList[key].Speed;
                Y -= distanceY / iters;
            }
        }
        else if (Math.abs(sprite.Y - Y) > Math.abs(sprite.X - X)) {
            iters = Math.abs(sprite.Y - Y) / enemyList[key].Speed;
            // Лево верх
            if (X <= sprite.X + spriteImg.width / 2 - img.width / 2 && Y <= sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X += distanceX / iters;
                Y += enemyList[key].Speed;
            }
            // Лево низ
            else if (X <= sprite.X + spriteImg.width / 2 - img.width / 2 && Y > sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X += distanceX / iters;
                Y -= enemyList[key].Speed;
            }
            // Право верх
            else if (X > sprite.X + spriteImg.width / 2 - img.width / 2 && Y <= sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X -= distanceX / iters;
                Y += enemyList[key].Speed;
            }
            // Право низ
            else if (X > sprite.X + spriteImg.width / 2 - img.width / 2 && Y > sprite.Y + spriteImg.height / 2 - img.height / 2) {
                X -= distanceX / iters;
                Y -= enemyList[key].Speed;
            }
        }
        enemyList[key].X = X;
        enemyList[key].Y = Y;
        ctx.drawImage(img, X, Y);
    }
}

export const enemySpawn = (numberOfEnemies, callback) => {
    img.onload = function () {
        for (let i = 1; i <= numberOfEnemies; i++) {
            enemyList[i] = {
                X: null,
                Y: null,
                Right: false,
                Dead: false,
                Speed: 5
            };
            CoordX = Math.random().toFixed(3) * 1000;
            if (Math.random().toFixed(1) * 10 > 5) {
                enemyList[i].Right = false;
                while (CoordX >= (sprite.X - bullet.Size / 2 - 1) - 300) {
                    CoordX = Math.random().toFixed(3) * 1000;
                }
            } else {
                enemyList[i].Right = true;
                while (CoordX <= (sprite.X + spriteImg.width + bullet.Size / 2 + 1) + 300 || CoordX + img.width >= cnv.width) {
                    CoordX = Math.random().toFixed(4) * 10000;
                }
            }
            CoordY = Math.random().toFixed(3) * 1000;
            while (CoordY > cnv.height - img.height) {
                CoordY = Math.random().toFixed(3) * 1000;
            }
            // Создаем список характеристик каждому врагу
            enemyList[i].X = CoordX;
            enemyList[i].Y = CoordY;
        }
        for (let key1 in enemyList) {
            for (let key2 in enemyList) {
                enemy1 = enemyList[key1];
                enemy2 = enemyList[key2];
                if (key1 != key2) {
                    if (enemyList[key1].Right) {
                        if (wrongLoc(enemy1.X, enemy1.Y, enemy2.X, enemy2.Y, img)) {
                            myBool = true;
                            pointY = Math.random().toFixed(3) * 1000;
                            while (pointY > cnv.height - img.height) {
                                pointY = Math.random().toFixed(3) * 1000;
                            }
                            while (myBool) {
                                pointX = Math.random().toFixed(4) * 10000;
                                while (pointX <= (sprite.X + spriteImg.width + bullet.Size / 2 + 1) + 300 || pointX + img.width >= cnv.width) {
                                    pointX = Math.random().toFixed(4) * 10000;
                                }
                                for (let key in enemyList) {
                                    if (wrongLoc(pointX, pointY, enemyList[key].X, enemyList[key].Y, img)) {
                                        myBool = true;
                                        break;
                                    } else {
                                        myBool = false
                                    }
                                }
                            }
                            enemy1.X = pointX;
                            enemy1.Y = pointY;
                        }
                    } else {
                        if (wrongLoc(enemy1.X, enemy1.Y, enemy2.X, enemy2.Y, img)) {
                            myBool = true;
                            pointY = Math.random().toFixed(3) * 1000;
                            while (pointY > cnv.height - img.height) {
                                pointY = Math.random().toFixed(3) * 1000;
                            }
                            while (myBool) {
                                pointX = Math.random().toFixed(3) * 1000;
                                while (pointX >= (sprite.X - bullet.Size / 2 - 1) - 300) {
                                    pointX = Math.random().toFixed(3) * 1000;
                                }
                                for (let key in enemyList) {
                                    if (wrongLoc(pointX, pointY, enemyList[key].X, enemyList[key].Y, img)) {
                                        break;
                                    } else {
                                        myBool = false
                                    }
                                }
                            }
                            enemy1.X = pointX;
                            enemy1.Y = pointY;
                        }
                    }
                }
            }
        }
        for (let key in enemyList) {
            ctx.drawImage(img, enemyList[key].X, enemyList[key].Y);
        }
    }
    callback()
}

// Функция для определения правильного положения врага
const wrongLoc = (X1, Y1, X2, Y2, img) => {
    return (X1 >= X2 && X1 <= X2 + img.width && Y1 >= Y2 && Y1 <= Y2 + img.height) ||
        (X1 >= X2 && X1 <= X2 + img.width && Y1 + img.height >= Y2 && Y1 + img.height <= Y2 + img.height) ||
        (X1 + img.width >= X2 && X1 + img.width <= X2 + img.width && Y1 >= Y2 && Y1 <= Y2 + img.height) ||
        (X1 + img.width >= X2 && X1 + img.width <= X2 + img.width && Y1 + img.height >= Y2 && Y1 + img.height <= Y2 + img.height);
}