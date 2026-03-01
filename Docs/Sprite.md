# Sprite

**File:** `Sprite.js`  
**Used by:** `GameObject` (and all subclasses)

---

## Overview

`Sprite` handles all visual rendering for game objects. It manages sprite sheet slicing, frame cycling for animations, shadow rendering, and camera-relative drawing. Every `GameObject` owns exactly one `Sprite` instance.

---

## Constructor

```js
new Sprite(config)
```

| Config Property | Type | Default | Description |
|----------------|------|---------|-------------|
| `gameObject` | `GameObject` | — | Reference to the owner; used for `x`, `y` position |
| `src` | `string` | — | Path to the sprite sheet image |
| `useShadow` | `boolean` | `true` | Whether to draw a shadow under the sprite |
| `useFullImage` | `boolean` | `false` | Reserved flag (not yet implemented fully) |
| `shadowsrc` | `string` | `"/images/characters/shadow.png"` | Custom shadow image path |
| `animation` | `object \| null` | Default animation map | Custom animation map; if provided, **replaces** the defaults entirely |
| `currentAnimation` | `string` | `"idle-down"` | Starting animation key |
| `currentAnimationFrame` | `number` | `0` | Starting frame index within the animation |
| `animationSpeed` | `number` | `16` | Number of game loops each frame is shown before advancing |

---

## Default Animation Map

If no `animation` is passed, the following map is used (designed for a standard 4-column × 4-row character sheet):

| Key | Frames `[col, row]` | Description |
|-----|---------------------|-------------|
| `idle-down` | `[[0,0]]` | Single standing frame |
| `walk-down` | `[[1,0],[0,0],[3,0],[0,0]]` | 4-frame walk cycle |
| `idle-right` | `[[0,2]]` | |
| `walk-right` | `[[1,2],[0,2],[3,2],[0,2]]` | |
| `idle-left` | `[[0,1]]` | |
| `walk-left` | `[[1,1],[0,1],[3,1],[0,1]]` | |
| `idle-up` | `[[0,3]]` | |
| `walk-up` | `[[1,3],[0,3],[3,3],[0,3]]` | |

Frame values are `[col, row]` indices into 64×64 px cells on the sprite sheet. Each cell is drawn scaled down to **32×32 px** on canvas.

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `image` | `Image` | Loaded sprite sheet |
| `isLoaded` | `boolean` | `true` once `image.onload` fires |
| `shadow` | `Image` | Shadow image |
| `isShadowLoaded` | `boolean` | `true` once shadow `onload` fires |
| `animations` | `object` | Full animation map |
| `currentAnimation` | `string` | Active animation key |
| `currentAnimationFrame` | `number` | Current frame index in the active animation |
| `animationSpeed` | `number` | Loops per frame (higher = slower animation) |
| `animationFrameDuration` | `number` | Countdown timer; advances frame when it hits 0 |

---

## Methods

### `get frame()`

Returns the `[col, row]` pair for the current frame:

```js
this.animations[this.currentAnimation][this.currentAnimationFrame]
```

### `setAnimation(animation)`

Changes the active animation. If the key differs from the current one, resets `currentAnimationFrame` to 0 and resets `animationFrameDuration`.

```js
sprite.setAnimation("walk-right");
```

### `updateAnimationProgress()`

Called automatically at the end of every `draw()`. Counts down `animationFrameDuration`. When it reaches 0:
- Resets duration to `animationSpeed`
- Advances `currentAnimationFrame`
- If the next frame is `undefined` (end of array), wraps back to frame 0

### `draw(ctx, CameraPerson)`

Renders the sprite for one frame:

1. Calculates canvas coordinates:
   ```
   x = gameObject.x - 8  + Utilities.withGrid(10.5) - CameraPerson.x
   y = gameObject.y - 18 + Utilities.withGrid(6)    - CameraPerson.y
   ```
   The `-8` / `-18` offsets visually centre the 32×32 sprite over its 16 px tile anchor.

2. Draws shadow (if `useShadow && isShadowLoaded`)
3. Draws the sprite sheet slice (`frameX * 64, frameY * 64`, source 64×64 → destination 32×32)
4. Calls `updateAnimationProgress()`

---

## Speed-Responsive Animation

`Person.updateSprite()` adjusts `sprite.animationSpeed` each frame to keep the walking animation in sync with movement speed:

```js
sprite.animationSpeed = Math.max(4, Math.round(16 / speedRatio));
```

A faster hero will have a lower `animationSpeed` value and therefore cycle frames more quickly.

---

## Notes

- Sprite sheet cells must be **64×64 px** in the source image.
- Sprites are rendered at **32×32 px** on canvas (2× downscale).
- `draw()` is safe to call before images are loaded — it guards with `isLoaded` and `isShadowLoaded`.
