const grid = require('./grid')
const ecosystem = require('./ecosystem')
const world = require('./world')

var myWorld = new world.LifelikeWorld(
             ['############################',
              '#      #    #      o      ##',
              '#                          #',
              '#          #####           #',
              '##         #   #    ##     #',
              '###           ##     #     #',
              '#           ###      # *   #',
              '#   ####          ~  *     #',
              '#   ##       o             #',
              '# o  #         o       ### #',
              '#    #                     #',
              '############################'],
  {'#': ecosystem.Wall,
   '~': ecosystem.WallFollower,
   'o': ecosystem.BouncingCritter,
   '*': ecosystem.Plant,
   '@': ecosystem.PlantEater}
)
var cx = document.querySelector('canvas').getContext('2d')

myWorld.turn()
updateAnimation()
setInterval(function () {
  myWorld.turn()
  console.log(myWorld.toString())
  updateAnimation()
}, 300)

function updateAnimation () {
  cx.fillStyle = '#22313f'
  cx.clearRect(0, 0, myWorld.grid.width * 20, myWorld.grid.height * 20)
  cx.fillRect(0, 0, myWorld.grid.width * 20, myWorld.grid.height * 20)
  myWorld.grid.forEach(function (element, vector) {
    if (element.color) {
      cx.fillStyle = element.color
      cx.beginPath()
      cx.rect(vector.x * 20, vector.y * 20, 20, 20)
      cx.fill()
    }
  }, world)
}
