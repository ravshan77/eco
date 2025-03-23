export function numberOfFloor(x: number, y: number) {
  return Math.floor((x - 1) / y) + 1;
}

// console.log(numberOfFloor(61, 20)); // 3
// console.log(numberOfFloor(79, 20)); // 3
// console.log(numberOfFloor(80, 20)); // 4
// console.log(numberOfFloor(99, 20)); // 4
