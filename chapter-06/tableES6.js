// Table with ES6 Classes
var MOUNTAINS = {
  title: 'Mountains',
  data: [
    {name: 'Kilimanjaro', height: 5895, country: 'Tanzania'},
    {name: 'Everest', height: 8848, country: 'Nepal'},
    {name: 'Mount Fuji', height: 3776, country: 'Japan'},
    {name: 'Mont Blanc', height: 4808, country: 'Italy/France'},
    {name: 'Vaalserberg', height: 323, country: 'Netherlands'},
    {name: 'Denali', height: 6168, country: 'United States'},
    {name: 'Popocatepetl', height: 5465, country: 'Mexico'}
  ]
}

function rowHeights (rows) {
  return rows.map(function (row) {
    return row.reduce(function (max, cell) {
      return Math.max(max, cell.minHeight())
    }, 0)
  })
}
function colWidths (rows) {
  return rows[0].map(function (_, i) {
    return rows.reduce(function (max, row) {
      return Math.max(max, row[i].minWidth())
    }, 0)
  })
}
function repeat (string, times) {
  var result = ''
  for (var i = 0; i < times; i++) {
    result += string
  }
  return result
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

function dataTable (data) {
  var keys = Object.keys(data.data[0])
  var headers = keys.map(function (name) {
    return new UnderlinedCell(name)
    // return new StretchCell(new TextCell(name), 20, 3)
  })
  var body = data.data.map(function (row) {
    return keys.map(function (name) {
      var value = row[name]
      return new TextCell(String(value))
    })
  })
  return [headers].concat(body)
}

class TextCell {
  constructor (text) {
    this.text = text.split('\n')
  }
  minWidth () {
    return this.text.reduce(function (width, line) {
      return Math.max(width, line.length)
    }, 0)
  }
  minHeight () {
    return this.text.length
  }
  draw (width, height) {
    var result = []
    for (var i = 0; i < height; i++) {
      var line = this.text[i] || ''
      result.push(line + repeat(' ', width - line.length))
    }
    return result
  }
}

class UnderlinedCell extends TextCell {
  // pseudo method constructor defines the function that represents the class
  constructor (text) {
    super(text)
  }
  minHeight () {
    return super.minHeight() + 1
  }
  minWidth () {
    return super.minWidth()
  }
  draw (width, height) {
    return super.draw(width, height - 1).concat([repeat('_', width)])
  }
}
console.log(drawTable(dataTable(MOUNTAINS)))
