# Utilities

**File:** `Utillities.js` *(note: intentional typo in filename)*  
**Type:** Static object (no class)

---

## Overview

`Utilities` is a global object containing pure helper functions for coordinate math. It is used throughout every part of the engine.

---

## Methods

### `withGrid(n)`

Converts a tile index to a pixel value.

```js
Utilities.withGrid(5)   // → 80
Utilities.withGrid(10.5) // → 168  (used for camera X offset)
Utilities.withGrid(6)   // → 96   (used for camera Y offset)
```

```
return n * 16;
```

---

### `asGridCoords(x, y)`

Returns a wall-map key string from tile coordinates.

```js
Utilities.asGridCords(3, 2) // → "48, 32"
```

```
return `${x * 16}, ${y * 16}`;
```

Used when authoring entries in `Colliders` (Collision.js) and when looking up tiles in `OverworldMap.walls`.

---

### `upcomingPosition(initialX, initialY, direction)`

Returns the pixel coordinates of the next tile in the given direction.

```js
Utilities.upcomingPosition(80, 96, "right")
// → { x: 96, y: 96 }
```

| Direction | Effect |
|-----------|--------|
| `"up"` | `y -= 16` |
| `"down"` | `y += 16` |
| `"right"` | `x += 16` |
| `"left"` | `x -= 16` |

Used by `Person.startBehaviour()`, `Ghost.update()`, and `OverworldMap.isSpaceTaken()`.

---

## Notes

- All functions assume a **16 px tile grid** — this is a hard-coded constant (`size = 16`) inside `upcomingPosition`.
- `Utilities` is loaded first in `index.html` because every other file depends on it.
- There is a typo in the filename (`Utillities.js` instead of `Utilities.js`). The `<script>` tag and all internal references match the misspelled name.
