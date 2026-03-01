# init

**File:** `init.js`

---

## Overview

`init.js` is the single entry point that boots the Fablekins engine. It is the last script loaded by `index.html`.

---

## Implementation

```js
(() => {
  const overworld = new Overworld({
    element: document.querySelector(".game-container"),
  });
  overworld.init();
})();
```

It uses an **IIFE** (Immediately Invoked Function Expression) to:

- Avoid polluting the global scope with the `overworld` variable
- Ensure the code runs as soon as the script is parsed (all prior scripts are already loaded)

---

## What It Does

1. Finds the `.game-container` div in the DOM
2. Creates a new `Overworld` instance, passing the container element
3. Calls `overworld.init()`, which:
   - Loads the map (`window.OverworldMaps.NorthStreet`)
   - Draws the `InstructionsScreen`
   - Waits for player to click PROCEED before starting the game loop

---

## Notes

- No ES module syntax is used. All class definitions must be resolved from prior `<script>` tags before `init.js` runs.
- The file has no exports and no imports — it exists solely to trigger the startup sequence.
