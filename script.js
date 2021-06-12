let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const drawMesuare = 30;
const sprite = {

}

// Корректировка размеров холста
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const mainSprite = () => {
    let img = new Image();
    img.onload = function() {
        context.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
    };
    img.src = 'images/mainSprite.png';
}

mainSprite();