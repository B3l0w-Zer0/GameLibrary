export class Fight extends Phaser.Scene {
  constructor() {
    super("Fight");
  }

  create() {
    this.add.text(400, 300, "KAMPF SZENE!", {
      fontSize: "32px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Zurück mit ESC
    this.keys = this.input.keyboard.addKeys("ESC");
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      this.scene.start("Start");
    }
  }
}


