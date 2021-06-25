`
TO DO LIST:

1) Сделать движение равномерным в независимости от места нажатия (mouseLoc)

`

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let img;
let step;
const drawMesuare = 30;
const sprite = {

};

const bullet = {
    size: 10,
    speed: 15
};

context.fillStyle = 'black';

// Корректировка размеров холста
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;


// Отрисовка спрайта
const mainSprite = () => {
    img = new Image();
    // Отрисовывать спрайта только когда загрузится картинка со спрайтом
    img.onload = function () {
        context.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
    };
    img.src = 'images/mainSprite.png';
}

// При нажатии на холст, вылетает пуля
canvas.addEventListener('mousedown', func = (e) => {
    // Координаты места нажатия на холст
    const mouseLoc = {
        X: e.offsetX,
        Y: e.offsetY
    };

    // Координаты коца ствола
    const gunEnd = {
        X: (canvas.width / 2 + img.width / 2 + bullet.size / 2) + 1,
        Y: canvas.height / 2 - 14 + bullet.size / 2
    };

    let X = gunEnd.X;
    let Y = gunEnd.Y;

    // Отношение вектора X и вектора Y

    // Запускаем функцию отрисовки пули каждые 0.1 секунды, когда она выйдет за границу экрана - отрисовка прекратится
    const timerId = setInterval(() => {
        if (X - bullet.size / 2 >= canvas.width ||
            Y - bullet.size / 2 >= canvas.height ||
            X - bullet.size / 2 <= 0 ||
            Y - bullet.size / 2 <= 0) {
            clearInterval(timerId);
        }

        // Разделим холст на четыре сектора
        // Право низ
        if (mouseLoc.Y >= gunEnd.Y && mouseLoc.X >= gunEnd.X) {
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - bullet.speed * Math.abs(ratio), Y - 5.5 - bullet.speed, 11, 11);
            }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            X += bullet.speed * Math.abs(ratio);
            Y += bullet.speed;
        }
        // Лево низ
        else if (mouseLoc.Y >= gunEnd.Y && mouseLoc.X < gunEnd.X) {
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 + bullet.speed * Math.abs(ratio), Y - 5.5 - bullet.speed, 11, 11);
            }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            X -= bullet.speed * Math.abs(ratio);
            Y += bullet.speed;
        }
        // Право верх
        else if (mouseLoc.Y < gunEnd.Y && mouseLoc.X >= gunEnd.X) {
            if (X != gunEnd.X) {
                context.clearRect(X - 5.5 - bullet.speed * Math.abs(ratio), Y - 5.5 + bullet.speed, 11, 11);
            }
            context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
            X += bullet.speed * Math.abs(ratio);
            Y -= bullet.speed;
        }
        // Лево верх
        else if (mouseLoc.Y < gunEnd.Y && mouseLoc.X < gunEnd.X) {
            let iters;
            let distantY = Math.abs(mouseLoc.Y - gunEnd.Y);
            let distantX = Math.abs(mouseLoc.X - gunEnd.X);
            if (Math.abs(mouseLoc.X - gunEnd.X) > Math.abs(mouseLoc.Y - gunEnd.Y)){
                iters = Math.abs(gunEnd.X - mouseLoc.X) / bullet.speed;
                if (X != gunEnd.X){
                    context.clearRect(X - 5.5 + bullet.speed, Y - 5.5 + distantY / iters, 11, 11);
                }
                context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
                X -= bullet.speed;
                Y -= distantY / iters;
            }
            if (Math.abs(mouseLoc.X - gunEnd.X) < Math.abs(mouseLoc.Y - gunEnd.Y)){
                iters = Math.abs(gunEnd.Y - mouseLoc.Y) / bullet.speed;
                if (X != gunEnd.X){
                    context.clearRect(X - 5.5 + distantX / iters, Y - 5.5 + bullet.speed, 11, 11);
                }
                context.fillRect(X - bullet.size / 2, Y - bullet.size / 2, bullet.size, bullet.size);
                X -= distantX / iters;
                Y -= bullet.speed;
            }
        }
    }, 10);
}, false)

mainSprite();