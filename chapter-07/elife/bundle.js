(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}

function dirPlus (dir, n) {
  var index = directionNames.indexOf(dir)
  return directionNames[(index + n + 8) % 8]
}
const directionNames = 'n ne e se s sw w nw'.split(' ')

function Wall () {
  this.color = '#027ada'
}
function BouncingCritter () {
  this.direction = randomElement(directionNames)
  this.color = 'red'
}

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) !== ' ') {
    this.direction = view.find(' ') || 's'
  }
  return {type: 'move', direction: this.direction}
}

function WallFollower () {
  this.dir = 's'
  this.color = 'yellow'
}
WallFollower.prototype.act = function (view) {
  var start = this.dir
  if (view.look(dirPlus(this.dir, -3)) !== ' ') {
    start = this.dir = dirPlus(this.dir, -2)
  }
  while (view.look(this.dir) !== ' ') {
    this.dir = dirPlus(this.dir, 2)
    if (this.dir === start) break
  }
  return { type: 'move', direction: this.dir }
}

function Plant () {
  this.energy = 3 + Math.random() * 4
  this.color = '#abff82'
}
Plant.prototype.act = function(view) {
  if (this.energy > 15) {
    var space = view.find(' ')
    if (space)
      return {type: "reproduce", direction: space}
  }
  if (this.energy < 20)
    return {type: "grow"}
}

function PlantEater () {
  this.energy = 20
  this.color = "#00deff"
}

PlantEater.prototype.act = function (view) {
  var space = view.find(' ')
  if (this.energy > 60 && space) return {type: 'reproduce', direction: space}
  var plant = view.find('*')
  if (plant) return {type: 'eat', direction: plant}
  if (space) return {type: 'move', direction: space}
}

var actionTypes = Object.create(null)

actionTypes.grow = function (critter) {
  critter.energy += 0.5
  return true
}

actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector)
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 1
  this.grid.set(vector, null)
  this.grid.set(dest, critter)
  return true
};

actionTypes.eat = function (critter, vector, action) {
  var dest = this.checkDestination(action, vector)
  var atDest = dest != null && this.grid.get(dest)
  if (!atDest || atDest.energy == null)
    return false
  critter.energy += atDest.energy;
  this.grid.set(dest, null)
  return true
}

actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend,
                             critter.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};
// SmartPlantEater
// Does not breed very fast, which makes the cycles between abundance and famine intense.
// Does not wipe out the local plant life
// Targets plants or waits for plants to grow near by.

function SmartPlantEater () {
  this.energy = 20
  this.didNotReproduceInPreviousTurn = true
}

SmartPlantEater.prototype.act = function (view) {
  var space = view.find(' ')
  if (this.didNotReproduceInPreviousTurn && space) {
    this.didNotReproduceInPreviousTurn = false
    return {type: 'reproduce', direction: space}
  }
  this.didNotReproduceInPreviousTurn = true
  var plant = view.find('*')
  if (view.world.numberOfPlants > 1 && plant) {
    return {type: 'eat', direction: plant}
  }
}

module.exports = {
  randomElement: randomElement,
  dirPlus: dirPlus,
  Wall: Wall,
  directionNames: directionNames,
  BouncingCritter: BouncingCritter,
  WallFollower: WallFollower,
  Plant: Plant,
  PlantEater: PlantEater,
  SmartPlantEater: SmartPlantEater
}

},{}],2:[function(require,module,exports){
function Grid (width, height) {
  this.width = width
  this.height = height
  this.space = new Array(width * height)
}
Grid.prototype.isInside = function (vector) {
  return vector.x >= 0 && vector.x < this.width && vector.y >= 0 && vector.y < this.height
}

Grid.prototype.forEach = function (f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + this.width * y]
      if (value !== null) f.call(context, value, new Vector(x, y))
    }
  }
}
Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y]
}
Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value
}

