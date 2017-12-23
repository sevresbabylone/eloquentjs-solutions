function Vector (x, y) {
  this.x = x
  this.y = y
}
Vector.prototype.plus = function (vector) {
  return new Vector(vector.x + this.x, vector.y + this.y)
}

Vector.prototype.minus = function (vector) {
  return new Vector(this.x - vector.x, this.y - vector.y)
}

Object.defineProperty(Vector.prototype, 'length', {
  get: function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
})
