/**
 * @typedef {Object} TransferData
 * @property {string} targetMap
 * @property {number} spawnX
 * @property {number} spawnY
 */

/**
 * @typedef {Object} MapData
 * @property {number[][]} map
 * @property {{ [tile: string]: TransferData }} [transfer]
 */
import { renderMap } from '../mapParts/renderMap.js';
import { drawMap, drawPlayer, drawMiniMap } from '../mapParts/mapEngine.js';
import { loadMap } from '../mapParts/mapData.js';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export async function render(container, sceneManager) {
  const result = renderMap();
  const ctx = result.ctx;
  const tileSize = 64; // oder 286, je nachdem, was du nutzt


  // Map laden
  /** @type {MapData} */
  let mapData;
  try {
    mapData = await loadMap('./data/maps/startMap.json');
  } catch (err) {
    console.error("Fehler beim Laden der Map:", err);
    return;
  }

  let map = mapData.map; // Nur das innere "map"-Array extrahieren
  const player = { x: 10, y: 10 }; // Startposition auf begehbarem Tile

  let camera = { x: 10, y: 10 }; // Kamera-Startposition

  function draw() {
    const targetCamX = player.x * tileSize - ctx.canvas.width / 2 + tileSize / 2;
    const targetCamY = player.y * tileSize - ctx.canvas.height / 2 + tileSize / 2;

    const mapWidth = map[0].length * tileSize;
    const mapHeight = map.length * tileSize;

    // Clamping-Zielposition
    const clampedCamX = Math.max(0, Math.min(targetCamX, mapWidth - ctx.canvas.width));
    const clampedCamY = Math.max(0, Math.min(targetCamY, mapHeight - ctx.canvas.height));

    // Sanft angleichen (0.1 = wie schnell die Kamera folgt)
    camera.x = lerp(camera.x, clampedCamX, 0.1);
    camera.y = lerp(camera.y, clampedCamY, 0.1);

    drawMap(ctx, map, player, camera);
    drawPlayer(ctx, player, camera.x, camera.y);
    drawMiniMap(ctx, map, player);
  }

  window.addEventListener('resize', draw);
  draw();

  const keys = new Set();
  window.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
  window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));


  let lastMoveTime = 0;
  const baseCooldown = 250;
  const sprintCooldown = 150; // Schneller bei Sprint
  let inFight = false;

  const escapeOptions = document.getElementById("Escape-Options");
  const blackbox = document.getElementById("blackBox");

  /*Funktion für das Updaten der Spielerposition, Positionsabfrage, Kampfeinstieg, Mapwechsel usw.*/
  async function update() {
    let lastPlayerPos = { x: player.x, y: player.y };
    const now = Date.now();

/*Pause Menü prüfen*/
    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'escape') {
        console.log("Pause Menü aufgerufen");
        escapeOptions.style.display = "flex";
      }
      keys.add(e.key.toLowerCase());
    });


    if(inFight) return;
    const isSprinting = keys.has('shift');
    const currentCooldown = isSprinting ? sprintCooldown : baseCooldown;

    if (now - lastMoveTime < currentCooldown) return;


    let dx = 0, dy = 0;
    if (keys.has('w') || keys.has('arrowup')) dy = -1;
    if (keys.has('s') || keys.has('arrowdown')) dy = 1;
    if (keys.has('a') || keys.has('arrowleft')) dx = -1;
    if (keys.has('d') || keys.has('arrowright')) dx = 1;


    const nextX = player.x + dx;
    const nextY = player.y + dy;

    const transfer = mapData.transfer?.[map[nextY][nextX].toString()];

    if (
      nextY >= 0 && nextY < map.length &&
      nextX >= 0 && nextX < map[0].length &&
      [0, 2, 3].includes(map[nextY][nextX])
    ) {
      player.x = nextX;
      player.y = nextY;
      lastMoveTime = now;
    }
    if (transfer) {
      console.log("Mapwechsel:", transfer.targetMap);
      mapData = await loadMap(transfer.targetMap);
      player.x = transfer.spawnX;
      player.y = transfer.spawnY;
      map = mapData.map;
    }

    if (map[nextY][nextX] === 3 &&
      (player.x !== lastPlayerPos.x || player.y !== lastPlayerPos.y)){
      if(Math.random() < 0.1){
        inFight = true;
        console.log("Kampfbeginn")

        blackbox.style.display="flex";
      }
      lastPlayerPos = { x: player.x, y: player.y };
    }
  }

    const stopFightingButton = document.getElementById("stopFighting");
    stopFightingButton.classList.add('menu-button');
    stopFightingButton.addEventListener("click", e => blackbox.style.display = "none");
    stopFightingButton.addEventListener("click", e => inFight = false);



  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
