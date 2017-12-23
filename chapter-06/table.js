// => minHeight() returns a number indicating the minimum height this cell requires (in lines)
// minWidth() => returns a number indicating this cell's minimum width (in characters)
// draw(width, height) => returns an array of length 'height', which contains a series of strings
// that are each width characters wide. This represents the content of the cell

// The first part of the program computes arrays of minimum column widths and row heights
// for a grid of cells. The rows variable will hold an array of arrays, with each inner array
// representing a row of cells.
var MOUNTAINS = require('./mountains')

// computes an array of minimum row heights
function rowHeights (rows) {
  return rows.map(function (row) {
    return row.reduce(function (max, cell) {
      return Math.max(max, cell.minHeight())
    }, 0)
  })
}
// computes an array of minimum column widths
function colWidths (rows) {
  return rows[0].map(function (_, i) {
    return rows.reduce(function (max, row) {
      return Math.max(max, row[i].minWidth())
    }, 0)
  })
}

// draws tables
function drawTable (rows) {
  var heights = rowHeights(rows)
  var widths = colWidths(rows)
  function drawLine (blocks, lineNo) {
    return blocks.map(function (block) {
      return block[lineNo]
    }).join(' ')
  }
  // converts a cell object in a row to a block, which are arrays of strings
  // representing the content of cells i.e. ['3776'], or ['name', '----']
  // takes first block in row and prints it
  function drawRow (row, rowNum) {
    var blocks = row.map(function (cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum])
    })
    // assumes that all blocks in row have same number of lines
    // maps line 1 of block, and line 2 of block
    return blocks[0].map(function (_, lineNo) {
      return drawLine(blocks, lineNo)
    }).join('\n')
  }
  return rows.map(drawRow).join('\n')
}

function repeat (string, times) {
  var result = ''
  for (var i = 0; i < times; i++) {
    result += string
  }
  return result
}

function TextCell (text) {
  this.text = text.split('\n')
}

TextCell.prototype.minWidth = function () {
  return this.text.reduce(function (width, line) {
    return Math.max(width, line.length)
  }, 0)
}
TextCell.prototype.minHeight = function () {
  return this.text.length
}
TextCell.prototype.draw = function (width, height) {
  var result = []
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || ''
    result.push(line + repeat(' ', width - line.length))
  }
  return result
}

function UnderlinedCell (inner) {
  this.inner = inner
}

// min height as being the same as its inner cell but adds 1 to the height to account
// for the space taken up by the underline
UnderlinedCell.prototype.minWidth = function () {
  return this.inner.minWidth()
}

UnderlinedCell.prototype.minHeight = function () {
  return this.inner.minHeight() + 1
}

UnderlinedCell.prototype.draw = function (width, height) {
  return this.inner.draw(width, height - 1).concat([repeat('_', width)])
}

function dataTable (data) {
  var keys = Object.keys(data.data[0])
  var headers = keys.map(function (name) {
    // return new UnderlinedCell(new TextCell(name))
    return new StretchCell(new TextCell(name), 20, 3)
  })
  var body = data.data.map(function (row) {
    return keys.map(function (name) {
      var value = row[name]
      if (typeof value === 'number') {
        return new RTextCell(String(value))
      } else {
        return new TextCell(String(value))
      }
    })
  })
  return [headers].concat(body)
}

// Another cell type that is like TextCell but rather than padding the lines on the right side
// it pads them on the left side so that they align to the right
RTextCell.prototype = Object.create(TextCell.prototype)
RTextCell.prototype.draw = function (width, height) {
  var result = []
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || ''
    result.push(repeat(' ', width - line.length) + line)
  }
  return result
}

function RTextCell (text) {
  TextCell.call(this, text)
}

// Another cell type that wraps another cell and ensure that the resulting cell has at least the given
// width and height, even if the inner cell would naturally be smaller
function StretchCell (inner, width, height) {
  this.inner = inner
  this.width = width
  this.height = height
}

StretchCell.prototype.minWidth = function () {
  return this.width > this.inner.minWidth() ? this.width : this.inner.minWidth()
}

StretchCell.prototype.minHeight = function () {
  return this.height > this.inner.minHeight() ? this.height : this.inner.minHeight()
}
StretchCell.prototype.draw = function () {
  var result = []
  for (var i = 0; i < this.height; i++) {
    var line = this.inner.text[i] || ''
    result.push(line + repeat(' ', this.width - line.length))
  }
  return result
}

console.log(drawTable(dataTable(MOUNTAINS)))
