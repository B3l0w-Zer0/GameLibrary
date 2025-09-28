import { Start } from "./scenes/Start.js";
import { Fight } from "./scenes/fight.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,     // dynamisch: ganze Bildschirmbreite
  height: window.innerHeight,   // dynamisch: ganze Bildschirmhöhe
  backgroundColor: "#1e1e2f",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: [ Start, Fight ],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

            
