import { canvas as cnv, context as ctx, sprite, bullet, img as spriteImg } from "./script.js";
let CoordX;
let CoordY;
let img = new Image();
img.src = "images/monster.png";
export let enemyList = {};

export const enemySpawn = (numberOfEnemies) => {
    img.onload = function () {
        for (let i = 1; i <= numberOfEnemies; i++) {
            CoordX = Math.random().toFixed(3) * 1000;
            CoordY = Math.random().toFixed(3) * 1000;
            if (Math.random().toFixed(1) * 10 > 5) {
                while (CoordX >= (sprite.X - bullet.size / 2 - 1) - 300) {
                    CoordX = Math.random().toFixed(3) * 1000;
                }
            } else {
                while (CoordX <= (sprite.X + spriteImg.width + bullet.size / 2 + 1) + 300 || CoordX + img.width >= cnv.width) {
                    CoordX = Math.random().toFixed(4) * 10000;
                }
            }
            while (CoordY > cnv.height - img.height) {
                CoordY = Math.random().toFixed(3) * 1000;
            }
            // Список характеристик всех врагов
            enemyList[i] = {
                X: CoordX,
                Y: CoordY
            };
        }
        for (let key1 in enemyList) {
            for (let key2 in enemyList) {
                // enemy и key не сходятся потому что был баг и такое расположение его фиксит
                let enemy1 = enemyList[key2];
                let enemy2 = enemyList[key1];
                if (key1 != key2) {
                    while (true) {
                        // Левая верхняя точка внутри другой фигуры
                        if (enemy1.X >= enemy2.X && enemy1.X <= enemy2.X + img.width && enemy1.Y >= enemy2.Y && enemy1.Y <= enemy2.Y + img.height) {
                            if (enemy2.X - 60 > 0) {
                                enemy1.X -= 10;
                            } else {
                                enemy1.X += 10;
                            }
                            console.log('moving')
                            if (enemy2.Y - 60 > 0) {
                                enemy1.Y -= 10;
                            }
                            else if (enemy2.Y + img.height + 60 < cnv.height) {
                                enemy1.Y += 10;
                            }
                        }
                        // Левая нижняя точка внутри другой фигуры
                        else if (enemy1.X >= enemy2.X && enemy1.X <= enemy2.X + img.width && enemy1.Y + img.height >= enemy2.Y && enemy1.Y + img.height <= enemy2.Y + img.height) {
                            if (enemy2.X - 60 > 0) {
                                enemy1.X -= 10;
                            } else {
                                enemy1.X += 10;
                            }
                            console.log('moving')
                            if (enemy2.Y - 60 > 0) {
                                enemy1.Y -= 10;
                            }
                            else if (enemy2.Y + img.height + 60 < cnv.height) {
                                enemy1.Y += 10;
                            }
                        }
                        // Правая верхняя точка внутри другой фигуры
                        else if (enemy1.X + img.width >= enemy2.X && enemy1.X + img.width <= enemy2.X + img.width && enemy1.Y >= enemy2.Y && enemy1.Y <= enemy2.Y + img.height) {
                            if (enemy2.X - 60 > 0) {
                                enemy1.X -= 10;
                            } else {
                                enemy1.X += 10;
                            }
                            console.log('moving')
                            if (enemy2.Y - 60 > 0) {
                                enemy1.Y -= 10;
                            }
                            else if (enemy2.Y + img.height + 60 < cnv.height) {
                                enemy1.Y += 10;
                            }
                        }
                        // Правая нижняя точка внутри другой фигуры
                        else if (enemy1.X + img.width >= enemy2.X && enemy1.X + img.width <= enemy2.X + img.width && enemy1.Y + img.height >= enemy2.Y && enemy1.Y + img.height <= enemy2.Y + img.height) {
                            if (enemy2.X - 60 > 0) {
                                enemy1.X -= 10;
                            } else {
                                enemy1.X += 10;
                            }
                            console.log('moving')
                            if (enemy2.Y - 60 > 0) {
                                enemy1.Y -= 10;
                            }
                            else if (enemy2.Y + img.height + 60 < cnv.height) {
                                enemy1.Y += 10;
                            }
                        } else {
                            break
                        }
                    }
                }
            }
        }
        for (let key in enemyList) {
            ctx.drawImage(img, enemyList[key].X, enemyList[key].Y);
        }
    }
}