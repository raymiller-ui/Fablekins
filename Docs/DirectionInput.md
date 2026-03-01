# DirectionInput

**File:** `DirectionInput.js`

---

## Overview

`DirectionInput` is the input layer for the engine. It maintains a priority-ordered array of currently active directions and exposes the most-recently-pressed one via a `direction` getter. It supports both keyboard and on-screen touch controls.

---

## Constructor

```js
new DirectionInput()
```

| Internal Property | Type | Description |
|-------------------|------|-------------|
| `keyPresses` | `string[]` | Stack of active direction strings; most recent is at index `0` |
| `map` | `object` | Maps `KeyboardEvent.code` strings to direction strings |

### Key Map

| Key Code | Direction |
|----------|-----------|
| `ArrowUp` / `KeyW` | `"up"` |
| `ArrowDown` / `KeyS` | `"down"` |
| `ArrowLeft` / `KeyA` | `"left"` |
| `ArrowRight` / `KeyD` | `"right"` |

---

## Properties

### `get direction()`

Returns `this.keyPresses[0]` — the most recently pressed direction, or `undefined` if nothing is held.

```js
directionInput.direction; // → "right" | "left" | "up" | "down" | undefined
```

This getter is read each frame by `Overworld.startGameLoop()` and passed as `pressedKey` to every game object's `update()`.

---

## Methods

### `init()`

Registers all event listeners. Must be called once before the game loop starts. Done inside `Overworld.init()` → `onProceed` callback.

**Keyboard events:**

- `keydown` → if the key maps to a valid direction and is not already in `keyPresses`, **unshift** it to the front
- `keyup` → find and **splice** the direction out of `keyPresses`

**Touch events (on `.touch-controls button` elements):**

- `touchstart` / `mousedown` → unshift direction (same as keydown)
- `touchend` / `mouseup` → splice direction out (same as keyup)

Touch buttons use `data-dir` HTML attributes (`"up"`, `"down"`, `"left"`, `"right"`).

---

## Direction Priority

`keyPresses` is an array, not a set. Directions are **unshifted** (pushed to the front) on press and **spliced** (removed by index) on release.

This means if the player holds `right` then also presses `up`, `keyPresses` becomes `["up", "right"]`. The getter returns `"up"` — the most recent key — while both are held. When `up` is released, `"right"` becomes index `0` and movement continues in that direction.

---

## Touch Controls

Touch buttons are defined in `index.html`:

```html
<div class="touch-controls">
  <button data-dir="up"    class="up">▲</button>
  <button data-dir="left"  class="left">◀</button>
  <button data-dir="right" class="right">▶</button>
  <button data-dir="down"  class="down">▼</button>
</div>
```

They are styled to only appear on small screens (via CSS `@media` query). Both `touchstart` and `mousedown` events are handled so the controls work with a mouse on desktop as well.

---

## Notes

- `init()` is called **after** the player clicks PROCEED on the instructions screen, not on page load. This prevents input from being captured before the game starts.
- The duplicate-key guard (`!this.keyPresses.includes(dir)`) ensures each direction appears at most once in the array, preventing runaway growth on key-repeat events.
