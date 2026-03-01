# UI – InstructionsScreen

**File:** `UI.js`  
**Class:** `InstructionsScreen`

---

## Overview

`InstructionsScreen` renders a pixel-art styled "How to Play" screen directly onto the game canvas before the game loop starts. It blocks the game from starting until the player clicks the **PROCEED** button.

---

## Constructor

```js
new InstructionsScreen({ canvas, ctx, onProceed })
```

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | `HTMLCanvasElement` | The game canvas |
| `ctx` | `CanvasRenderingContext2D` | Canvas 2D context |
| `onProceed` | `function` | Callback invoked when the player clicks PROCEED |

Internal button bounds (fixed pixel positions for the 352×198 canvas):

```js
this.btn = { x: 131, y: 155, w: 90, h: 22 };
```

---

## Methods

### `draw()`

Paints the instructions screen onto the canvas. Called once immediately after construction.

**Renders:**

1. **Background** — solid `#0d0d1a` fill (deep dark navy)
2. **Border** — `#9cdb44` (neon green) 3 px stroke inset by 6 px
3. **Title** — `"HOW TO PLAY"` in bold 13 px Courier New, `#ede7f6`
4. **Instruction lines** (centred, 22 px apart):
   - `⚫  Avoid the ghost`
   - `🔴  Collect dots to level up`
   - `⚡  Golden dot = speed boost, nerf ghost`
   - `←↑↓→  Move with arrow keys`
5. **PROCEED button** — `#4a148c` (deep purple) fill, `#d8d893` stroke, `"▶ PROCEED"` label

---

### `_click(e)`

Canvas click handler. Translates the click to canvas-local coordinates (accounting for CSS scaling):

```js
const mx = (e.clientX - r.left) * (canvas.width / r.width);
const my = (e.clientY - r.top)  * (canvas.height / r.height);
```

If the click is inside `this.btn`:

1. Removes the click listener from the canvas
2. Calls `this.onProceed()`

---

## Lifecycle

```
Overworld.init()
  → new InstructionsScreen({ ..., onProceed: () => startGame() })
  → instructions.draw()          ← screen is visible
  → player clicks PROCEED
  → _click() fires
  → canvas listener removed
  → onProceed() callback runs
  → ctx.clearRect(...)           ← screen is cleared
  → DirectionInput.init() + startGameLoop() + spawnDot()
```

---

## Notes

- `InstructionsScreen` does not extend `GameObject` — it is a standalone UI utility.
- The button position (`x: 131`) is calibrated for the 352 px canvas width.
- No separate game loop is running while the instructions screen is shown; `draw()` is a one-shot call.
