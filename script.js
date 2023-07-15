`
TO DO LIST:

1) Сдеалать рестарт

2) Сделать не большой рефакторинг кода

`
import { enemySpawn, enemyList, img as enemyImg, enemyMovement, enemyListCopy } from "./enemy.js";

// Основной холст
export let canvas = document.getElementById("canvas");
export let context = canvas.getContext("2d");

// Холст со здоровьем
let canvasHealth = document.getElementById("canvas-health");
let contextHealth = canvasHealth.getContext('2d');

// Старотовое изображение
export let img = new Image();

// Изображения сердец
let emptyHeartImg = new Image();
let heartImg = new Image();
heartImg.onload = function () {
    for (let i = 1; i <= 3; i++) {
        contextHealth.drawImage(heartImg, canvasHealth.width - heartImg.width * i, 0);
    }
}

// Ссылки на изображения
emptyHeartImg.src = 'images/heart.png';
heartImg.src = 'images/filledheart.png';
img.src = 'images/mainSpriteRight.png';

// Характеристики пули
export const bullet = {
    Size: 7,
    Speed: 15,
    Damage: 25
};

context.fillStyle = 'black';

// Корректировка размеров холстов
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
canvasHealth.width = canvasHealth.clientWidth;
canvasHealth.height = canvasHealth.clientHeight;

// Характеристики персонажа 
export let sprite = {
    X: canvas.width / 2 - img.width / 2,
    Y: canvas.height / 2 - img.height / 2,
    Health: 3,
    Dead: false,
    Speed: 7
};
const drawEmptyHeart = () => {
    contextHealth.clearRect(canvasHealth.width - emptyHeartImg.width * sprite.Health, 0, emptyHeartImg.width, emptyHeartImg.height);
    contextHealth.drawImage(emptyHeartImg, canvasHealth.width - emptyHeartImg.width * sprite.Health, 0);
}
let intervalStop = false;
let opacityCounter = 0;

// Спавнит 3 врагов рядом с персонажем и в колбэке заставляет их двигаться к нему
enemySpawn(1, script => {
    const timerId2 = setInterval(() => {
        for (let key in enemyList) {
            enemyMovement(enemyList[key].X, enemyList[key].Y, key);
            if (wrongLoc(enemyList[key].X, enemyList[key].Y, sprite.X, sprite.Y, enemyImg, img) && !intervalStop) {
                intervalStop = true;
                sprite.Dead = true;
                drawEmptyHeart();
                sprite.Health -= 1;
                if (sprite.Health != 0) {
                    sprite.X = canvas.width / 2 - img.width / 2;
                    sprite.Y = canvas.height / 2 - img.height / 2;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    turnRight();
                    setTimeout(() => {
                        for (let key in enemyList) {
                            enemyList[key].X = enemyListCopy[key].X;
                            enemyList[key].Y = enemyListCopy[key].Y;
                            enemyList[key].Health = enemyListCopy[key].Health;
                        }
                        for (let key in enemyList) {
                            if (!enemyList[key].Dead) {
                                context.drawImage(enemyImg, enemyList[key].X, enemyList[key].Y);
                            }
                        }
                        sprite.Dead = false;
                        intervalStop = false;
                    }, 1000);
                } else {
                    document.getElementById('blackout').style.zIndex = "3";
                    document.getElementById("end").textContent = "GAME OVER";
                    const timerId3 = setInterval(() => {
                        if (Math.floor(opacityCounter) == 1) {
                            clearInterval(timerId3);
                        }
                        opacityCounter += 0.01;
                        document.getElementById('blackout').style.opacity = opacityCounter.toFixed(2) + "";
                    }, 10);
                    clearInterval(timerId2);
                }
            }
        }
    }, 17)
});

// Функция, отслеживающая состоние клавишей
let pressedKeys = {};
onkeydown = onkeyup = function (e) {
    if (!sprite.Dead && sprite.Health != 0) {
        pressedKeys[e.keyCode] = e.type == 'keydown';
        // Функция бинда кнопок
        const movement = (key_code, axis, factor) => {
            if (pressedKeys[key_code]) {
                context.clearRect(sprite.X, sprite.Y, img.width, img.height);
                if (axis == sprite.Y) {
                    sprite.Y += sprite.Speed * factor;
                } else {
                    sprite.X += sprite.Speed * factor;
                }
                if (img.src == 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
                    // Отрисовывает персонажа с другими координатами
                    turnRight();
                } else {
                    // Отрисовывает персонажа с другими координатами
                    turnLeft();
                }
            }
        }
        // Кнопка W
        if (sprite.Y > 0) {
            movement(87, sprite.Y, -1);
        }
        // Кнопка S
        if (sprite.Y + img.height < canvas.height) {
            movement(83, sprite.Y, 1);
        }
        // Кнопка D
        if (sprite.X + img.width < canvas.width) {
            movement(68, sprite.X, 1);
        }
        // Кнопка A
        if (sprite.X > 0) {
            movement(65, sprite.X, -1);
        }
    }
}

