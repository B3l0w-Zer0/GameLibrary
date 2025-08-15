export function createMap(width, height) {
  const map = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Außen Wände, innen Boden
      row.push(x === 0 || y === 0 || x === width - 1 || y === height - 1 ? 1 : 0);
    }
    map.push(row);
  }
  return map;
}
