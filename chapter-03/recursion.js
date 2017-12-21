// don't use % to write a function that checks if a number is even or odd
function isEven (number) {
  if (number === 0) {
    return true
  }
  if (number === 1) {
    return false
  }
  return isEven(number - 2)
}

console.log(isEven(50)) // → true
console.log(isEven(75)) // → false
