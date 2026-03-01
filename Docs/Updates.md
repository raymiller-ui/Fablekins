# Changelog

All notable changes to Fablekins are recorded here, grouped by release phase.

---

## ALPHA-01

- Separated `GameObject` and `Sprite` into distinct classes; `Sprite` handles image loading and canvas drawing independently
- `OverworldMap` exposes itself on `window` so all game objects across the DOM can reference map data
- Implemented the core `requestAnimationFrame` game loop inside `Overworld`
- Added `Utilities` as a global static helper object for shared coordinate math

## ALPHA-02

- Created separate `Person` class extending `GameObject` for player/NPC-specific logic
- Implemented tile-based directional movement for `Person` objects
- Added `DirectionInput` with keyboard (Arrow keys + WASD) mapping

## ALPHA-03

- Added full map collision system via `Collision.js` (`Colliders.Forest` wall map)
- `Person.startBehaviour()` checks wall tiles before committing to a move
- Introduced two-layer map rendering: lower (background) and upper (foreground overlay)

## ALPHA-04

- Added `Dot` collectible system: random spawn, collection detection, removal + immediate respawn
- `OverworldMap.removeDot()` wires dot collection into the rest of the game
- Added `Ghost` class with greedy-direction AI targeting the hero each tile step
- Ghost activates via `activateGhostOnce()` on the player's first movement

## ALPHA-05

- Added `LevelManager`: tracks dots eaten, triggers level-up every 5 dots
- Ghost speed scales with each level (`baseGhostSpeed + (level-1) * speedIncrement`)
- HUD level badge (top-left), progress pips, and "LEVEL UP!" flash banner added to canvas

## BETA-01

- Added `PowerDot` (golden dot, `#FFD700`) with pulsing glow animation
- On pickup: hero speed `+5 px/s`, ghost speed `-5 px/s` (minimum 10)
- 40% chance to spawn a `PowerDot` after each regular dot is collected

## BETA-02

- Added death system: `OverworldMap.playerDied()` freezes all entities
- "YOU DIED" overlay with clickable `↺ RESTART` button drawn on canvas
- `_onDeathClick` translates CSS-scaled click coordinates correctly

## BETA-FINAL

- Added `InstructionsScreen` (`UI.js`): pixel-art pre-game screen with "HOW TO PLAY" and a clickable PROCEED button
- Game loop and `DirectionInput` now start only after player proceeds
- Frame-rate independent movement (`deltaTime`-based) applied to both `Person` and `Ghost`
- Animation speed of the walk cycle now scales with `Person.speed` to stay visually in sync
- Touch controls added to `DirectionInput` (on-screen D-pad via `.touch-controls` buttons, media-query hidden on large screens)
- Decorative `cat` `GameObject` added to the `NorthStreet` map with a custom sprite sheet animation cycle

---

## Planned

- Multi-map transitions and scene management
- Sound effects and background music
- Leaderboard / score persistence
- Proper ghost pathfinding (A*)
- Camera boundary clamping
