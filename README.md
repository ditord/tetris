# Tetris

A browser-based Tetris game built with vanilla HTML, CSS, and JavaScript. No build step or dependencies—open and play.

## Features

- Classic Tetris gameplay with all seven tetrominoes (I, O, T, S, Z, J, L)
- Smooth falling pieces with increasing speed by level
- Line clearing with score: 100 × 2^(lines cleared)
- Level progression every 10 lines; gravity speeds up each level
- Next piece preview in the side panel
- Ghost piece showing where the current piece will land
- High score persisted in `localStorage`
- Pause and restart support
- Responsive layout: side panel stacks below the canvas on small screens

## How to Play

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
2. Press **Enter** to start.
3. Use the controls below to move, rotate, and drop pieces. Clear full rows to score and level up.

### Controls

| Key | Action |
|-----|--------|
| **Left / Right** | Move piece horizontally |
| **Down** | Soft drop (move down one row, +1 point per row) |
| **Up** or **X** | Rotate clockwise |
| **Z** | Rotate counter-clockwise |
| **Space** | Hard drop (instant drop to bottom) |
| **P** | Pause / resume |
| **Enter** | Start game / Restart after game over |

## Tech Stack

- **HTML5** – Page structure and canvas elements
- **CSS3** – Layout, theming, responsive design
- **JavaScript (ES5+)** – Game logic, Canvas 2D rendering, keyboard input

No frameworks, bundlers, or external libraries. Single-page app; all assets are local.

## Project Structure

```
tetris/
  index.html   # Entry point, canvas, and UI elements
  styles.css   # Layout and styling
  game.js      # Game state, mechanics, rendering, and controls
  README.md    # This file
```

## License

MIT (or choose your preferred license).
