export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    // Ein kleines Quadrat als Spieler erzeugen (statt Sprite)
    this.graphics = this.add.graphics();
  }

  create() {
    // Spieler
    this.player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

     // Beispiel: Collider auf die Canvas-Größe setzen
  this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

  // Optional: Kamera auf Spieler folgen lassen
  this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
  this.cameras.main.startFollow(this.player);

  // Event, wenn Fenstergröße sich ändert
  this.scale.on('resize', (gameSize) => {
    const width = gameSize.width;
    const height = gameSize.height;
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);
  });


    this.startText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 
      "Klicke zum Starten", { fontSize: "24px", color: "#ffffff" }).setOrigin(0.5);

    // Nutzerinteraktion: echtes Vollbild erlauben
    this.input.once("pointerdown", () => {
      if (!this.scale.isFullscreen) {
        this.scale.startFullscreen(); // Borderless Fullscreen
      }
      this.startText.setVisible(false);
    });

    // F11 Toggle zwischen Windowed/Fullscreen (wie Minecraft)
    this.input.keyboard.on("keydown-F11", (event) => {
      event.preventDefault();
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();   // Fenstermodus
      } else {
        this.scale.startFullscreen();  // Vollbild
      }
    });
    // Steuerung
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,ESC");

    // Menü-Element (HTML Button)
    this.menu = document.createElement("div");
    this.menu.style.position = "absolute";
    this.menu.style.top = "50%";
    this.menu.style.left = "50%";
    this.menu.style.transform = "translate(-50%, -50%)";
    this.menu.style.display = "none"; // unsichtbar bis ESC gedrückt
    this.menu.innerHTML = `<button id="fightBtn">Kampf starten</button>`;
    document.getElementById("game-container").appendChild(this.menu);

    document.getElementById("fightBtn").addEventListener("click", () => {
      this.menu.style.display = "none";
      this.scene.start("Fight");
    });
  }

  update() {
    const speed = 200;
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown || this.keys.A.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown || this.keys.W.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // ESC Menü
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      this.menu.style.display =
        this.menu.style.display === "none" ? "block" : "none";
    }
  }
}

