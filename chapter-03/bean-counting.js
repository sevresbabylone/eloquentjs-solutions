// write a function called countChar that takes a second argument that indicates the
// character that is to be counted

function countChar (word, character) {
  var noOfCharacter = 0
  for (var i = 0; i < word.length; i++) {
    if (word.charAt(i) === character) {
      noOfCharacter = noOfCharacter + 1
    }
  }
  return noOfCharacter
}
