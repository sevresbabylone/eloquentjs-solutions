function Sequence () {
  this.values = arguments
  this.counter = 0
}

Sequence.prototype.next = function () {
  if (this.counter === this.values.length) {
    return null
  } else {
    var current = this.values[this.counter]
    this.counter++
    return current
  }
}

function logFive (sequence) {
  for (var i = 0; i < 5; i++) {
    var current = sequence.next()
    if (current) console.log(current)
    else break
  }
}

function ArraySeq (array) {
  this.values = array
}
ArraySeq.prototype = new Sequence()
function RangeSeq (from, to) {
  this.values = []
  for (var i = from; i < to ; i++) {
    this.values.push(i)
  }
}
RangeSeq.prototype = new Sequence()
logFive(new RangeSeq(100, 1000))
