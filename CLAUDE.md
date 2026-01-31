# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-based Tetris game built with vanilla HTML5, CSS3, and JavaScript. No frameworks, no dependencies, no build step.

## Running the Game

Open `index.html` directly in a browser. No server or build process required.

## Architecture

The entire game lives in three files:

- **index.html** — Canvas element (320×640px), side panel UI (score/level/lines/next piece), and overlay for start/pause/game-over messages
- **styles.css** — Flexbox layout, dark blue gradient theme, responsive breakpoint at 520px that stacks the side panel below the canvas
- **game.js** — All game logic in a single file using Canvas 2D API

### game.js Structure

The file is organized into these sections (top to bottom):

1. **Constants** — Board dimensions (10×20 visible + 4 hidden spawn rows), 32px block size, color palette, key mappings, scoring formula, gravity curve
2. **Tetromino definitions** — 7 pieces (I/O/T/S/Z/J/L), each with 4 rotation states stored as 4×4 matrices in `PIECE_SHAPES`
3. **Board & collision** — `createBoard()` initializes the grid; `collides()` handles bounds, floor, and piece-to-piece collision detection
4. **Game mechanics** — `mergePiece()` locks pieces, `clearFullRows()` removes completed lines, `getGhostRow()` computes drop preview position
5. **Rendering** — `drawBlock()`, `drawBoard()`, `drawPiece()`, `drawNextPiece()` all render to canvas contexts
6. **Game state** — Board array, current/next piece, score/level/lines, high score (persisted in `localStorage`)
7. **Game loop** — `tick()` applies gravity, `draw()` renders frame, driven by `requestAnimationFrame`
8. **Input handling** — Keyboard listener for movement, rotation, hard/soft drop, pause, and start/restart

### Game Loop Flow

```
Keyboard input → Movement/rotation → Collision check → Update piece position
                                                              ↓
requestAnimationFrame loop → tick() (gravity) → draw() (render) → updateUI()
                                                              ↓
                                              On landing: merge → clear rows → score → spawn next
```

### Key Design Details

- Scoring: 100 × 2^(lines-1) per clear; +1 per soft drop row; +2 per hard drop row
- Level increases every 10 lines; gravity interval decreases per level
- High score stored in `localStorage` under default key
- Ghost piece rendered with 0.3 alpha transparency
