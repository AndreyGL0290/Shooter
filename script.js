`
TO DO LIST:

1) Убрать грязь у отрисовки пули (нажми на холст и все поймешь)

2) Сделать движение равномерным в независимости от места нажатия (mouseLos)
`

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let img;
let step;
const drawMesuare = 30;
const sprite = {

};

const bullet = {
    size: 10
};

context.fillStyle = 'black';

// Корректировка размеров холста
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;


// Отрисовка спрайта
const mainSprite = () => {
    img = new Image();
    // Отрисовывать спрайта только когда загрузится картинка со спрайтом
    img.onload = function() {
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
        X: canvas.width / 2 + img.width / 2 + bullet.size / 2,
        Y: canvas.height / 2 - 14 + bullet.size / 2
    };

    let step = 0;
    const breaker = 9;
    const movementX = (mouseLoc.X - gunEnd.X) / breaker;
    const movementY = (mouseLoc.Y - gunEnd.Y) / breaker;

    // запускаем функцию отрисовки пули каждые 0.5 секунды, когда она выйдет за границу экрана - отрисовка прекратится
    const timerId = setInterval(() => {
        if ((gunEnd.X + movementX * step) - 5 >= canvas.width ||
        (gunEnd.Y + movementY * step) - 5 >= canvas.height ||
        (gunEnd.X + movementX * step) - 5 <= 0 ||
        (gunEnd.Y + movementY * step) - 5 <= 0){
            clearInterval(timerId);
        }
        context.fillRect((gunEnd.X + movementX * step) - 5, (gunEnd.Y + movementY * step) - 5, bullet.size, bullet.size);
        if (step != 0){
            context.clearRect((gunEnd.X + movementX * (step - 1)) - 5, (gunEnd.Y + movementY * (step - 1)) - 5, bullet.size, bullet.size);
        }
        step += 1;
    }, 500);

}, false)

mainSprite();