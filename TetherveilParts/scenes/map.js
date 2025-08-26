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
 * @property {Array<{x:number,y:number,name:string,dialog:string[]}>} [npcs]
 */

/**
 * @typedef {Object} NPC
 * @property {number} x
 * @property {number} y
 * @property {string} name
 * @property {string[]} dialog
 */
import { renderMap } from '../mapParts/renderMap.js';
import { drawMap, drawPlayer, drawMiniMap } from '../mapParts/mapEngine.js';
import { loadMap } from '../mapParts/mapData.js';
import {sounds, playSound} from '../scripts/sounds.js';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// --- Default Keybinds ---
const defaultKeybinds = { up:"w", down:"s", left:"a", right:"d" };

// Keybinds lokal speichern/laden
function loadKeybinds(){
  const stored = localStorage.getItem("keybinds");
  return stored ? JSON.parse(stored) : {...defaultKeybinds};
}
function saveKeybinds(kb){ localStorage.setItem("keybinds", JSON.stringify(kb)); }

export async function render(container, sceneManager){
  const result = renderMap();
  const ctx = result.ctx;
  const tileSize = 64;
  let transferring = false;





  /** @type {MapData} */
  let mapData;
  let map; // map einmal hier deklarieren
  const player = { x: 10, y: 10 };
  let camera = { x: 10, y: 10 };

// Map laden
  try {
    mapData = await loadMap('./data/maps/startMap.json');
    map = mapData.map;
    // Kamera direkt auf Spieler setzen
    centerCameraOnPlayer();
  } catch (err) {
    console.error(err);
    return;
  }


  function centerCameraOnPlayer() {
    camera.x = player.x * tileSize - ctx.canvas.width / 2 + tileSize / 2;
    camera.y = player.y * tileSize - ctx.canvas.height / 2 + tileSize / 2;
  }


//Animation für Mapwechsel
  async function fadeMapChange(targetMap, spawnX, spawnY) {
    // Einblenden
    blackbox.style.display = "block";
    requestAnimationFrame(() => {
      blackbox.style.opacity = "1";
    });

    // 1 Sekunden warten
    await new Promise(r => setTimeout(r, 1000));

    // Map laden
    mapData = await loadMap(targetMap);
    map = mapData.map;
    player.x = spawnX;
    player.y = spawnY;
    centerCameraOnPlayer()
    draw();

    // Ausblenden
    blackbox.style.opacity = "0";
    setTimeout(() => {
      blackbox.style.display = "none";
    }, 500);
  }



  // --- Kamera + Zeichnen ---
  function draw(){
    const targetCamX = player.x*tileSize - ctx.canvas.width/2 + tileSize/2;
    const targetCamY = player.y*tileSize - ctx.canvas.height/2 + tileSize/2;
    const clampedCamX = Math.max(0,Math.min(targetCamX,map[0].length*tileSize - ctx.canvas.width));
    const clampedCamY = Math.max(0,Math.min(targetCamY,map.length*tileSize - ctx.canvas.height));
    camera.x = lerp(camera.x, clampedCamX,0.1);
    camera.y = lerp(camera.y, clampedCamY,0.1);
    drawMap(ctx,map,player,camera);
    drawPlayer(ctx,player,camera.x,camera.y);
    drawMiniMap(ctx,map,player);
  }
  window.addEventListener('resize',draw);
  draw();

  // --- Variablen ---
  const keys = new Set();
  let lastMoveTime = 0;
  const baseCooldown=250, sprintCooldown=150;
  let inFight=false, paused=false;
  let lastPlayerPos={x:player.x,y:player.y};
  let keybinds = loadKeybinds();

  // --- HTML Elemente ---
  const escapeOptions = document.getElementById("Escape-Options");
  const blackbox = document.getElementById("blackBox");
  const keybindsParts = document.getElementById("KeybindsParts");
  const rebindUp = document.getElementById("rebind-up");
  const rebindDown = document.getElementById("rebind-down");
  const rebindLeft = document.getElementById("rebind-left");
  const rebindRight = document.getElementById("rebind-right");
  const resetBinds = document.getElementById("reset-binds");
  const resumeButton = document.getElementById("Resume");
  const optionButton = document.getElementById("Options");
  const keybindsButton = document.getElementById("Keybinds");
  const startFightButton = document.getElementById("StartFight")
  const backButton = document.getElementById("backButton");
  const backToTitelButton = document.getElementById("BackToTitelScreen");

  // --- NPC Dialog ---
  const npcDialog = document.getElementById("npc-dialog");
  const npcNameEl = document.getElementById("npc-name");
  const npcTextEl = document.getElementById("npc-text");
  const npcNextBtn = document.getElementById("npc-next");
  const npcCloseBtn = document.getElementById("npc-close");

  /** @type {NPC|null} */
  let currentNPC = null;
  let currentDialogIndex = 0;

  function showNPCDialog() {
    if (!currentNPC || !npcDialog || !npcNameEl || !npcTextEl) return;
    // Safe check: gibt nur aus, wenn dialog existiert
    if (!currentNPC.dialog || !Array.isArray(currentNPC.dialog)) return;

    npcDialog.classList.remove("hidden");
    npcNameEl.textContent = currentNPC.name;
    npcTextEl.textContent = currentNPC.dialog[currentDialogIndex] || "";
    console.log(`NPC Dialog gestartet: ${currentNPC.name}`);
  }

  function closeNPCDialog() {
    if (!npcDialog) return;

    npcDialog.classList.add("hidden");
    currentNPC = null;
    currentDialogIndex = 0;
    inDialog = false;
    console.log("NPC Dialog geschlossen");
  }

// Event-Listener für den Close-Button
  npcCloseBtn?.addEventListener("click", () =>{
    playSound(sounds.click);
  closeNPCDialog();
  });


  npcNextBtn?.addEventListener("click", () => {
    playSound(sounds.click);
    if (!currentNPC || !npcTextEl) return;
    if (!currentNPC.dialog || !Array.isArray(currentNPC.dialog)) return;

    currentDialogIndex++;
    if (currentDialogIndex < currentNPC.dialog.length) {
      npcTextEl.textContent = currentNPC.dialog[currentDialogIndex];
      console.log("NPC Dialog weiter");
    } else {
      closeNPCDialog();
    }
  });

let inDialog = false;
  // --- Input ---
  window.addEventListener('keydown', e=>{
    const key = e.key.toLowerCase();
    if(key==='escape' && !inDialog){
      paused=!paused;
      if(escapeOptions) escapeOptions.style.display = paused?"flex":"none";
      console.log(paused?"Pause Menü geöffnet":"Pause Menü geschlossen");
      return;
    }
    keys.add(key);
  });
  window.addEventListener('keyup', e=> keys.delete(e.key.toLowerCase()));

  // --- Enter → NPC Interaktion oder Dialog-Fortschritt ---
  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'enter' && !paused && !inFight) {
      if (inDialog) {
        // Wir sind schon im Dialog → weiterblättern
        if (!currentNPC || !npcTextEl) return;
        if (!currentNPC.dialog || !Array.isArray(currentNPC.dialog)) return;

        currentDialogIndex++;
        if (currentDialogIndex < currentNPC.dialog.length) {
          npcTextEl.textContent = currentNPC.dialog[currentDialogIndex];
          console.log("NPC Dialog weiter");
        } else {
          closeNPCDialog();
        }
      } else {
        // Kein Dialog offen → prüfen, ob ein NPC neben dem Spieler ist
        const npc = mapData.npcs.find(n =>
          (Math.abs(n.x - player.x) === 1 && n.y === player.y) ||
          (Math.abs(n.y - player.y) === 1 && n.x === player.x)
        );
        if (npc) {
          currentNPC = npc;
          currentDialogIndex = 0;
          showNPCDialog();
          inDialog = true;
        }
      }
    }
  });


  // --- Keybind Dialog Elemente ---
  const keyConflictDialog = document.getElementById("keybind-conflict-dialog");
  const conflictText = document.getElementById("conflict-text");
  const conflictYes = document.getElementById("conflict-yes");
  const conflictNo = document.getElementById("conflict-no");
  let pendingRebind = null;

  function showKeyConflictDialog(action,newKey,conflictAction){
    conflictText.textContent = `Die Taste "${newKey.toUpperCase()}" ist bereits für "${conflictAction}" belegt. Überschreiben?`;
    keyConflictDialog.classList.remove("hidden");
    pendingRebind = {action,newKey,conflictAction};
  }
  function hideKeyConflictDialog(){ keyConflictDialog.classList.add("hidden"); pendingRebind=null; }

  conflictYes.addEventListener("click", ()=>{
    playSound(sounds.click);
    if(pendingRebind){
      const {action,newKey,conflictAction} = pendingRebind;
      keybinds[action]=newKey;
      keybinds[conflictAction]=null;
      saveKeybinds(keybinds);
      updateKeybindButtons();
    }
    hideKeyConflictDialog();
  });

  conflictNo.addEventListener("click", () =>{
    playSound(sounds.click);
    hideKeyConflictDialog();
  });

  // --- Keybind Buttons ---
  function updateKeybindButtons(){
    rebindUp.textContent = keybinds.up?.toUpperCase() || " ";
    rebindDown.textContent = keybinds.down?.toUpperCase() || " ";
    rebindLeft.textContent = keybinds.left?.toUpperCase() || " ";
    rebindRight.textContent = keybinds.right?.toUpperCase() || " ";
  }
  updateKeybindButtons();

  function setupRebind(button, action){
    button.addEventListener("click", ()=>{
      playSound(sounds.click);
      button.textContent="...";
      const listener = (e)=>{
        const newKey = e.key.toLowerCase();
        const conflict = Object.entries(keybinds).find(([a,k])=>k===newKey);
        if(conflict && conflict[0]!==action){
          showKeyConflictDialog(action,newKey,conflict[0]);
        } else {
          keybinds[action]=newKey;
          saveKeybinds(keybinds);
          updateKeybindButtons();
          console.log(`Taste ${newKey.toUpperCase()} zugewiesen für ${action}`);
        }
        window.removeEventListener("keydown",listener,true);
      };
      window.addEventListener("keydown",listener,true);
    });
  }

  setupRebind(rebindUp,"up");
  setupRebind(rebindDown,"down");
  setupRebind(rebindLeft,"left");
  setupRebind(rebindRight,"right");

  if(resetBinds){
    resetBinds.addEventListener("click", ()=>{
      playSound(sounds.click);
      keybinds={...defaultKeybinds};
      saveKeybinds(keybinds);
      updateKeybindButtons();
      console.log("Keybinds auf Standard zurückgesetzt");
    });
  }

  // --- Buttons Pause Menu ---
  if(resumeButton) resumeButton.addEventListener('click',()=>{
    playSound(sounds.click);
    paused=false;
    escapeOptions.style.display="none";
    console.log("Resume Button gedrückt → Spiel läuft weiter");
  });
  if(optionButton) optionButton.addEventListener('click',()=>{
    playSound(sounds.click);
    sceneManager.loadScene("options");
    console.log("Options Button gedrückt → Szene gewechselt");
  });
  if(keybindsButton) keybindsButton.addEventListener('click',()=>{
    playSound(sounds.click);
    escapeOptions.style.display="none";
    keybindsParts.style.display="flex";
    console.log("Keybinds Button gedrückt → Keybinds Menü geöffnet");
  });
  if(startFightButton) startFightButton.addEventListener('click', () =>{
    playSound(sounds.click);
    sceneManager.loadScene("battle");
    paused = !paused;
    console.log("StartFight Button gedrückt");
  })
  if(backButton) backButton.addEventListener('click',()=>{
    playSound(sounds.click);
    escapeOptions.style.display="flex";
    keybindsParts.style.display="none";
    console.log("Back Button gedrückt → Zurück zu Pause Menü");
  });
  if(backToTitelButton) backToTitelButton.addEventListener('click',()=>{
    playSound(sounds.click);
    sceneManager.loadScene("menu");
    escapeOptions.style.display="none";
    console.log("Back to Title Button gedrückt → Zurück zum Hauptmenü");
  });

  const stopFightingButton = document.getElementById("stopFighting");
  if(stopFightingButton) stopFightingButton.addEventListener("click",()=>{
    playSound(sounds.click);
    blackbox.style.display="none";
    inFight=false;
    console.log("Stop Fighting Button gedrückt → Kampf beendet");
  });

  // --- Update ---
  async function update(){
    const now=Date.now();
    if(paused || inFight) return;

    const isSprinting=keys.has('shift');
    const currentCooldown = isSprinting?sprintCooldown:baseCooldown;
    if(now-lastMoveTime<currentCooldown) return;

    let dx=0, dy=0;
    if(keys.has(keybinds.up)) dy=-1;
    if(keys.has(keybinds.down)) dy=1;
    if(keys.has(keybinds.left)) dx=-1;
    if(keys.has(keybinds.right)) dx=1;

    const nextX=player.x+dx;
    const nextY=player.y+dy;

    if(nextY>=0 && nextY<map.length && nextX>=0 && nextX<map[0].length){
      const tile = map[nextY][nextX];
      const transfer = mapData.transfer?.[tile.toString()];

      if([0,2,3].includes(tile)){ player.x=nextX; player.y=nextY; lastMoveTime=now; }

      // Map Transfer mit Blackbox
      if (transfer && !transferring) {
        transferring = true;
        console.log(`Wechsel zu Map: ${transfer.targetMap}`);
        await fadeMapChange(transfer.targetMap, transfer.spawnX, transfer.spawnY);
        transferring = false;
        return;
      }




      if(tile===3 && (player.x!==lastPlayerPos.x || player.y!==lastPlayerPos.y)){
        if(Math.random()<0.1){ inFight=true; await sceneManager.loadScene("battle"); console.log("Kampfbeginn!"); }
      }
    }

    lastPlayerPos={x:player.x,y:player.y};
  }

  // --- Game Loop ---
  function gameLoop(){ update(); draw(); requestAnimationFrame(gameLoop); }
  gameLoop();
}
