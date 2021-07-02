`
TO DO LIST:

1) Написать логику для поведеня соперников

2) Научить компьютер регистрировать касания пуль и врагов

`
import { enemySpawn, enemyList } from "./enemy.js";
let enemyDead;

export let canvas = document.getElementById("canvas");
export let context = canvas.getContext("2d");

export let img = new Image();
img.src = 'images/mainSpriteRight.png';
let iters;

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
    speed: 5
};
// Спавнит 3 врагов рядом с персонажем
enemySpawn(3);

setTimeout(() => {
    console.log(enemyList[1]);
}, 1);

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
    let gunEnd = {
        X: sprite.X + img.width + bullet.size / 2 + 1,
        Y: sprite.Y + img.height / 2 - 10
    };

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
            // Проверка убит враг или нет
            iters = Math.abs(gunEnd.X - mouseLoc.X) / bullet.speed;
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - bullet.speed * factor1, Y - 5.5 - (distantY / iters) * factor2, 11, 11);
            }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            // Если пуля попала во врага, то враг и пуля исчезают
            // if ((X >= enemyCoords.X && X <= enemyCoords.X + enemyImg.width) && (Y <= enemyCoords.Y + enemyImg.height && Y >= enemyCoords.Y) && !enemyDead) {
            //     context.clearRect(enemyCoords.X, enemyCoords.Y, enemyImg.width, enemyImg.height);
            //     context.clearRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            //     enemyDead = true;
            //     clearInterval(timerId);
            // }
            X += bullet.speed * factor1;
            Y += (distantY / iters) * factor2;
        }
        if (Math.abs(mouseLoc.X - gunEnd.X) < Math.abs(mouseLoc.Y - gunEnd.Y)) {
            iters = Math.abs(gunEnd.Y - mouseLoc.Y) / bullet.speed;
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - (distantX / iters) * factor1, Y - 5.5 - bullet.speed * factor2, 11, 11);
            }
            // if ((X >= enemyCoords.X && X <= enemyCoords.X + enemyImg.width) && (Y <= enemyCoords.Y + enemyImg.height && Y >= enemyCoords.Y) && !enemyDead) {
            //     context.clearRect(enemyCoords.X, enemyCoords.Y, enemyImg.width, enemyImg.height);
            //     context.clearRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            //     enemyDead = true;
            //     clearInterval(timerId);
            // }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
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

turnRight();