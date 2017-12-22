function arrayToList (array) {
  if (array[0]) {
    return {value: array[0], rest: arrayToList(array.slice(1))}
  }
  else return null
}

function listToArray (list) {
  if (list.rest) return [list.value, ...listToArray(list.rest)]
  else return [list.value]
}

function prepend (value, rest) {
  return { value: value, rest: rest }
}

function nth (list, number) {
  if (number > 0) {
    if (list.rest) {
      return nth(list.rest, number - 1)
    }
    else return undefined
  }
  else return list.value
}

console.log(arrayToList([10, 20]))
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])))
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)))
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 2))
// → 20
