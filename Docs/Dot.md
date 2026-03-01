# Dot & PowerDot

**File:** `Dot.js`  
**Classes:** `Dot extends GameObject`, `PowerDot extends GameObject`

---

## Overview

`Dot.js` contains two collectible entity classes. Both check each frame whether the hero has reached their tile, trigger collection effects, and remove themselves from the map.

---

## Dot

### Purpose
The standard collectible. Collecting a `Dot` advances the level progress counter and triggers a new dot to spawn.

### Constructor

```js
new Dot({ x, y, src })
```

| Property | Value | Description |
|----------|-------|-------------|
| `collected` | `false` | Guard flag to prevent double-collection |
| `radius` | `4` | Canvas arc radius in pixels |

### `update(state)`

Each frame, checks if `hero.x === this.x && hero.y === this.y`. On first match:
1. Sets `collected = true`
2. Calls `state.map.removeDot(this)` → which notifies `LevelManager`, possibly spawns a `PowerDot`, and spawns the next `Dot`

### `draw(ctx, CameraPerson)`

Draws a solid **red** circle on the canvas using `ctx.arc()`. No sprite sheet is used.

```
drawX = this.x + Utilities.withGrid(10.5) - CameraPerson.x + 8
drawY = this.y + Utilities.withGrid(6)  - CameraPerson.y + 8
```

---

## PowerDot

### Purpose
A rare, animated golden collectible with dual effects:
- **Hero speed:** `+5 px/s`
- **Ghost speed:** `-5 px/s` (minimum 10)

Spawned with a **40% probability** each time a regular dot is eaten (only one can exist at a time).

### Constructor

```js
new PowerDot({ x, y })
```

| Property | Value | Description |
|----------|-------|-------------|
| `collected` | `false` | Guard flag |
| `radius` | `7` | Slightly larger than a Dot |
| `_pulse` | `0` | Animation timer (incremented by deltaTime each frame) |

### `update(state)`

1. Increments `_pulse` by `deltaTime` for the pulsing animation
2. On hero overlap: applies speed changes, calls `state.map.removePowerDot(this)`

Speed changes applied at collection:
```js
hero.speed += 5;
hero.baseSpeed = hero.speed;         // keeps animation ratio synced
ghost.speed = Math.max(10, ghost.speed - 5);
```

### `draw(ctx, CameraPerson)`

Renders a pulsing golden dot with a radial gradient glow:

1. **Outer glow:** `createRadialGradient` from gold at center to transparent at edge, animated by `Math.sin(_pulse * 4)`
2. **Core dot:** Solid `#FFD700` circle with a `shadowBlur: 10` glow

---

## Spawn Logic (managed by OverworldMap)

| Method | When Called | Effect |
|--------|-------------|--------|
| `spawnDot()` | On game start + after each dot collection | Places a new `Dot` at a random non-wall tile |
| `removeDot(dot)` | When hero touches `Dot` | Deletes dot from `gameObjects`, notifies `LevelManager`, maybe spawns `PowerDot`, spawns next `Dot` |
| `spawnPowerDot()` | 40% chance after `removeDot()` | Tries up to 20 random tiles to avoid walls, places `PowerDot` |
| `removePowerDot(dot)` | When hero touches `PowerDot` | Clears `activePowerDot` and removes from `gameObjects` |

---

## Notes

- Dot collision is tile-exact (`===` comparison), so the hero must be aligned to the same 16 px grid cell.
- `PowerDot` does **not** use a sprite; it fully custom-draws itself each frame for the animated glow effect.
