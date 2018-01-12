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
  console.log(acted)
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

actionTypes.grow = function (critter) {
  critter.energy += 0.5
  return true
}

actionTypes.move = function (critter, vector, action) {
  var dest = this.checkDestination(action, vector)
  if (dest == null || critter.energy <= 1 || this.grid.get(dest) != null) {
    console.log('not enough energy')
    return false
  }

  critter.energy -= 1
  this.grid.set(vector, null)
  this.grid.set(dest, critter)
  return true
}

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
}
LifelikeWorld.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector))
  var handled = action && action.type in actionTypes && actionTypes[action.type].call(this, critter, vector, action)
  console.log('handled', action.type in actionTypes)
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
