export function drawMap(ctx, map, player, tileSize = 64) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const camX = player.x * tileSize - ctx.canvas.width / 2 + tileSize / 2;
  const camY = player.y * tileSize - ctx.canvas.height / 2 + tileSize / 2;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];
      const { sx, sy, sw, sh } = getTileRect(tile+3);
      ctx.drawImage(
        tileSheet,
        sx, sy, sw, sh,
        x * tileSize - camX,
        y * tileSize - camY,
        tileSize, tileSize
      );
    }
  }
}

export function drawPlayer(ctx, player, tileSize = 64) {
  const camX = player.x * tileSize - ctx.canvas.width / 2 + tileSize / 2;
  const camY = player.y * tileSize - ctx.canvas.height / 2 + tileSize / 2;

  ctx.fillStyle = 'gold';
  ctx.beginPath();
  ctx.arc(
    player.x * tileSize - camX + tileSize / 2,
    player.y * tileSize - camY + tileSize / 2,
    tileSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}
//Test
const tileSheet = new Image();
tileSheet.src = './assets/textures/464.jpg'; // dein Sheet

const tileSize = 286;       // Breite und Höhe des Tiles
const spacing = 8;          // Abstand zwischen den Tiles
const tilesPerRow = 4;      // Anzahl der Spalten im Bild

export function getTileRect(index) {
  const col = index % tilesPerRow;
  const row = Math.floor(index / tilesPerRow);

  const sx = col * (tileSize + spacing) + spacing; // Start x im Bild
  const sy = row * (tileSize + spacing) + spacing; // Start y im Bild

  return {
    sx,
    sy,
    sw: tileSize,
    sh: tileSize
  };
}


export function drawMiniMap(ctx, map, player) {
  const miniSize = 4;
  const offset = 10; // Abstand vom Rand
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      ctx.fillStyle = tile === 1 ? '#444' : '#999';
      ctx.fillRect(
        offset + x * miniSize,
        offset + y * miniSize,
        miniSize, miniSize
      );
    });
  });
  ctx.fillStyle = 'gold';
  ctx.fillRect(
    offset + player.x * miniSize,
    offset + player.y * miniSize,
    miniSize, miniSize
  );
}

