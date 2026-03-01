# LevelManager

**File:** `LevelManager.js`  
**Owned by:** `OverworldMap` (created in its constructor)

---

## Overview

`LevelManager` tracks how many dots the player has collected, triggers level-ups every N dots, scales ghost speed on level-up, and draws the HUD badge and progress indicators each frame.

---

## Constructor

```js
new LevelManager(config)
```

| Config Property | Type | Default | Description |
|----------------|------|---------|-------------|
| `dotsPerLevel` | `number` | `5` | Dots to collect before levelling up |
| `baseGhostSpeed` | `number` | `75` | Ghost speed (px/s) at level 1 |
| `speedIncrement` | `number` | `15` | px/s added to ghost speed per level |

`OverworldMap` instantiates it with `speedIncrement: 18`.

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `level` | `number` | Current player level (starts at `1`) |
| `dotsThisLevel` | `number` | Dots eaten since the last level-up |
| `totalDots` | `number` | Lifetime dot count (for stats) |
| `_flashTimer` | `number` | Seconds remaining for the "LEVEL UP!" banner |
| `_flashDuration` | `number` | `1.2` — total seconds the banner is visible |

---

## Methods

### `onDotEaten(map)`

Called by `OverworldMap.removeDot()` each time a dot is collected.

```js
levelManager.onDotEaten(map);
```

- Increments `dotsThisLevel` and `totalDots`
- If `dotsThisLevel >= dotsPerLevel` → calls `_levelUp(map)`

---

### `_levelUp(map)`

Internal level-up handler:

1. Increments `level`, resets `dotsThisLevel` to `0`
2. Sets `_flashTimer = 1.2` to trigger the "LEVEL UP!" banner
3. Applies the new ghost speed immediately:

   ```js
   map.gameObjects.ghost.speed = this.ghostSpeed();
   ```

---

### `ghostSpeed()`

Returns the computed ghost speed for the current level:

```js
return baseGhostSpeed + (level - 1) * speedIncrement;
```

| Level | Ghost Speed (default config) |
|-------|------------------------------|
| 1 | 75 px/s |
| 2 | 93 px/s |
| 3 | 111 px/s |
| 4 | 129 px/s |
| … | +18 px/s per level |

---

### `drawLevelIndicator(ctx, deltaTime)`

Called every frame from `Overworld.drawHUD()`. Draws three HUD elements:

#### 1. Level Badge (top-left)

A semi-transparent dark rectangle at `(4, 4)` with gold `"LVL N"` text.

#### 2. Progress Pips

A row of `dotsPerLevel` small rectangles below the badge:

- **Filled** (`#FF4444`) for each dot eaten this level
- **Unfilled** (`rgba(255,255,255,0.25)`) for remaining slots

#### 3. "LEVEL UP!" Flash Banner

Shown for `_flashDuration` seconds after a level-up. Fades in quickly (over 0.3 s) then persists:

- Covers a horizontal bar across the canvas at `y = 80`
- Shows `"⬆ LEVEL N!"` in gold monospace

The flash uses `ctx.globalAlpha` for smooth fade.

---

## Notes

- `LevelManager` does **not** manage dot counts independently — `OverworldMap` calls `onDotEaten()` on every collection. The manager only tracks counts from that point forward.
- Ghost speed is updated **immediately** — the ghost gets faster the frame after a level-up is triggered.
- `PowerDot` can reduce ghost speed below the level-scaled value. The `LevelManager` overrides that again on the next level-up.
