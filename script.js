`
TO DO LIST:

1) Написать логику для поведеня соперников

2) Переделать регестрацию попаданий

`
import { enemySpawn, enemyList, img as enemyImg, enemyMovement } from "./enemy.js";

export let canvas = document.getElementById("canvas");
export let context = canvas.getContext("2d");
export let img = new Image();
img.src = 'images/mainSpriteRight.png';
let iters;
let enemyCoords;
// Характеристики пули
export const bullet = {
    size: 10,
    speed: 15
};

context.fillStyle = 'black';

// Корректировка размеров холста
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// Характеристики персонажа 
export let sprite = {
    X: canvas.width / 2 - img.width / 2,
    Y: canvas.height / 2 - img.height / 2,
    speed: 7
};

// Спавнит 3 врагов рядом с персонажем
enemySpawn(3, script => {
    let timerId2 = setInterval(() => {
        console.log(enemyList);
        for (let key in enemyList){
            enemyMovement(enemyList[key].X, enemyList[key].Y, key);
        }
    }, 100)
    setTimeout(() => { clearInterval(timerId2); }, 10000);
});

// Функция, отслеживающая состоние клавишей
let pressedKeys = {};
onkeydown = onkeyup = function (e) {
    pressedKeys[e.keyCode] = e.type == 'keydown';
    // Функция бинда кнопок
    const movement = (key_code, axis, factor) => {
        if (pressedKeys[key_code]) {
            context.clearRect(sprite.X, sprite.Y, img.width, img.height);
            if (axis == sprite.Y) {
                sprite.Y += sprite.speed * factor;
            } else {
                sprite.X += sprite.speed * factor;
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

// При нажатии на холст, вылетает пуля
canvas.addEventListener('mousedown', (e) => {
    // Координаты места нажатия на холст
    const mouseLoc = {
        X: e.offsetX,
        Y: e.offsetY
    };

    // Координаты конца ствола
    const gunEnd = {
        X: sprite.X + img.width + bullet.size / 2 + 1,
        Y: sprite.Y + img.height / 2 - 10
    };

    const potentiallyEnemies = {};

    // Взависимости от направления полета пули вычесляется количество врагов, которых она может подстрелить.
    // Это сделано для того, чтобы не проверять на каждой итерации отрисовки пули, попала ли она во врага,
    // который находится на другом конце карты
    if (mouseLoc.X <= sprite.X - bullet.size / 2 - 1 && mouseLoc.Y <= gunEnd.Y) {
        for (let key in enemyList) {
            if (enemyList[key].X <= sprite.X - bullet.size / 2 - 1 && enemyList[key].Y <= gunEnd.Y) {
                potentiallyEnemies[key] = enemyList[key];
            }
        }
    }
    else if (mouseLoc.X <= sprite.X - bullet.size / 2 - 1 && mouseLoc.Y > gunEnd.Y) {
        for (let key in enemyList) {
            if (enemyList[key].X <= sprite.X - bullet.size / 2 - 1 && enemyList[key].Y > gunEnd.Y ||
                enemyList[key].X <= sprite.X - bullet.size / 2 - 1 && enemyList[key].Y + enemyImg.height > gunEnd.Y) {
                potentiallyEnemies[key] = enemyList[key];
            }
        }
    }
    else if (mouseLoc.X > sprite.X + img.width + bullet.size / 2 + 1 && mouseLoc.Y <= gunEnd.Y) {
        for (let key in enemyList) {
            if (enemyList[key].X > sprite.X + img.width + bullet.size / 2 + 1 && enemyList[key].Y <= gunEnd.Y) {
                potentiallyEnemies[key] = enemyList[key];
            }
        }
    }
    else if (mouseLoc.X > sprite.X + img.width + bullet.size / 2 + 1 && mouseLoc.Y > gunEnd.Y) {
        for (let key in enemyList) {
            if (enemyList[key].X > sprite.X + img.width + bullet.size / 2 + 1 && enemyList[key].Y > gunEnd.Y ||
                enemyList[key].X > sprite.X + img.width + bullet.size / 2 + 1 && enemyList[key].Y + enemyImg.height > gunEnd.Y) {
                potentiallyEnemies[key] = enemyList[key];
            }
        }
    }
    // console.log(potentiallyEnemies);

    // Игрок не может стрелять вверх и вниз
    if (mouseLoc.X >= sprite.X - bullet.size / 2 - 1 && mouseLoc.X <= sprite.X + img.width + bullet.size / 2 + 1) {
        return;
    }
    // Эти блоки отвечают за поворот спрайта в сторону выстрела
    else if (mouseLoc.X >= sprite.X - bullet.size / 2 - 1) {
        if (img.src != 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
            turnRight();
        }
        gunEnd.X = sprite.X + img.width + bullet.size / 2 + 1;
    }
    else if (mouseLoc.X <= sprite.X + img.width + bullet.size / 2 + 1) {
        if (img.src != 'http://127.0.0.1:5500/images/mainSpriteLeft.png') {
            turnLeft();
        }
        gunEnd.X = sprite.X - bullet.size / 2 - 1;
    }
    let X = gunEnd.X;
    let Y = gunEnd.Y;
    let distantY = Math.abs(mouseLoc.Y - gunEnd.Y);
    let distantX = Math.abs(mouseLoc.X - gunEnd.X);

    // Функция отвечающая за полет пули
    const gunShot = (factor1, factor2) => {
        if (Math.abs(mouseLoc.X - gunEnd.X) > Math.abs(mouseLoc.Y - gunEnd.Y)) {
            iters = Math.abs(gunEnd.X - mouseLoc.X) / bullet.speed;
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - bullet.speed * factor1, Y - 5.5 - (distantY / iters) * factor2, 11, 11);
            }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            // Проверка на попадание в соперника
            for (let key in potentiallyEnemies) {
                enemyCoords = potentiallyEnemies[key];
                if (wrongLoc(X, Y, enemyCoords.X, enemyCoords.Y, bullet.size, enemyImg) && !enemyCoords.Dead) {
                    enemyList[key].Dead = true;
                    context.clearRect(enemyCoords.X, enemyCoords.Y, enemyImg.width, enemyImg.height);
                    context.clearRect(X - (bullet.size + 1) / 2, Y - (bullet.size + 1) / 2, bullet.size + 1, bullet.size + 1);
                    clearInterval(timerId);
                }
            }
            X += bullet.speed * factor1;
            Y += (distantY / iters) * factor2;
        }
        if (Math.abs(mouseLoc.X - gunEnd.X) < Math.abs(mouseLoc.Y - gunEnd.Y)) {
            iters = Math.abs(gunEnd.Y - mouseLoc.Y) / bullet.speed;
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - (distantX / iters) * factor1, Y - 5.5 - bullet.speed * factor2, 11, 11);
            }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            // Проверка на попадание в соперника
            for (let key in potentiallyEnemies) {
                enemyCoords = potentiallyEnemies[key];
                if (wrongLoc(X, Y, enemyCoords.X, enemyCoords.Y, bullet.size, enemyImg) && !enemyCoords.Dead) {
                    enemyList[key].Dead = true;
                    context.clearRect(enemyCoords.X, enemyCoords.Y, enemyImg.width, enemyImg.height);
                    context.clearRect(X - (bullet.size + 1) / 2, Y - (bullet.size + 1) / 2, bullet.size + 1, bullet.size + 1);
                    clearInterval(timerId);
                }
            }
            X += (distantX / iters) * factor1;
            Y += bullet.speed * factor2;
        }
    }

    // Запускаем функцию отрисовки пули каждые 0.05 секунды
    const timerId = setInterval(() => {
        // Когда пуля выйдет за границу экрана, то отрисовка пректратится
        if (X - bullet.size / 2 >= canvas.width ||
            Y - bullet.size / 2 >= canvas.height ||
            X - bullet.size / 2 <= 0 ||
            Y - bullet.size / 2 <= 0) {
            context.clearRect(X, Y, bullet.size, bullet.size);
            clearInterval(timerId);
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
    }, 50);
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

// Функция, определяющая позиции пуль относительно пуль
const wrongLoc = (X1, Y1, X2, Y2, img1, img2) => {
    return (X1 >= X2 && X1 <= X2 + img2.width && Y1 >= Y2 && Y1 <= Y2 + img2.height) ||
        (X1 >= X2 && X1 <= X2 + img2.width && Y1 + img1.height >= Y2 && Y1 + img1.height <= Y2 + img2.height) ||
        (X1 + img1.width >= X2 && X1 + img1.width <= X2 + img2.width && Y1 >= Y2 && Y1 <= Y2 + img2.height) ||
        (X1 + img1.width >= X2 && X1 + img1.width <= X2 + img2.width && Y1 + img1.height >= Y2 && Y1 + img1.height <= Y2 + img2.height);
}

turnRight();