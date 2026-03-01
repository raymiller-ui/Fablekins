# Overworld

**File:** `Overworld.js`

---

## Overview

`Overworld` is the top-level engine class. It owns the canvas context, manages the main `requestAnimationFrame` game loop, renders the HUD, and shows the death screen. It delegates all game logic to `OverworldMap` and its contained objects.

---

## Constructor

```js
new Overworld({ element })
```

| Config Property | Type | Description |
|----------------|------|-------------|
| `element` | `HTMLElement` | The `.game-container` wrapper div |

**Internally resolved:**

| Property | Description |
|----------|-------------|
| `canvas` | `element.querySelector(".game-canvas")` |
| `ctx` | 2D canvas rendering context |
| `map` | Set to `null` until `init()` is called |
| `_deathBtn` | Bounding box of the Restart button (`{ x, y, w, h }`) |

---

## Methods

### `init()`

The entry point called by `init.js`. Sequence:
1. Creates the `OverworldMap` from `window.OverworldMaps.NorthStreet`
2. Attaches the `_onDeathClick` listener to the canvas
3. Creates an `InstructionsScreen` (UI.js) and draws it
4. When the player clicks **PROCEED**:
   - Clears the canvas
   - Creates and initialises `DirectionInput`
   - Calls `startGameLoop()`
   - Calls `map.spawnDot()` (first dot)

---

### `startGameLoop()`

The core `requestAnimationFrame` loop. Each frame:

```
1. deltaTime = (currentTime - lastTime) / 1000   [seconds]
2. ctx.clearRect(0, 0, canvas.width, canvas.height)
3. map.drawLowerImg(ctx, CameraPerson)            [background]
4. if (!map.youDied) → obj.update(state)          [all game objects]
5. obj.sprite?.draw(ctx, CameraPerson)            [sprite objects]
   obj.draw?.(ctx, CameraPerson)                  [canvas-drawn objects like Dot]
6. map.activateGhostOnce()
7. map.drawUpperImg(ctx, CameraPerson)            [foreground overlay]
8. drawHUD(deltaTime)                             [level badge, death banner]
9. requestAnimationFrame(step)
```

`CameraPerson` is always `map.gameObjects.hero`.

---

### `drawHUD(deltaTime)`

Calls:
- `map.levelManager.drawLevelIndicator(ctx, deltaTime)` — draws the level badge and progress pips
- `_drawDeathBanner()` — if `map.youDied` is `true`

---

### `_drawDeathBanner()`

Renders a full-canvas death overlay:
- Semi-transparent black fill (`rgba(0,0,0,0.72)`)
- **"YOU DIED"** text in `#ff1744`
- A clickable **"↺  RESTART"** button drawn in `#b71c1c`

The button's bounding box is stored in `this._deathBtn` each frame so `_onDeathClick` can test hits.

---

### `_onDeathClick(e)`

Fires on every canvas click (always active after `init()`). Only acts when `map.youDied` is `true`. Translates the click's client coordinates to canvas-local coordinates (accounting for CSS scaling), then checks if the click is inside `_deathBtn`. If so: `location.reload()`.

---

## Canvas Dimensions

The canvas is `352 × 198 px` (set in `index.html`). The game renders at this native resolution and is scaled up by CSS.

---

## Freeze-on-Death

When `map.youDied` is `true`:
- All `obj.update()` calls are **skipped** (entities frozen)
- Sprites still **draw** (last frame remains visible under the overlay)
- The death banner is drawn on top every frame

---

## Notes

- `DirectionInput` is created lazily inside the `onProceed` callback — it is `undefined` before the player clicks PROCEED, which prevents input from being read on the instructions screen.
- The camera is always centred on `hero`; there is no scene boundary clamping. Adding camera bounds is a planned improvement.
