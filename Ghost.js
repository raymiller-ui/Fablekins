//console.log("Ghost.js loaded");

class Ghost extends GameObject {
  constructor(config) {
    super(config);

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      right: ["x", 1],
      left: ["x", -1]
    };

    this.speed = config.speed ?? 75; // pixels per second (slower than player)
    this.remainingMovement = 0;
    this.targetX = this.x;
    this.targetY = this.y;
    this.isActive = false;


    //   this.sprite = new Sprite({
    //     gameObject: this,
    //     src: config.src,
    //     useShadow: true,
    //     animation: {
    //       "idle-down": [[0, 0]],
    //     },
    //     currentAnimation: "idle-down",
    //     animationSpeed: 1000, // basically frozen
    //   });

  }

  update(state) {
    const hero = state.map.gameObjects.hero;
    if (!this.isActive) return;


    // Already moving -> continue
    if (this.remainingMovement > 0) {
      this.updatePosition(state.deltaTime);
      return;
    }

    // Decide direction toward player
    const dx = hero.x - this.x;
    const dy = hero.y - this.y;

    let direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? "right" : "left";
    } else {
      direction = dy > 0 ? "down" : "up";
    }

    const { x, y } = Utilities.upcomingPosition(this.x, this.y, direction);

    // Don't walk into walls -> maybe just fly through it [a little]
    //if (state.map.walls[`${x}, ${y}`]) return;

    this.direction = direction;
    this.remainingMovement = 16;
    this.targetX = x;
    this.targetY = y;

    // KILL CHECK
    if (Math.abs(this.x - hero.x) < 1 && Math.abs(this.y - hero.y) < 1) {
      state.map.playerDied();
    }

  }

  updatePosition(deltaTime) {
    const [axis, change] = this.directionUpdate[this.direction];

    const movement = Math.min(
      this.speed * deltaTime,
      this.remainingMovement
    );

    this[axis] += change * movement;
    this.remainingMovement -= movement;

    if (this.remainingMovement <= 0) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.remainingMovement = 0;
    }
  }

}
