import { renderMap } from '../mapParts/renderMap.js';
import { drawMap, drawPlayer, drawMiniMap} from '../mapParts/mapEngine.js';
import { createMap } from '../mapParts/mapData.js';

export function render(container, sceneManager) {
  const map = createMap(50, 50);
  const player = { x: 5, y: 5 };

  let ctx;

  // Dummy draw zuerst definieren
  function draw() {
    if (!ctx) return; // ctx ist noch nicht bereit
    drawMap(ctx, map, player);
    drawPlayer(ctx, player);
    drawMiniMap(ctx, map, player)
  }

  // Erst renderMap ohne Callback aufrufen
  const result = renderMap();
  ctx = result.ctx;

  // Jetzt den Callback registrieren – ctx ist bereit
  window.addEventListener('resize', draw);
  draw(); // einmal initial zeichnen

  const keys = new Set();
  window.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
  window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

  let lastMoveTime = 0;
  const moveCooldown = 150;

  function update() {
    const now = Date.now();
    if (now - lastMoveTime < moveCooldown) return;

    let dx = 0, dy = 0;
    if (keys.has('w') || keys.has('arrowup')) dy = -1;
    if (keys.has('s') || keys.has('arrowdown')) dy = 1;
    if (keys.has('a') || keys.has('arrowleft')) dx = -1;
    if (keys.has('d') || keys.has('arrowright')) dx = 1;

    const nextX = player.x + dx;
    const nextY = player.y + dy;

    if (
      nextY >= 0 && nextY < map.length &&
      nextX >= 0 && nextX < map[0].length &&
      map[nextY][nextX] === 0
    ) {
      player.x = nextX;
      player.y = nextY;
      lastMoveTime = now;
    }
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