// При нажатии на холст, вылетает пуля
canvas.addEventListener('mousedown', (e) => {
    if (!sprite.Dead && sprite.Health != 0) {
        // Координаты места нажатия на холст
        const mouseLoc = {
            X: e.offsetX,
            Y: e.offsetY
        };

        // Координаты конца ствола
        const gunEnd = {
            X: sprite.X + img.width + bullet.Size / 2 + 1,
            Y: sprite.Y + img.height / 2 - 10
        };

        const potentiallyEnemies = {};

        // Взависимости от направления полета пули вычесляется количество врагов, которых она может подстрелить.
        // Это сделано для того, чтобы не проверять на каждой итерации отрисовки пули, попала ли она во врага,
        // который находится на другом конце карты
        if (mouseLoc.X <= sprite.X - bullet.Size / 2 - 1 && mouseLoc.Y <= gunEnd.Y) {
            for (let key in enemyList) {
                if (enemyList[key].X <= sprite.X - bullet.Size / 2 - 1 && enemyList[key].Y <= gunEnd.Y) {
                    potentiallyEnemies[key] = enemyList[key];
                }
            }
        }
        else if (mouseLoc.X <= sprite.X - bullet.Size / 2 - 1 && mouseLoc.Y > gunEnd.Y) {
            for (let key in enemyList) {
                if (enemyList[key].X <= sprite.X - bullet.Size / 2 - 1 && enemyList[key].Y > gunEnd.Y ||
                    enemyList[key].X <= sprite.X - bullet.Size / 2 - 1 && enemyList[key].Y + enemyImg.height > gunEnd.Y) {
                    potentiallyEnemies[key] = enemyList[key];
                }
            }
        }
        else if (mouseLoc.X > sprite.X + img.width + bullet.Size / 2 + 1 && mouseLoc.Y <= gunEnd.Y) {
            for (let key in enemyList) {
                if (enemyList[key].X > sprite.X + img.width + bullet.Size / 2 + 1 && enemyList[key].Y <= gunEnd.Y) {
                    potentiallyEnemies[key] = enemyList[key];
                }
            }
        }
        else if (mouseLoc.X > sprite.X + img.width + bullet.Size / 2 + 1 && mouseLoc.Y > gunEnd.Y) {
            for (let key in enemyList) {
                if (enemyList[key].X > sprite.X + img.width + bullet.Size / 2 + 1 && enemyList[key].Y > gunEnd.Y ||
                    enemyList[key].X > sprite.X + img.width + bullet.Size / 2 + 1 && enemyList[key].Y + enemyImg.height > gunEnd.Y) {
                    potentiallyEnemies[key] = enemyList[key];
                }
            }
        }

        // Игрок не может стрелять вверх и вниз
        if (mouseLoc.X >= sprite.X - bullet.Size / 2 - 1 && mouseLoc.X <= sprite.X + img.width + bullet.Size / 2 + 1) {
            return;
        }
        // Эти блоки отвечают за поворот спрайта в сторону выстрела
        else if (mouseLoc.X >= sprite.X - bullet.Size / 2 - 1) {
            if (img.src != 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
                turnRight();
            }
            gunEnd.X = sprite.X + img.width + bullet.Size / 2 + 1;
        }
        else if (mouseLoc.X <= sprite.X + img.width + bullet.Size / 2 + 1) {
            if (img.src != 'http://127.0.0.1:5500/images/mainSpriteLeft.png') {
                turnLeft();
            }
            gunEnd.X = sprite.X - bullet.Size / 2 - 1;
        }
        let X = gunEnd.X;
        let Y = gunEnd.Y;
        let iters;
        let enemy;
        let distanceY = Math.abs(mouseLoc.Y - gunEnd.Y);
        let distanceX = Math.abs(mouseLoc.X - gunEnd.X);

        // Функция отвечающая за полет пули
        const gunShot = (factor1, factor2) => {
            if (Math.abs(mouseLoc.X - gunEnd.X) > Math.abs(mouseLoc.Y - gunEnd.Y)) {
                iters = Math.abs(gunEnd.X - mouseLoc.X) / bullet.Speed;
                if (X != gunEnd.X) {
                    context.clearRect(X - 5.5 - bullet.Speed * factor1, Y - 5.5 - (distanceY / iters) * factor2, 11, 11);
                }
                context.fillRect(X - bullet.Size / 2, Y - bullet.Size / 2, bullet.Size, bullet.Size);
                // Проверка на попадание в соперника
                for (let key in potentiallyEnemies) {
                    enemy = potentiallyEnemies[key];
                    if (wrongLoc(X, Y, enemy.X, enemy.Y, bullet.Size, enemyImg) && !enemy.Dead) {
                        context.clearRect(X - (bullet.Size + 1) / 2, Y - (bullet.Size + 1) / 2, bullet.Size + 1, bullet.Size + 1);
                        enemy.Health -= bullet.Damage;
                        if (enemy.Health <= 0) {
                            delete enemyList[key]
                            context.clearRect(enemy.X, enemy.Y, enemyImg.width, enemyImg.height);
                        }
                        clearInterval(timerId1);
                    }
                }
                X += bullet.Speed * factor1;
                Y += (distanceY / iters) * factor2;
            }
            if (Math.abs(mouseLoc.X - gunEnd.X) < Math.abs(mouseLoc.Y - gunEnd.Y)) {
                iters = Math.abs(gunEnd.Y - mouseLoc.Y) / bullet.Speed;
                if (X != gunEnd.X) {
                    context.clearRect(X - 5.5 - (distanceX / iters) * factor1, Y - 5.5 - bullet.Speed * factor2, 11, 11);
                }
                context.fillRect(X - bullet.Size / 2, Y - bullet.Size / 2, bullet.Size, bullet.Size);
                // Проверка на попадание в соперника
                for (let key in potentiallyEnemies) {
                    enemy = potentiallyEnemies[key];
                    if (wrongLoc(X, Y, enemy.X, enemy.Y, bullet.Size, enemyImg) && !enemy.Dead) {
                        context.clearRect(X - (bullet.Size + 1) / 2, Y - (bullet.Size + 1) / 2, bullet.Size + 1, bullet.Size + 1);
                        enemy.Health -= bullet.Damage;
                        if (enemy.Health == 0) {
                            enemyList[key].Dead = true;
                            context.clearRect(enemy.X, enemy.Y, enemyImg.width, enemyImg.height);
                        }
                        clearInterval(timerId1);
                    }
                }
                X += (distanceX / iters) * factor1;
                Y += bullet.Speed * factor2;
            }
        }

        // Запускаем функцию отрисовки пули каждые 0.05 секунды
        const timerId1 = setInterval(() => {
            // Когда пуля выйдет за границу экрана, то отрисовка пректратится
            if (X >= canvas.width ||
                Y >= canvas.height ||
                X + bullet.Size <= 0 ||
                Y + bullet.Size <= 0) {
                context.clearRect(X, Y, bullet.Size, bullet.Size);
                clearInterval(timerId1);
            }
            // Разделим холст на четыре сектора
            // Право низ
            if (mouseLoc.Y >= gunEnd.Y && mouseLoc.X >= gunEnd.X) {
                gunShot(1, 1);
            }
            // Лево низ
            else if (mouseLoc.Y >= gunEnd.Y && mouseLoc.X < gunEnd.X) {
                gunShot(-1, 1);
            }
            // Право верх
            else if (mouseLoc.Y < gunEnd.Y && mouseLoc.X >= gunEnd.X) {
                gunShot(1, -1);
            }
            // Лево верх
            else if (mouseLoc.Y < gunEnd.Y && mouseLoc.X < gunEnd.X) {
                gunShot(-1, -1);
            }
        }, 17);
    }
}, false)


