# Fablekins — Architecture

## Overview

Fablekins is a tile-based 2D browser game engine written in vanilla JavaScript using HTML5 Canvas. It has no external dependencies. The engine handles a real-time game loop, sprite sheet animation, tile-grid movement, dot collection, ghost AI, and a progressive levelling system.

---

## Boot Sequence

```
index.html  →  loads scripts in dependency order
    ↓
init.js     →  creates Overworld instance and calls .init()
    ↓
Overworld   →  shows InstructionsScreen (UI.js)
    ↓ (player clicks PROCEED)
Overworld   →  starts DirectionInput, calls startGameLoop(), spawns first Dot
    ↓
requestAnimationFrame loop (Overworld.startGameLoop)
    ↓
OverworldMap ← DirectionInput ← gameObjects (Person, Ghost, Dot, PowerDot, cat)
    ↓
Sprite.draw()  /  Dot.draw()  /  Ghost.draw()
    ↓
LevelManager.drawLevelIndicator()  (HUD)
```

---

## Script Load Order (index.html)

The following order is **mandatory** because there are no ES modules — every class must exist before anything tries to instantiate it.

| # | File | Why |
|---|------|-----|
| 1 | `Utillities.js` | Pure helpers, no dependencies |
| 2 | `UI.js` | `InstructionsScreen` — no game deps |
| 3 | `Collision.js` | Exposes `Colliders` object used by OverworldMap |
| 4 | `DirectionInput.js` | Used by Overworld after init |
| 5 | `Sprite.js` | Used by GameObject |
| 6 | `GameObject.js` | Base class, uses Sprite |
| 7 | `Person.js` | Extends GameObject |
| 8 | `Ghost.js` | Extends GameObject |
| 9 | `Dot.js` | Extends GameObject (contains Dot + PowerDot) |
| 10 | `LevelManager.js` | Used by OverworldMap |
| 11 | `OverworldMap.js` | Uses all game objects + LevelManager |
| 12 | `Overworld.js` | Top-level engine, uses everything |
| 13 | `init.js` | Entry point — bootstraps everything |

---

## Rendering Pipeline (per frame)

Each `requestAnimationFrame` tick in `startGameLoop()` executes:

1. **Clear canvas** — `ctx.clearRect()`
2. **Draw lower map layer** — `OverworldMap.drawLowerImg()` (background / ground)
3. **Update all game objects** — calls `obj.update({ pressedKey, map, deltaTime })` on every entry in `map.gameObjects` *(skipped if `youDied`)*
4. **Draw all game objects** — calls `obj.sprite?.draw()` and `obj.draw?.()` (dots draw themselves without a Sprite)
5. **Activate ghost** — `activateGhostOnce()` — enables ghost AI on player's first move
6. **Draw upper map layer** — `OverworldMap.drawUpperImg()` (foreground overlay, e.g. rooftops)
7. **Draw HUD** — `LevelManager.drawLevelIndicator()` + optional death banner

---

## Coordinate System

- **Grid size:** 16 px per tile
- `Utilities.withGrid(n)` converts tile index → pixel: `n * 16`
- `Utilities.upcomingPosition(x, y, direction)` returns next tile in pixel coordinates
- All world positions are stored in **pixels**; movement is always in 16 px steps
- **Camera offset**: every drawable element translates its position by `Utilities.withGrid(10.5) - CameraPerson.x` (X) and `Utilities.withGrid(6) - CameraPerson.y` (Y) to keep the hero centred

---

## File Responsibility Summary

| File | Class(es) | Role |
|------|-----------|------|
| `Overworld.js` | `Overworld` | Main game loop, canvas setup, HUD, death screen |
| `OverworldMap.js` | `OverworldMap` | Map layers, wall map, game object registry, dot/power-dot lifecycle |
| `Person.js` | `Person extends GameObject` | Player-controlled + NPC tile movement, animation |
| `Ghost.js` | `Ghost extends GameObject` | Greedy-direction ghost AI, kill check |
| `Dot.js` | `Dot`, `PowerDot` | Collectible entities: normal dot and golden power-up |
| `GameObject.js` | `GameObject` | Base entity: x/y position, direction, Sprite |
| `Sprite.js` | `Sprite` | Sprite sheet slicing, frame cycling, shadow rendering |
| `LevelManager.js` | `LevelManager` | Dot counter, level-up logic, ghost speed scaling, HUD badges |
| `DirectionInput.js` | `DirectionInput` | Keyboard + touch input → direction string |
| `Utillities.js` | `Utilities` | Static helpers: grid math, upcoming position |
| `UI.js` | `InstructionsScreen` | Pre-game canvas-drawn instructions / proceed screen |
| `Collision.js` | `Colliders` | Static wall maps keyed by `"x, y"` strings |
| `init.js` | — | IIFE entry point: creates `Overworld`, calls `.init()` |

---

## Game Systems

### Dot System
- One `Dot` is active at a time; stored as `map.gameObjects.dot`
- On collection → `OverworldMap.removeDot()` → notifies `LevelManager` → spawns next `Dot` → 40% chance to also spawn a `PowerDot`

### PowerDot System
- At most one `PowerDot` active at a time (`map.activePowerDot`)
- On collection → hero `speed +5`, ghost `speed -5` (min 10), remove from game objects

### Level System
- Managed entirely by `LevelManager`
- Every 5 dots eaten → level up → ghost speed increases by `speedIncrement` (default 18 px/s)
- HUD shows: level badge (top-left), progress pips, "LEVEL UP!" flash banner

### Death System
- `OverworldMap.playerDied()` sets `youDied = true` and freezes the ghost
- Overworld stops all `update()` calls and renders a "YOU DIED" overlay with a clickable RESTART button

---

## Future / Potential Expansion Areas

- Multi-map transitions and scene management
- Event scripting system (cutscenes, triggers)
- NPC dialogue and behaviour trees
- Depth sorting (y-axis painter's algorithm)
- Sound effects and background music
- Leaderboard / score persistence
