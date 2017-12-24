function trapezoid (topLength, bottomLength, width, centreX, centreY) {
  cx.beginPath()
  cx.moveTo(centreX - topLength / 2, centreY - width / 2);
  cx.lineTo(centreX + topLength / 2, centreY - width / 2);
  cx.lineTo(centreX + bottomLength / 2, centreY + width / 2);
  cx.lineTo(centreX - bottomLength / 2, centreY + width / 2);
  cx.lineTo(centreX - topLength / 2, centreY - width / 2);
  cx.stroke()
}
function diamond (color, width, centreX, centreY) {
  // move the origin to the centre of the diamond
  cx.beginPath()
  cx.save();
  cx.translate(centreX, centreY);
  cx.rotate(45 * Math.PI / 180);
  cx.fillStyle = color;
  cx.fillRect(-width / 2, -width / 2, width, width);
  cx.stroke();
  cx.restore();
}
function zigzag (startX, startY, horizontalWidth, zigZagHeight, noOfRepeat) {
  cx.beginPath();
  cx.moveTo(startX, startY)
  for (var x = 1; x <= noOfRepeat * 2; x++) {
    if (x % 2 === 0) {
      cx.lineTo(startX, startY + (zigZagHeight / 2) * x);
    } else {
      cx.lineTo(startX + horizontalWidth, startY + (zigZagHeight / 2) * x);
    }
  }
  cx.stroke();
}
function squareRootSpiral (centreX, centreY, numberOfSpirals) {
  cx.beginPath();
  cx.save();
  cx.translate(centreX, centreY);
  for (var x = 1; x <= numberOfSpirals; x++) {
    cx.rotate(-Math.atan(1 / Math.sqrt(x)));
    cx.moveTo(Math.sqrt(x), 0);
    cx.lineTo(Math.sqrt(x), 1);
  }
  cx.stroke();
  cx.restore();
}
function spiral (centreX, centreY, a, b) {
  cx.beginPath();
  cx.moveTo(centreX, centreY);
  for (var i = 0; i < 200; i++) {
    var angle = 0.1 * i;
    var x = centreX + (a + b * angle) * Math.cos(angle);
    var y = centreY + (a + b * angle) * Math.sin(angle);
    cx.lineTo(x, y);
  }
  cx.stroke();
}
function star (centreX, centreY, radius, colour) {
  cx.beginPath();
  cx.moveTo(centreX + radius, centreY);
  for (var i = 1; i < 9; i++) {
    cx.quadraticCurveTo(centreX, centreY, centreX + radius * Math.cos(i * 45 * Math.PI / 180), centreY + radius * Math.sin(i * 45 * Math.PI / 180));
  }
  cx.fillStyle = colour;
  cx.fill();
  cx.closePath();
}

var cx = document.querySelector('canvas').getContext('2d');
trapezoid(40, 80, 40, 40, 40);
diamond('red', 50, 120, 35);
zigzag(170, 5, 80, 12, 6);
squareRootSpiral(315, 140, 500);
spiral(315, 50, 2.5, 2.5);
star(425, 45, 50, '#ffa500');
