# Ghost

**File:** `Ghost.js`  
**Extends:** `GameObject`

---

## Overview

`Ghost` is the primary antagonist. It uses a simple **greedy direction** AI — each tile step it moves along whichever axis (X or Y) brings it closer to the hero. It starts inactive and is enabled the moment the player takes their first step.

---

## Constructor

```js
new Ghost(config)
```

Inherits all `GameObject` config properties, plus:

| Config Property | Type | Default | Description |
|----------------|------|---------|-------------|
| `speed` | `number` | `75` | Movement speed in px/s (slower than the default hero speed of 144) |

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `speed` | `number` | Current movement speed in px/s. Scaled up by `LevelManager` on level-up; scaled down by `PowerDot` on pickup |
| `remainingMovement` | `number` | Pixels left to travel to the next tile |
| `targetX` | `number` | Target world X for the current move |
| `targetY` | `number` | Target world Y for the current move |
| `isActive` | `boolean` | `false` until the player first moves; set via `OverworldMap.activateGhostOnce()` |
| `directionUpdate` | `object` | Maps direction strings to `[axis, change]` pairs |

---

## Methods

### `update(state)`

Called every frame by the game loop.

**Logic:**
1. If `!isActive` → return immediately (ghost is frozen)
2. If `remainingMovement > 0` → call `updatePosition(deltaTime)` and return (finish current tile step)
3. Otherwise, decide the next direction:
   - Calculate `dx = hero.x - ghost.x` and `dy = hero.y - ghost.y`
   - Move along whichever axis has the larger absolute difference
   - Horizontal takes priority when `|dx| > |dy|`
4. Compute `upcomingPosition` and set `remainingMovement = 16`
5. **Kill check:** if the ghost is within 1 px of the hero → `state.map.playerDied()`

> **Note:** Wall collision is deliberately disabled for the ghost (commented out). The ghost can pass through walls, making it relentless.

---

### `updatePosition(deltaTime)`

Identical in structure to `Person.updatePosition()`:

- Advances position by `speed * deltaTime`, capped at `remainingMovement`
- Snaps to `targetX` / `targetY` when movement is complete

---

## Activation

`OverworldMap.activateGhostOnce()` is called every frame. It flips `ghost.isActive = true` the first time `hero.remainingMovement > 0`, giving the player a small head-start to read the map before being chased.

---

## Speed Scaling

| Event | Effect |
|-------|--------|
| Level up (every 5 dots) | `ghost.speed = baseGhostSpeed + (level - 1) * speedIncrement` |
| Player collects PowerDot | `ghost.speed -= 5` (minimum 10 px/s) |

Initial speed is `75 px/s`; the `LevelManager` is configured with `baseGhostSpeed: 75` and `speedIncrement: 18` by default.

---

## Notes

- The ghost has no sprite animation — its `Sprite` constructor block is commented out. It renders via the default static frame of its sprite sheet.
- Future improvement: give the ghost proper directional animation and wall awareness (pathfinding).
