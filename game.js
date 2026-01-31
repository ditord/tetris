(function () {
  'use strict';

  // --- Constants ---
  const COLS = 10;
  const ROWS = 20;
  const HIDDEN_ROWS = 4;
  const TOTAL_ROWS = ROWS + HIDDEN_ROWS;
  const BLOCK_SIZE = 32;
  const CANVAS_WIDTH = COLS * BLOCK_SIZE;
  const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

  const COLORS = [
    null,
    '#00f0f0', // I - cyan
    '#f0f000', // O - yellow
    '#a000f0', // T - purple
    '#00f000', // S - green
    '#f00000', // Z - red
    '#0000f0', // J - blue
    '#f0a000', // L - orange
  ];

  const KEY = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    UP: 'ArrowUp',
    SPACE: ' ',
    P: 'p',
    Pause: 'P',
    ENTER: 'Enter',
    Z: 'z',
    X: 'x',
  };

  // Fall interval: start 1000ms, min 100ms. Level 1 = 1000, level 10 ~200, etc.
  function getFallInterval(level) {
    const ms = 1000 - (level - 1) * 100;
    return Math.max(100, ms);
  }

  const LINES_PER_LEVEL = 10;
  const SCORE_SOFT_DROP = 1;
  const SCORE_HARD_DROP_MULT = 2;
  const SCORE_LINE_BASE = 100;

  // --- Tetromino shapes (4x4, 1 = filled). One matrix per rotation 0..3 (CW).
  const SHAPES = [
    // I
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ];
  const SHAPES_O = [
    [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ];
  const SHAPES_T = [
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ];
  const SHAPES_S = [
    [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
  ];
  const SHAPES_Z = [
    [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ];
  const SHAPES_J = [
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ];
  const SHAPES_L = [
    [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ];

  const PIECE_SHAPES = [
    SHAPES,   // 0 -> I (color 1)
    SHAPES_O, // 1 -> O (color 2)
    SHAPES_T, // 2 -> T (color 3)
    SHAPES_S, // 3 -> S (color 4)
    SHAPES_Z, // 4 -> Z (color 5)
    SHAPES_J, // 5 -> J (color 6)
    SHAPES_L, // 6 -> L (color 7)
  ];

  function getPieceMatrix(pieceType, rotation) {
    const shapes = PIECE_SHAPES[pieceType];
    return shapes[rotation % 4];
  }

  function createBoard() {
    const board = [];
    for (let r = 0; r < TOTAL_ROWS; r++) {
      board.push(Array(COLS).fill(0));
    }
    return board;
  }

  function randomPieceType() {
    return Math.floor(Math.random() * 7);
  }

  function spawnPosition() {
    return { row: 0, col: Math.floor((COLS - 4) / 2) };
  }

  function createPiece(type) {
    return {
      type,
      color: type + 1,
      rotation: 0,
      ...spawnPosition(),
    };
  }

  function collides(board, piece, dRow, dCol, dRotation) {
    const matrix = getPieceMatrix(piece.type, piece.rotation + (dRotation || 0));
    const row = piece.row + (dRow || 0);
    const col = piece.col + (dCol || 0);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (matrix[r][c]) {
          const br = row + r;
          const bc = col + c;
          if (bc < 0 || bc >= COLS || br >= TOTAL_ROWS) return true;
          if (br >= 0 && board[br][bc]) return true;
        }
      }
    }
    return false;
  }

  function mergePiece(board, piece) {
    const matrix = getPieceMatrix(piece.type, piece.rotation);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (matrix[r][c]) {
          const br = piece.row + r;
          const bc = piece.col + c;
          if (br >= 0 && br < TOTAL_ROWS && bc >= 0 && bc < COLS) {
            board[br][bc] = piece.color;
          }
        }
      }
    }
  }

  function clearFullRows(board) {
    let cleared = 0;
    for (let r = TOTAL_ROWS - 1; r >= 0; r--) {
      if (board[r].every((cell) => cell !== 0)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }
    return cleared;
  }

  function drawBlock(ctx, x, y, colorIndex, size, isGhost) {
    const color = COLORS[colorIndex] || '#333';
    const s = size;
    ctx.fillStyle = color;
    if (isGhost) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x, y, s, s);
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, s - 2, s - 2);
      return;
    }
    ctx.fillRect(x, y, s, s);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(x, y, s, s * 0.3);
  }

  function drawBoard(ctx, board) {
    for (let r = HIDDEN_ROWS; r < TOTAL_ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = board[r][c];
        if (cell) {
          const x = c * BLOCK_SIZE;
          const y = (r - HIDDEN_ROWS) * BLOCK_SIZE;
          drawBlock(ctx, x, y, cell, BLOCK_SIZE, false);
        }
      }
    }
  }

  function drawPiece(ctx, piece, offsetRow, offsetCol, isGhost) {
    const matrix = getPieceMatrix(piece.type, piece.rotation);
    const row = (piece.row + offsetRow) - HIDDEN_ROWS;
    const col = piece.col + offsetCol;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (matrix[r][c]) {
          const y = (row + r) * BLOCK_SIZE;
          const x = (col + c) * BLOCK_SIZE;
          if (y >= 0) drawBlock(ctx, x, y, piece.color, BLOCK_SIZE, isGhost);
        }
      }
    }
  }

  function getGhostRow(board, piece) {
    let row = piece.row;
    while (!collides(board, { ...piece, row: row + 1 }, 0, 0, 0)) row++;
    return row;
  }

  function drawNextPiece(ctx, pieceType) {
    const piece = createPiece(pieceType);
    piece.row = 0;
    piece.col = 0;
    const matrix = getPieceMatrix(pieceType, 0);
    const pad = 4;
    const size = 28;
    const width = 4 * size + pad * 2;
    const height = 4 * size + pad * 2;
    const offsetX = (128 - width) / 2 + pad;
    const offsetY = (128 - height) / 2 + pad;
    ctx.fillStyle = '#0d0d14';
    ctx.fillRect(0, 0, 128, 128);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (matrix[r][c]) {
          drawBlock(ctx, offsetX + c * size, offsetY + r * size, piece.color, size - 1, false);
        }
      }
    }
  }

  // --- Game state ---
  const canvas = document.getElementById('game-canvas');
  const nextCanvas = document.getElementById('next-canvas');
  const overlay = document.getElementById('overlay');
  const overlayButton = document.getElementById('overlay-button');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const highScoreEl = document.getElementById('high-score');

  const ctx = canvas.getContext('2d');
  const nextCtx = nextCanvas.getContext('2d');

  let board = createBoard();
  let currentPiece = null;
  let nextPieceType = randomPieceType();
  let score = 0;
  let level = 1;
  let lines = 0;
  let lastFallTime = 0;
  let gameOver = false;
  let started = false;
  let paused = false;
  let animationId = null;

  const HIGH_SCORE_KEY = 'tetris-high-score';

  function getHighScore() {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
  }

  function setHighScore(value) {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
    highScoreEl.textContent = value;
  }

  function updateUI() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    linesEl.textContent = lines;
    highScoreEl.textContent = getHighScore();
  }

  function spawnNext() {
    currentPiece = createPiece(nextPieceType);
    nextPieceType = randomPieceType();
    drawNextPiece(nextCtx, nextPieceType);
    if (collides(board, currentPiece, 0, 0, 0)) {
      gameOver = true;
      overlay.classList.remove('hidden');
      overlayButton.textContent = 'Game Over — Tap or press Enter to restart';
    }
  }

  function lockPiece() {
    if (!currentPiece) return;
    mergePiece(board, currentPiece);
    const cleared = clearFullRows(board);
    if (cleared > 0) {
      score += SCORE_LINE_BASE * Math.pow(2, cleared - 1);
      lines += cleared;
      level = Math.floor(lines / LINES_PER_LEVEL) + 1;
    }
    currentPiece = null;
    checkHighScore();
    spawnNext();
  }

  function moveLeft() {
    if (!currentPiece || gameOver || paused || !started) return;
    if (!collides(board, currentPiece, 0, -1, 0)) {
      currentPiece.col--;
    }
  }

  function moveRight() {
    if (!currentPiece || gameOver || paused || !started) return;
    if (!collides(board, currentPiece, 0, 1, 0)) {
      currentPiece.col++;
    }
  }

  function moveDown() {
    if (!currentPiece || gameOver || paused || !started) return;
    if (collides(board, currentPiece, 1, 0, 0)) {
      lockPiece();
    } else {
      currentPiece.row++;
      score += SCORE_SOFT_DROP;
    }
  }

  function hardDrop() {
    if (!currentPiece || gameOver || paused || !started) return;
    let row = currentPiece.row;
    while (!collides(board, { ...currentPiece, row: row + 1 }, 1, 0, 0)) row++;
    const dropRows = row - currentPiece.row;
    currentPiece.row = row;
    score += dropRows * SCORE_HARD_DROP_MULT;
    lockPiece();
  }

  function rotateCW() {
    if (!currentPiece || gameOver || paused || !started) return;
    if (!collides(board, currentPiece, 0, 0, 1)) {
      currentPiece.rotation = (currentPiece.rotation + 1) % 4;
    }
  }

  function rotateCCW() {
    if (!currentPiece || gameOver || paused || !started) return;
    const nextRot = (currentPiece.rotation + 3) % 4;
    const fake = { ...currentPiece, rotation: nextRot };
    if (!collides(board, fake, 0, 0, 0)) {
      currentPiece.rotation = nextRot;
    }
  }

  function tick(now) {
    if (!started || gameOver || paused) return;
    const interval = getFallInterval(level);
    if (now - lastFallTime >= interval) {
      lastFallTime = now;
      if (currentPiece) {
        if (collides(board, currentPiece, 1, 0, 0)) {
          lockPiece();
        } else {
          currentPiece.row++;
        }
      }
    }
  }

  function draw() {
    ctx.fillStyle = '#0d0d14';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBoard(ctx, board);
    if (currentPiece) {
      const ghostRow = getGhostRow(board, currentPiece);
      drawPiece(ctx, { ...currentPiece, row: ghostRow }, 0, 0, true);
      drawPiece(ctx, currentPiece, 0, 0, false);
    }
    updateUI();
  }

  function gameLoop(now) {
    tick(now);
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    board = createBoard();
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    started = true;
    paused = false;
    lastFallTime = performance.now();
    nextPieceType = randomPieceType();
    spawnNext();
    overlay.classList.add('hidden');
    if (animationId != null) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (!started || gameOver) return;
    paused = !paused;
    if (paused) {
      overlay.classList.remove('hidden');
      overlayButton.textContent = 'Paused — Tap or press P to resume';
    } else {
      overlay.classList.add('hidden');
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === KEY.ENTER) {
      if (!started) {
        startGame();
        e.preventDefault();
        return;
      }
      if (gameOver) {
        startGame();
        e.preventDefault();
        return;
      }
    }
    if (e.key === KEY.P || e.key === KEY.Pause) {
      togglePause();
      e.preventDefault();
      return;
    }
    if (!started || gameOver || paused) return;
    switch (e.key) {
      case KEY.LEFT:
        moveLeft();
        e.preventDefault();
        break;
      case KEY.RIGHT:
        moveRight();
        e.preventDefault();
        break;
      case KEY.DOWN:
        moveDown();
        e.preventDefault();
        break;
      case KEY.UP:
      case KEY.X:
        rotateCW();
        e.preventDefault();
        break;
      case KEY.Z:
        rotateCCW();
        e.preventDefault();
        break;
      case KEY.SPACE:
        hardDrop();
        e.preventDefault();
        break;
    }
  });

  // --- Overlay click/tap handler ---
  overlayButton.addEventListener('click', function () {
    if (!started || gameOver) {
      startGame();
    } else if (paused) {
      togglePause();
    }
  });

  // --- Touch controls ---
  var touchControlsEl = document.querySelector('.touch-controls');

  var ACTION_MAP = {
    left:      { fn: moveLeft,   repeat: true  },
    right:     { fn: moveRight,  repeat: true  },
    down:      { fn: moveDown,   repeat: true  },
    rotateCW:  { fn: rotateCW,   repeat: false },
    rotateCCW: { fn: rotateCCW,  repeat: false },
    hardDrop:  { fn: hardDrop,   repeat: false },
    pause:     { fn: togglePause, repeat: false },
  };

  var repeatDelayId = null;
  var repeatIntervalId = null;

  function startRepeat(fn) {
    stopRepeat();
    fn();
    repeatDelayId = setTimeout(function () {
      repeatIntervalId = setInterval(fn, 50);
    }, 200);
  }

  function stopRepeat() {
    if (repeatDelayId != null) { clearTimeout(repeatDelayId); repeatDelayId = null; }
    if (repeatIntervalId != null) { clearInterval(repeatIntervalId); repeatIntervalId = null; }
  }

  function getActionBtn(el) {
    while (el && el !== touchControlsEl) {
      if (el.dataset && el.dataset.action) return el;
      el = el.parentElement;
    }
    return null;
  }

  var activeBtn = null;

  function activateBtn(btn) {
    if (activeBtn === btn) return;
    deactivateBtn();
    activeBtn = btn;
    btn.classList.add('active');
    var entry = ACTION_MAP[btn.dataset.action];
    if (!entry) return;
    if (entry.repeat) {
      startRepeat(entry.fn);
    } else {
      entry.fn();
    }
  }

  function deactivateBtn() {
    stopRepeat();
    if (activeBtn) {
      activeBtn.classList.remove('active');
      activeBtn = null;
    }
  }

  // Touch events on touch-controls container
  touchControlsEl.addEventListener('touchstart', function (e) {
    e.preventDefault();
    var btn = getActionBtn(e.target);
    if (btn) activateBtn(btn);
  }, { passive: false });

  touchControlsEl.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var touch = e.touches[0];
    if (!touch) return;
    var el = document.elementFromPoint(touch.clientX, touch.clientY);
    var btn = getActionBtn(el);
    if (btn) {
      activateBtn(btn);
    } else {
      deactivateBtn();
    }
  }, { passive: false });

  touchControlsEl.addEventListener('touchend', function (e) {
    e.preventDefault();
    deactivateBtn();
  }, { passive: false });

  touchControlsEl.addEventListener('touchcancel', function (e) {
    e.preventDefault();
    deactivateBtn();
  }, { passive: false });

  // Mouse events for desktop mouse on touch buttons
  touchControlsEl.addEventListener('mousedown', function (e) {
    var btn = getActionBtn(e.target);
    if (btn) activateBtn(btn);
  });

  touchControlsEl.addEventListener('mouseup', function () {
    deactivateBtn();
  });

  touchControlsEl.addEventListener('mouseleave', function () {
    deactivateBtn();
  });

  // Prevent scroll/zoom when touching the canvas
  canvas.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });

  // JS fallback: show touch controls if touch is detected
  if ('ontouchstart' in window) {
    touchControlsEl.style.display = 'flex';
  }

  function checkHighScore() {
    const hi = getHighScore();
    if (score > hi) setHighScore(score);
  }

  updateUI();
  drawNextPiece(nextCtx, nextPieceType);
})();
