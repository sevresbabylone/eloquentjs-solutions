var cx = document.querySelector('canvas').getContext('2d')

var lastTime = null
var container = {
  x: 0,
  y: 0,
  width: 500,
  height: 400
}
var balls = [{
  x: 50,
  y: 100,
  r: 10,
  vx: 10,
  vy: 9,
  colour: '#027ada'
}, {
  x: 150,
  y: 80,
  r: 20,
  vx: 15,
  vy: 8,
  colour: '#00a5f1'
}, {
  x: 90,
  y: 150,
  r: 5,
  vx: 5,
  vy: 15,
  colour: '#00cacd'
}, {
  x: 100,
  y: 50,
  r: 15,
  vx: 8,
  vy: 10,
  colour: '#35ffa1'
}]

function frame (time) {
  cx.fillStyle = '#22313f'
  if (lastTime != null) updateAnimation(Math.min(100, time - lastTime) / 1000)
  lastTime = time
  window.requestAnimationFrame(frame)
}
window.requestAnimationFrame(frame)

function updateAnimation (step) {
  cx.clearRect(container.x, container.y, container.width, container.height)
  cx.fillRect(container.x, container.y, container.width, container.height)
  balls.forEach(function (ball) {
    cx.beginPath()
    cx.fillStyle = ball.colour
    cx.arc(ball.x, ball.y, ball.r, 0, 7)
    cx.fill()
    if (ball.x - ball.r + ball.vx < container.x || ball.x + ball.r + ball.vx > container.x + container.width) {
      ball.vx = -ball.vx
    }
    if (ball.y + ball.r + ball.vy > container.y + container.height || ball.y - ball.r + ball.vy < container.y) {
      ball.vy = -ball.vy
    }
    ball.x += ball.vx
    ball.y += ball.vy
  })
}