// Поворот персонажа при стрельбе вправо
const turnRight = () => {
    context.clearRect(sprite.X, sprite.Y, img.width, img.height);
    // Отрисовывать спрайта только когда загрузится картинка со спрайтом
    img.onload = function () {
        context.drawImage(img, sprite.X, sprite.Y);
    };
    img.src = 'images/mainSpriteRight.png';
}

// Поворот персонажа при стрельбе влево
const turnLeft = () => {
    context.clearRect(sprite.X, sprite.Y, img.width, img.height);
    // Отрисовывать спрайта только когда загрузится картинка со спрайтом
    img.onload = function () {
        context.drawImage(img, sprite.X, sprite.Y);
    };
    img.src = 'images/mainSpriteLeft.png';
}

// Функция, определяющая позицию одного предмета относительно другого
const wrongLoc = (X1, Y1, X2, Y2, img1, img2) => {
    return (X1 >= X2 && X1 <= X2 + img2.width && Y1 >= Y2 && Y1 <= Y2 + img2.height) ||
        (X1 >= X2 && X1 <= X2 + img2.width && Y1 + img1.height >= Y2 && Y1 + img1.height <= Y2 + img2.height) ||
        (X1 + img1.width >= X2 && X1 + img1.width <= X2 + img2.width && Y1 >= Y2 && Y1 <= Y2 + img2.height) ||
        (X1 + img1.width >= X2 && X1 + img1.width <= X2 + img2.width && Y1 + img1.height >= Y2 && Y1 + img1.height <= Y2 + img2.height);
}

turnRight();
