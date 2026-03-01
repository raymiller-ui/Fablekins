class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this._deathBtn = { x: 0, y: 0, w: 0, h: 0 };
    this._onDeathClick = this._onDeathClick.bind(this);
  }


  drawHUD(deltaTime) {
    this.map.levelManager.drawLevelIndicator(this.ctx, deltaTime);
    if (this.map.youDied) this._drawDeathBanner();
  }

  _drawDeathBanner() {
    const c = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Dark overlay
    c.fillStyle = "rgba(0,0,0,0.72)";
    c.fillRect(0, 0, W, H);

    // YOU DIED text
    c.fillStyle = "#ff1744";
    c.font = "bold 22px monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("YOU DIED", W / 2, H / 2 - 18);

    // Restart button
    const bw = 90, bh = 22;
    const bx = Math.round(W / 2 - bw / 2);
    const by = Math.round(H / 2 + 6);
    this._deathBtn = { x: bx, y: by, w: bw, h: bh };

    c.fillStyle = "#b71c1c";
    c.fillRect(bx, by, bw, bh);
    c.strokeStyle = "#ff8a80";
    c.lineWidth = 1.5;
    c.strokeRect(bx, by, bw, bh);
    c.fillStyle = "#fff";
    c.font = "bold 11px monospace";
    c.fillText("↺  RESTART", W / 2, by + 13);
  }

  _onDeathClick(e) {
    if (!this.map || !this.map.youDied) return;
    const r = this.canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (this.canvas.width / r.width);
    const my = (e.clientY - r.top) * (this.canvas.height / r.height);
    const { x, y, w, h } = this._deathBtn;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      location.reload();
    }
  }


  //Defining the game Loop

  startGameLoop() {
    let lastTime = performance.now();

    const step = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000; // seconds
      lastTime = currentTime;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const CameraPerson = this.map.gameObjects.hero;

      // Draw lower map
      this.map.drawLowerImg(this.ctx, CameraPerson);

      // Freeze all game object updates on death
      if (!this.map.youDied) {
        Object.values(this.map.gameObjects).forEach(obj => {
          obj.update({
            pressedKey: this.DirectionInput.direction,
            map: this.map,
            deltaTime,
          });
        });
      }

      // Draw sprites
      Object.values(this.map.gameObjects).forEach(obj => {
        if (obj.sprite) {
          obj.sprite.draw(this.ctx, CameraPerson);
        }
        if (obj.draw) {
          obj.draw(this.ctx, CameraPerson);
        }

      });

      this.map.activateGhostOnce();

      // Draw upper map
      this.map.drawUpperImg(this.ctx, CameraPerson);

      this.drawHUD(deltaTime);


      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }


  //Starting the init ()

  init() {

    this.map = new OverworldMap(window.OverworldMaps.NorthStreet);

    // Death banner click listener (always active after init)
    this.canvas.addEventListener("click", this._onDeathClick);

    // Show pixel-art instructions screen; game starts only after Proceed
    const instructions = new InstructionsScreen({
      canvas: this.canvas,
      ctx: this.ctx,
      onProceed: () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.DirectionInput = new DirectionInput();
        this.DirectionInput.init();
        this.startGameLoop();
        this.map.spawnDot();
      },
    });
    instructions.draw();


    //---------------------------[OLD CODE -> HARDCODED]--------------------------------------//

    //-----------------------------------------------Background Image 

    // const image = new Image();
    // image.onload = () => {
    //   this.ctx.drawImage(image,0,0)
    // };
    // image.src = "/images/maps/DemoLower.png";

    //-----------------------------------------------Place some game objects

    // const hero = new GameObject({
    // x:5,
    // y:6,
    // useShadow:true,
    // })

    // const npc1 = new GameObject({
    // x:7,
    // y:8,
    // src:"/images/characters/people/npc1.png",
    // })

    //-----------------------------------------------Drawing these Game Objects

  }
}
