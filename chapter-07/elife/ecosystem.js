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
