// Write a program that creates a string that represents an 8×8 grid, using newline characters to separate lines.
// At each position of the grid there is either a space or a “#” character. The characters should form a chess board.
// Passing this string to console.log should show something like this:

//  # # # #
// # # # #
//  # # # #
// # # # #
//  # # # #
// # # # #
//  # # # #
// # # # #

// When you have a program that generates this pattern, define a variable size = 8 and
// change the program so that it works for any size, outputting a grid of the given width and height.

function chess (width, height) {
  var spaceLeading = ' #'.repeat((width + 1) / 2)
  var spaceTrailing = '# '.repeat((width + 1) / 2)
  if (height % 2 !== 0) {
    spaceLeading = spaceLeading.slice(0, -1)
    spaceTrailing = spaceTrailing.slice(0, -1)
  }
  var chess = ''
  var newline = '\n'
  for (var i = 1; i <= height; i++) {
    if (i === height) {
      newline = ''
    }
    if (i % 2 !== 0) chess += spaceLeading + newline
    else chess += spaceTrailing + newline
  }
  console.log(`${width} by ${height} chess board`)
  console.log(chess)
}

chess(5, 5)
chess(8, 8)
