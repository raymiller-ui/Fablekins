# Person

**File:** `Person.js`  
**Extends:** `GameObject`  
**Used for:** Player hero (and optionally NPCs)

---

## Overview

`Person` adds tile-based movement, wall collision, and sprite animation logic on top of `GameObject`. Movement happens one tile (16 px) at a time and is interpolated smoothly using `deltaTime` to stay frame-rate independent.

---

## Constructor

```js
new Person(config)
```

Inherits all `GameObject` config properties, plus:

| Config Property | Type | Default | Description |
|----------------|------|---------|-------------|
| `isPlayerControlled` | `boolean` | `false` | If `true`, reads input from `DirectionInput` each frame |

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `remainingMovement` | `number` | Pixels left to travel to reach the next tile (0 = idle) |
| `isPlayerControlled` | `boolean` | Whether this Person is driven by keyboard/touch input |
| `baseSpeed` | `number` | Base movement speed (px/s), default `144` |
| `speed` | `number` | Current movement speed (px/s); can be boosted by `PowerDot` |
| `targetX` | `number` | Target world X position (set when a walk starts) |
| `targetY` | `number` | Target world Y position (set when a walk starts) |
| `directionUpdate` | `object` | Maps direction strings to `[axis, change]` pairs |

---

## Methods

### `update(state)`

The main per-frame method. Orchestrates the three sub-steps below.

```js
// state = { pressedKey: string|undefined, map: OverworldMap, deltaTime: number }
person.update(state);
```

**Logic:**
1. If `remainingMovement > 0` → call `updatePosition(deltaTime)`
2. Always call `updateSprite(state)` to set the correct animation
3. If player-controlled AND idle AND a key is pressed → call `startBehaviour(state, { type: "walk", direction })`

---

### `startBehaviour(state, behaviour)`

Initiates a single tile move in a given direction.

```js
this.startBehaviour(state, { type: "walk", direction: "right" });
```

- Sets `this.direction` to the new direction
- Checks `state.map.walls` for the upcoming tile — if blocked, returns immediately (no movement)
- If clear: sets `remainingMovement = 16`, `targetX`, `targetY`

---

### `updatePosition(deltaTime)`

Advances the person towards `targetX` / `targetY` by `speed * deltaTime` pixels, capped at `remainingMovement`.

When `remainingMovement` reaches 0 the position is **snapped exactly** to the tile to prevent floating-point drift.

---

### `updateSprite(state)`

Picks the correct animation key for the current state:

| State | Animation Set |
|-------|--------------|
| Player-controlled, idle, no key held | `"idle-<direction>"` |
| Moving (`remainingMovement > 0`) | `"walk-<direction>"` |

Also adjusts `sprite.animationSpeed` based on `speed / baseSpeed` so faster movement plays the walk cycle faster:

```js
this.sprite.animationSpeed = Math.max(4, Math.round(16 / speedRatio));
```

---

## Movement Flow

```
pressedKey received
    ↓
startBehaviour() — wall check
    ↓ (clear tile)
remainingMovement = 16
    ↓
updatePosition() runs each frame
    ↓ (remainingMovement == 0)
snap to targetX / targetY
    ↓
ready for next input
```

---

## Notes

- NPCs can be created by setting `isPlayerControlled: false`; they will not read from `DirectionInput` but can be driven programmatically via `startBehaviour()`.
- `speed` is intentionally exposed so `PowerDot` can boost it at runtime.
- `baseSpeed` is kept in sync with `speed` by `PowerDot` so that `updateSprite`'s animation-speed ratio stays correct.
