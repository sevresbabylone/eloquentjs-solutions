function MultiplicatorUnitFailure() {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5)
    return a * b;
  else
    throw new MultiplicatorUnitFailure();
}

function reliableMultiply(a, b) {
  // Your code here.
  for(;;) {
    try {
      var result = primitiveMultiply(a, b)
      return result
    }
    catch (e) {
      if (e instanceof MultiplicatorUnitFailure) {
        console.log('Multiplicator Unit Failure')
      }
    }
  }
}

console.log(reliableMultiply(8, 8));