Grid.prototype.forEach = function (f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + this.width * y]
      if (value !== null) f.call(context, value, new Vector(x, y))
    }
  }
}

function Vector (x, y) {
  this.x = x
  this.y = y
}
Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y)
}

const directionNames = 'n ne e se s sw w nw'.split(' ')

const directions = {
  'n': new Vector(0, -1),
  'ne': new Vector(1, -1),
  'e': new Vector(1, 0),
  'se': new Vector(1, 1),
  's': new Vector(0, 1),
  'sw': new Vector(-1, 1),
  'w': new Vector(-1, 0),
  'nw': new Vector(-1, -1)
}

module.exports = {
  Grid: Grid,
  Vector: Vector,
  directionNames: directionNames,
  directions: directions
}

},{}],3:[function(require,module,exports){
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

},{"./ecosystem":1,"./grid":2,"./world":4}],4:[function(require,module,exports){
const grid = require('./grid')

function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}
function elementFromChar (legend, ch) {
  if (ch === ' ') return null
  var element = new legend[ch]()
  element.originChar = ch
  return element
}
function charFromElement (element) {
  if (element === null) return ' '
  else return element.originChar
}

function View (world, vector) {
  this.world = world
  this.vector = vector
}
View.prototype.look = function (dir) {
  var target = this.vector.plus(directions[dir])
  if (this.world.grid.isInside(target)) {
    return charFromElement(this.world.grid.get(target))
  } else return '#'
}
View.prototype.find = function (ch) {
  var found = this.findAll(ch)
  if (found.length === 0) return null
  return randomElement(found)
}

View.prototype.findAll = function (ch) {
  var found = []
  for (var dir in directions) {
    if (this.look(dir) === ch) found.push(dir)
  }
  return found
}
function World (map, legend) {
  this.legend = legend
  this.grid = new grid.Grid(map[0].length, map.length)

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++) {
      this.grid.set(new grid.Vector(x, y), elementFromChar(this.legend, line[x]))
    }
  }, this)
}

World.prototype.toString = function () {
  var output = ''
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      output += charFromElement(this.grid.get(new grid.Vector(x, y)))
    }
    output += '\n'
  }
  return output
}

World.prototype.numberOfPlants = function () {
  var numberOfPlants = 0
  this.grid.forEach(function (element, vector) {
    if (charFromElement(element) === '*') numberOfPlants++
  }, this)
  return numberOfPlants
}
World.prototype.turn = function () {
  var acted = []
  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) === -1) {
      acted.push(critter)
      this.letAct(critter, vector)
    }
  }, this)
}
World.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector))
  if (action && action.type === 'move') {
    var dest = this.checkDestination(action, vector)
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null)
      this.grid.set(dest, critter)
    }
  }
}

World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) { // defensive check
    var dest = vector.plus(directions[action.direction]) // get location
    if (this.grid.isInside(dest)) return dest // defensive check
  }
}
function LifelikeWorld (map, legend) {
  World.call(this, map, legend)
}

LifelikeWorld.prototype = Object.create(World.prototype)

var actionTypes = Object.create(null)

LifelikeWorld.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector))
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter, vector, action)
  if (!handled) {
    critter.energy -= 0.2
    if (critter.energy <= 0) this.grid.set(vector, null)
  }
}

const directions = {
  'n': new grid.Vector(0, -1),
  'ne': new grid.Vector(1, -1),
  'e': new grid.Vector(1, 0),
  'se': new grid.Vector(1, 1),
  's': new grid.Vector(0, 1),
  'sw': new grid.Vector(-1, 1),
  'w': new grid.Vector(-1, 0),
  'nw': new grid.Vector(-1, -1)
}

module.exports = {
  randomElement: randomElement,
  elementFromChar: elementFromChar,
  charFromElement: charFromElement,
  View: View,
  World: World,
  LifelikeWorld: LifelikeWorld,
  directions: directions
}

},{"./grid":2}]},{},[3]);
