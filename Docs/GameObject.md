# GameObject

**File:** `GameObject.js`  
**Type:** Base class  
**Extended by:** `Person`, `Ghost`, `Dot`, `PowerDot`

---

## Overview

`GameObject` is the root entity in the Fablekins engine. Every visible or interactive object on the map — the player, the ghost, dots, decorative objects — is either a `GameObject` directly or inherits from it.

It holds a world position (`x`, `y`), a facing direction, and owns a `Sprite` instance responsible for rendering the object on the canvas.

---

## Constructor

```js
new GameObject(config)
```

| Config Property | Type | Default | Description |
|----------------|------|---------|-------------|
| `x` | `number` | `0` | World X position in pixels |
| `y` | `number` | `0` | World Y position in pixels |
| `direction` | `string` | `"down"` | Initial facing direction |
| `src` | `string` | — | Path to sprite sheet image |
| `useShadow` | `boolean` | `true` | Draw a drop shadow beneath the sprite |
| `animation` | `object \| null` | `null` | Custom animation map (overrides Sprite defaults) |
| `currentAnimation` | `string \| null` | `null` | Initial animation key |
| `currentAnimationFrame` | `number \| null` | `null` | Starting frame index |
| `animationSpeed` | `number \| null` | `null` | Game loops per animation frame |

Internally, the constructor creates a `Sprite` instance and passes all relevant config properties to it.

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | World X position (pixels) |
| `y` | `number` | World Y position (pixels) |
| `direction` | `string` | Current facing direction (`"up"`, `"down"`, `"left"`, `"right"`) |
| `sprite` | `Sprite` | The sprite renderer attached to this object |

---

## Methods

### `update(state)`

Called once per frame by the game loop. The base implementation is a **no-op** — subclasses override this to add behaviour (movement, AI, collision, etc.).

```js
// Called by Overworld.startGameLoop() each frame
obj.update({ pressedKey, map, deltaTime });
```

---

## Usage Example

Placing a static decorative object (e.g. the cat):

```js
cat: new GameObject({
  x: Utilities.withGrid(7),
  y: Utilities.withGrid(12),
  src: "/images/characters/cat_loop.png",
  useShadow: false,
  animation: {
    "cat-loop": [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2]],
  },
  currentAnimation: "cat-loop",
}),
```

---

## Notes

- `GameObject` does **not** handle movement; that is added by `Person` and `Ghost`.
- The `Sprite` class handles whether to draw shadow or use a full-image mode.
- Dot-type objects (`Dot`, `PowerDot`) extend `GameObject` but override `draw()` to render themselves directly on the canvas instead of via a sprite sheet.
