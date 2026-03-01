# OverworldMap

**File:** `OverworldMap.js`

---

## Overview

`OverworldMap` is the central data hub for a game scene. It holds map image references, the wall collision set, all active game objects, and owns the `LevelManager`. It also manages the entire dot lifecycle — spawning, removal, and power-dot logic.

A global `window.OverworldMaps` object at the bottom of the file defines all available map configurations.

---

## Constructor

```js
new OverworldMap(config)
```

| Config Property | Type | Description |
|----------------|------|-------------|
| `gameObjects` | `object` | Key/value map of all entities (`hero`, `ghost`, `dot`, `cat`, etc.) |
| `walls` | `object` | Collision set — keys are `"x, y"` strings, values are `true` |
| `lowersrc` | `string` | Image path for the background (ground) map layer |
| `uppersrc` | `string` | Image path for the foreground (overlay) map layer |

**Internally initialised:**

| Property | Default | Description |
|----------|---------|-------------|
| `activeDot` | `null` | Reference to the current live `Dot` instance |
| `activePowerDot` | `null` | Reference to the current live `PowerDot` instance |
| `ghostActivated` | `false` | Guards one-time ghost activation |
| `youDied` | `undefined` | Set to `true` when the player is killed |
| `levelManager` | `LevelManager` | Created with `dotsPerLevel: 5`, `baseGhostSpeed: 75`, `speedIncrement: 18` |

---

## Map Rendering Methods

### `drawLowerImg(ctx, CameraPerson)`
Draws the background layer (ground, terrain). Called first in the render loop.

### `drawUpperImg(ctx, CameraPerson)`
Draws the foreground overlay (e.g. rooftop edges, overhead foliage). Called after all entities are drawn so they appear behind overlays.

Both use the same camera offset formula:
```
offsetX = Utilities.withGrid(10.5) - CameraPerson.x
offsetY = Utilities.withGrid(6)    - CameraPerson.y
```

---

## Collision Method

### `isSpaceTaken(currentX, currentY, direction)`

Returns `true` if the upcoming tile in `direction` is in the wall set.

```js
map.isSpaceTaken(hero.x, hero.y, "right"); // → true or false
```

Uses `Utilities.upcomingPosition()` to compute the target tile and looks it up in `this.walls`.

> ⚠️ Note: `Person` does its own wall check via `state.map.walls[...]` directly. `isSpaceTaken` exists as a helper but is not currently called by any live code path — reserved for future NPC use.

---

## Ghost Activation

### `activateGhostOnce()`

Called every frame from `Overworld.startGameLoop()`. Once `hero.remainingMovement > 0` (first player move), sets `ghost.isActive = true` and locks itself via `ghostActivated = true`.

This gives the player a brief look at the field before being chased.

---

## Dot System Methods

### `spawnDot()`

Picks a random tile within the grid bounds (columns 5–41, rows 5–36), converts to pixel coordinates, and checks it against the wall set. If the tile is blocked, recurses until a free tile is found.

Creates a new `Dot` and registers it as `this.gameObjects.dot`.

### `removeDot(dot)`

Called by `Dot.update()` on collection:
1. Removes `dot` key from `gameObjects`
2. Clears `activeDot`
3. Calls `levelManager.onDotEaten(this)` (may trigger level-up)
4. 40% chance to call `spawnPowerDot()` (if none active)
5. Calls `spawnDot()` immediately

### `spawnPowerDot()`

Finds a free tile with up to 20 attempts (avoids infinite recursion). Creates a `PowerDot` and registers it as `this.gameObjects.powerDot`.

### `removePowerDot(dot)`

Clears `activePowerDot` and deletes the `powerDot` entry from `gameObjects`.

---

## Death

### `playerDied()`

Sets `this.youDied = true` and freezes the ghost (`ghost.isActive = false`). The `Overworld` game loop skips entity updates when `youDied` is set and renders the death banner instead.

---

## Window.OverworldMaps

The second half of `OverworldMap.js` defines the global map registry:

```js
window.OverworldMaps = {
  NorthStreet: {
    lowersrc:    "/images/maps/DemoMap_03.jpeg",
    uppersrc:    "/images/maps/DemoMap_Upper_04.jpeg",
    gameObjects: { hero, ghost, cat },
    walls:       Colliders.Forest
  }
}
```

`Overworld.init()` passes `window.OverworldMaps.NorthStreet` directly to `new OverworldMap()`.

---

## Notes

- The `Dot` spawn area is randomised within pixel ranges derived from tile indices 5–41 (X) and 5–36 (Y). These map to the walkable interior of the `NorthStreet` map.
- `PowerDot` uses a loop with an `attempts` limit (20) instead of recursion to avoid hitting the call stack limit in crowded wall areas.
- All `gameObjects` entries (including dynamically added `dot` / `powerDot`) can have their `update()` and `draw()` methods called by the game loop without any extra registration — the loop iterates `Object.values(this.map.gameObjects)` each frame.
