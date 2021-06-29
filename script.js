`
TO DO LIST:

1) Сделать соперников

`

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let img = new Image();
img.src = 'images/mainSpriteRight.png';
let iters;

// Характеристики пули
const bullet = {
    size: 10,
    speed: 15
};

context.fillStyle = 'black';

// Корректировка размеров холста
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// Характеристики персонажа 
let sprite = {
    X: canvas.width / 2 - img.width / 2,
    Y: canvas.height / 2 - img.height / 2,
    speed: 5
};

// Функция, отслеживающая состоние клавишей
let pressedKeys = {};
onkeydown = onkeyup = function (e) {
    pressedKeys[e.keyCode] = e.type == 'keydown';
    // Кнопка W
    if (pressedKeys[87] && sprite.Y > 0) {
        context.clearRect(sprite.X, sprite.Y, img.width, img.height);
        sprite.Y -= sprite.speed;
        if (img.src == 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
            // Отрисовывает персонажа с другими координатами
            turnRight();
        } else {
            // Отрисовывает персонажа с другими координатами
            turnLeft();
        }
    }
    // Кнопка S
    if (pressedKeys[83] && sprite.Y < canvas.height - img.height) {
        context.clearRect(sprite.X, sprite.Y, img.width, img.height);
        sprite.Y += sprite.speed;
        if (img.src == 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
            // Отрисовывает персонажа с другими координатами
            turnRight();
        } else {
            // Отрисовывает персонажа с другими координатами
            turnLeft();
        }
    }
    // Кнопка A
    if (pressedKeys[65] && sprite.X > 0) {
        context.clearRect(sprite.X, sprite.Y, img.width, img.height);
        sprite.X -= sprite.speed;
        if (img.src == 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
            // Отрисовывает персонажа с другими координатами
            turnRight();
        } else {
            // Отрисовывает персонажа с другими координатами
            turnLeft();
        }
    }
    // Кнопка D
    if (pressedKeys[68] && sprite.X < canvas.width - img.width) {
        context.clearRect(sprite.X, sprite.Y, img.width, img.height);
        sprite.X += sprite.speed;
        if (img.src == 'http://127.0.0.1:5500/images/mainSpriteRight.png') {
            // Отрисовывает персонажа с другими координатами
            turnRight();
        } else {
            // Отрисовывает персонажа с другими координатами
            turnLeft();
        }
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
            X += bullet.speed * factor1;
            Y += (distantY / iters) * factor2;
        }
        if (Math.abs(mouseLoc.X - gunEnd.X) < Math.abs(mouseLoc.Y - gunEnd.Y)) {
            iters = Math.abs(gunEnd.Y - mouseLoc.Y) / bullet.speed;
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - (distantX / iters) * factor1, Y - 5.5 - bullet.speed * factor2, 11, 11);
            }
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