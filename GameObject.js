class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;

        //changes for directions 
        //hard-coded currently
        this.direction = config.direction ?? "down";

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            useShadow: config.useShadow ?? true,
            animation: config.animation ?? null,
            currentAnimation: config.currentAnimation ?? null,
            currentAnimationFrame: config.currentAnimationFrame ?? null,
            animationSpeed: config.animationSpeed ?? null,
        })
    }

    update() {

    }
} 