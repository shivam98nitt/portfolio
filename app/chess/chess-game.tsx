'use client';

import { useMemo, useRef, useState } from 'react';

type Color = 'w' | 'b';
type Piece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

type Move = {
  from: number;
  to: number;
  piece: Piece;
  captured?: Piece | null;
  promotion?: Piece | null;
  pawnDouble?: boolean;
  enPassant?: boolean;
  castling?: 'K' | 'Q' | 'k' | 'q';
};

type Snapshot = {
  board: Array<Piece | null>;
  turn: Color;
  castling: { K: boolean; Q: boolean; k: boolean; q: boolean };
  enPassant: number;
  halfmove: number;
  fullmove: number;
  captured: Piece | null;
  move: Move;
};

const SYMBOLS: Record<Piece, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

const VALUES: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

class ChessEngine {
  board: Array<Piece | null> = [];
  turn: Color = 'w';
  castling = { K: true, Q: true, k: true, q: true };
  enPassant = -1;
  halfmove = 0;
  fullmove = 1;
  history: Snapshot[] = [];
  captured: Piece[] = [];

  constructor() { this.reset(); }

  reset() {
    this.board = [
      'r','n','b','q','k','b','n','r',
      'p','p','p','p','p','p','p','p',
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      'P','P','P','P','P','P','P','P',
      'R','N','B','Q','K','B','N','R',
    ];
    this.turn = 'w';
    this.castling = { K: true, Q: true, k: true, q: true };
    this.enPassant = -1;
    this.halfmove = 0;
    this.fullmove = 1;
    this.history = [];
    this.captured = [];
  }

  isWhite(piece: Piece) { return piece === piece.toUpperCase(); }
  color(piece: Piece): Color { return this.isWhite(piece) ? 'w' : 'b'; }
  squareName(square: number) { return `${String.fromCharCode(97 + square % 8)}${8 - Math.floor(square / 8)}`; }

  findKing(color: Color) {
    const king: Piece = color === 'w' ? 'K' : 'k';
    return this.board.findIndex((piece) => piece === king);
  }

  attacked(square: number, by: Color) {
    const pawn: Piece = by === 'w' ? 'P' : 'p';
    for (const offset of by === 'w' ? [7, 9] : [-7, -9]) {
      const from = square + offset;
      if (from >= 0 && from < 64 && Math.abs((from % 8) - (square % 8)) === 1 && this.board[from] === pawn) return true;
    }

    const knight: Piece = by === 'w' ? 'N' : 'n';
    for (const offset of [-17,-15,-10,-6,6,10,15,17]) {
      const from = square + offset;
      if (from >= 0 && from < 64 && Math.abs((from % 8) - (square % 8)) <= 2 && this.board[from] === knight) return true;
    }

    const king: Piece = by === 'w' ? 'K' : 'k';
    for (const offset of [-9,-8,-7,-1,1,7,8,9]) {
      const from = square + offset;
      if (from >= 0 && from < 64 && Math.abs((from % 8) - (square % 8)) <= 1 && this.board[from] === king) return true;
    }

    const scan = (directions: number[], valid: Piece[]) => {
      for (const direction of directions) {
        let from = square + direction;
        while (from >= 0 && from < 64) {
          const previous = from - direction;
          if ((Math.abs(direction) === 1 || Math.abs(direction) === 7 || Math.abs(direction) === 9) && Math.abs((from % 8) - (previous % 8)) !== 1) break;
          const piece = this.board[from];
          if (piece) {
            if (valid.includes(piece)) return true;
            break;
          }
          from += direction;
        }
      }
      return false;
    };

    if (scan([-8,8,-1,1], by === 'w' ? ['R','Q'] : ['r','q'])) return true;
    return scan([-9,-7,7,9], by === 'w' ? ['B','Q'] : ['b','q']);
  }

  inCheck(color: Color = this.turn) {
    const king = this.findKing(color);
    return king >= 0 && this.attacked(king, color === 'w' ? 'b' : 'w');
  }

  pseudoMoves() {
    const moves: Move[] = [];
    const color = this.turn;
    const white = color === 'w';

    for (let square = 0; square < 64; square++) {
      const piece = this.board[square];
      if (!piece || this.color(piece) !== color) continue;
      const lower = piece.toLowerCase();

      if (lower === 'p') {
        const direction = white ? -8 : 8;
        const startRow = white ? 6 : 1;
        const promotionRow = white ? 0 : 7;
        const one = square + direction;
        if (one >= 0 && one < 64 && !this.board[one]) {
          if (Math.floor(one / 8) === promotionRow) {
            for (const p of white ? ['Q','R','B','N'] as Piece[] : ['q','r','b','n'] as Piece[]) moves.push({ from: square, to: one, piece, promotion: p });
          } else moves.push({ from: square, to: one, piece });
          if (Math.floor(square / 8) === startRow) {
            const two = square + direction * 2;
            if (!this.board[two]) moves.push({ from: square, to: two, piece, pawnDouble: true });
          }
        }
        for (const offset of white ? [-9,-7] : [7,9]) {
          const target = square + offset;
          if (target < 0 || target >= 64 || Math.abs((target % 8) - (square % 8)) !== 1) continue;
          const captured = this.board[target];
          if (captured && this.color(captured) !== color) {
            if (Math.floor(target / 8) === promotionRow) {
              for (const p of white ? ['Q','R','B','N'] as Piece[] : ['q','r','b','n'] as Piece[]) moves.push({ from: square, to: target, piece, captured, promotion: p });
            } else moves.push({ from: square, to: target, piece, captured });
          }
          if (target === this.enPassant) moves.push({ from: square, to: target, piece, captured: white ? 'p' : 'P', enPassant: true });
        }
      }

      if (lower === 'n') {
        for (const offset of [-17,-15,-10,-6,6,10,15,17]) {
          const target = square + offset;
          if (target < 0 || target >= 64 || Math.abs((target % 8) - (square % 8)) > 2) continue;
          const captured = this.board[target];
          if (!captured || this.color(captured) !== color) moves.push({ from: square, to: target, piece, captured });
        }
      }

      if (lower === 'k') {
        for (const offset of [-9,-8,-7,-1,1,7,8,9]) {
          const target = square + offset;
          if (target < 0 || target >= 64 || Math.abs((target % 8) - (square % 8)) > 1) continue;
          const captured = this.board[target];
          if (!captured || this.color(captured) !== color) moves.push({ from: square, to: target, piece, captured });
        }
        if (white && square === 60) {
          if (this.castling.K && !this.board[61] && !this.board[62] && !this.attacked(60,'b') && !this.attacked(61,'b') && !this.attacked(62,'b')) moves.push({ from:60,to:62,piece:'K',castling:'K' });
          if (this.castling.Q && !this.board[59] && !this.board[58] && !this.board[57] && !this.attacked(60,'b') && !this.attacked(59,'b') && !this.attacked(58,'b')) moves.push({ from:60,to:58,piece:'K',castling:'Q' });
        }
        if (!white && square === 4) {
          if (this.castling.k && !this.board[5] && !this.board[6] && !this.attacked(4,'w') && !this.attacked(5,'w') && !this.attacked(6,'w')) moves.push({ from:4,to:6,piece:'k',castling:'k' });
          if (this.castling.q && !this.board[3] && !this.board[2] && !this.board[1] && !this.attacked(4,'w') && !this.attacked(3,'w') && !this.attacked(2,'w')) moves.push({ from:4,to:2,piece:'k',castling:'q' });
        }
      }

      if (lower === 'r' || lower === 'b' || lower === 'q') {
        const directions = lower === 'r' ? [-8,8,-1,1] : lower === 'b' ? [-9,-7,7,9] : [-8,8,-1,1,-9,-7,7,9];
        for (const direction of directions) {
          let target = square + direction;
          while (target >= 0 && target < 64) {
            const previous = target - direction;
            if ((Math.abs(direction) === 1 || Math.abs(direction) === 7 || Math.abs(direction) === 9) && Math.abs((target % 8) - (previous % 8)) !== 1) break;
            const captured = this.board[target];
            if (!captured) moves.push({ from: square, to: target, piece });
            else {
              if (this.color(captured) !== color) moves.push({ from: square, to: target, piece, captured });
              break;
            }
            target += direction;
          }
        }
      }
    }
    return moves;
  }

  moves() {
    const color = this.turn;
    return this.pseudoMoves().filter((move) => {
      this.make(move, true);
      const legal = !this.inCheck(color);
      this.undo(true);
      return legal;
    });
  }

  make(move: Move, simulation = false) {
    this.history.push({
      board: [...this.board], turn: this.turn, castling: { ...this.castling }, enPassant: this.enPassant,
      halfmove: this.halfmove, fullmove: this.fullmove, captured: move.captured ?? null, move: { ...move },
    });
    this.board[move.to] = move.promotion ?? move.piece;
    this.board[move.from] = null;

    if (move.enPassant) {
      const square = this.turn === 'w' ? move.to + 8 : move.to - 8;
      if (!simulation && this.board[square]) this.captured.push(this.board[square] as Piece);
      this.board[square] = null;
    } else if (!simulation && move.captured) this.captured.push(move.captured);

    if (move.castling === 'K') { this.board[61] = 'R'; this.board[63] = null; }
    if (move.castling === 'Q') { this.board[59] = 'R'; this.board[56] = null; }
    if (move.castling === 'k') { this.board[5] = 'r'; this.board[7] = null; }
    if (move.castling === 'q') { this.board[3] = 'r'; this.board[0] = null; }

    if (move.piece === 'K') { this.castling.K = false; this.castling.Q = false; }
    if (move.piece === 'k') { this.castling.k = false; this.castling.q = false; }
    if (move.from === 63 || move.to === 63) this.castling.K = false;
    if (move.from === 56 || move.to === 56) this.castling.Q = false;
    if (move.from === 7 || move.to === 7) this.castling.k = false;
    if (move.from === 0 || move.to === 0) this.castling.q = false;

    this.enPassant = move.pawnDouble ? (this.turn === 'w' ? move.from - 8 : move.from + 8) : -1;
    this.halfmove = move.piece.toLowerCase() === 'p' || move.captured ? 0 : this.halfmove + 1;
    if (this.turn === 'b') this.fullmove += 1;
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  undo(simulation = false) {
    const snapshot = this.history.pop();
    if (!snapshot) return;
    this.board = snapshot.board;
    this.turn = snapshot.turn;
    this.castling = snapshot.castling;
    this.enPassant = snapshot.enPassant;
    this.halfmove = snapshot.halfmove;
    this.fullmove = snapshot.fullmove;
    if (!simulation && snapshot.captured) this.captured.pop();
  }

  evaluate() {
    let score = 0;
    this.board.forEach((piece, square) => {
      if (!piece) return;
      const base = VALUES[piece.toLowerCase()] ?? 0;
      const centerDistance = Math.abs(3.5 - (square % 8)) + Math.abs(3.5 - Math.floor(square / 8));
      const positional = piece.toLowerCase() === 'p' || piece.toLowerCase() === 'n' || piece.toLowerCase() === 'b' ? Math.max(0, 7 - centerDistance) * 2 : 0;
      score += this.isWhite(piece) ? base + positional : -(base + positional);
    });
    return score;
  }

  gameState() {
    const legal = this.moves();
    if (!legal.length) return this.inCheck() ? (this.turn === 'w' ? 'Black wins by checkmate' : 'White wins by checkmate') : 'Draw by stalemate';
    if (this.halfmove >= 100) return 'Draw by 50-move rule';
    return null;
  }
}

function minimax(engine: ChessEngine, depth: number, alpha: number, beta: number): number {
  const state = engine.gameState();
  if (state?.includes('checkmate')) return engine.turn === 'w' ? -100000 : 100000;
  if (state) return 0;
  if (depth === 0) return engine.evaluate();

  const moves = engine.moves().sort((a, b) => (b.captured ? VALUES[b.captured.toLowerCase()] : 0) - (a.captured ? VALUES[a.captured.toLowerCase()] : 0));
  if (engine.turn === 'w') {
    let best = -Infinity;
    for (const move of moves) {
      engine.make(move, true);
      best = Math.max(best, minimax(engine, depth - 1, alpha, beta));
      engine.undo(true);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    engine.make(move, true);
    best = Math.min(best, minimax(engine, depth - 1, alpha, beta));
    engine.undo(true);
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

function chooseMachineMove(engine: ChessEngine, difficulty: Difficulty) {
  const settings = {
    easy: { depth: 1, random: 0.45 },
    medium: { depth: 2, random: 0.16 },
    hard: { depth: 3, random: 0.04 },
    expert: { depth: 3, random: 0 },
  }[difficulty];

  const moves = engine.moves();
  if (!moves.length) return null;
  const scored = moves.map((move) => {
    engine.make(move, true);
    const score = minimax(engine, settings.depth - 1, -Infinity, Infinity);
    engine.undo(true);
    return { move, score };
  }).sort((a, b) => a.score - b.score);

  if (settings.random > 0 && Math.random() < settings.random) {
    return scored[Math.floor(Math.random() * Math.min(scored.length, Math.max(2, Math.ceil(scored.length / 2))))].move;
  }
  return scored[0].move;
}

export default function ChessGame() {
  const engineRef = useRef(new ChessEngine());
  const engine = engineRef.current;
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const legalMoves = useMemo(() => selected === null ? [] : engine.moves().filter((move) => move.from === selected), [engine, selected, version]);
  const history = engine.history.filter((_, index) => index % 1 === 0).map((item) => item.move);

  const refresh = () => setVersion((value) => value + 1);

  function machineTurn() {
    setThinking(true);
    window.setTimeout(() => {
      const move = chooseMachineMove(engine, difficulty);
      if (move) {
        engine.make(move);
        setLastMove(move);
      }
      const state = engine.gameState();
      setResult(state);
      setThinking(false);
      refresh();
    }, 220);
  }

  function play(move: Move) {
    const chosen = move.promotion ? { ...move, promotion: 'Q' as Piece } : move;
    engine.make(chosen);
    setLastMove(chosen);
    setSelected(null);
    const state = engine.gameState();
    setResult(state);
    refresh();
    if (!state && engine.turn === 'b') machineTurn();
  }

  function handleSquare(square: number) {
    if (thinking || result || engine.turn !== 'w') return;
    const piece = engine.board[square];
    if (piece && engine.isWhite(piece)) {
      setSelected(square);
      return;
    }
    if (selected !== null) {
      const move = legalMoves.find((candidate) => candidate.to === square);
      if (move) play(move);
      else setSelected(null);
    }
  }

  function newGame() {
    engine.reset();
    setSelected(null);
    setLastMove(null);
    setThinking(false);
    setResult(null);
    refresh();
  }

  function undoRound() {
    if (thinking || engine.history.length < 2) return;
    engine.undo();
    engine.undo();
    const previous = engine.history.at(-1)?.move ?? null;
    setLastMove(previous);
    setSelected(null);
    setResult(null);
    refresh();
  }

  const status = result ?? (thinking ? 'Machine is thinking…' : engine.inCheck() ? 'White is in check' : 'Your move — you are White');

  return (
    <div className="chess-game-layout">
      <div className="chess-board-wrap">
        <div className="chess-board" role="grid" aria-label="Chess board">
          {engine.board.map((piece, square) => {
            const row = Math.floor(square / 8);
            const col = square % 8;
            const legal = legalMoves.find((move) => move.to === square);
            const selectedSquare = selected === square;
            const recent = lastMove && (lastMove.from === square || lastMove.to === square);
            const checked = engine.inCheck() && engine.findKing(engine.turn) === square;
            return (
              <button
                type="button"
                key={square}
                role="gridcell"
                className={`chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'} ${selectedSquare ? 'selected' : ''} ${recent ? 'last-move' : ''} ${checked ? 'in-check' : ''}`}
                onClick={() => handleSquare(square)}
                aria-label={`${engine.squareName(square)}${piece ? ` ${piece}` : ''}`}
              >
                {piece && <span className={`chess-piece ${engine.isWhite(piece) ? 'white-piece' : 'black-piece'}`}>{SYMBOLS[piece]}</span>}
                {legal && <span className={piece ? 'capture-ring' : 'legal-dot'} aria-hidden="true" />}
                {col === 0 && <span className="rank-label" aria-hidden="true">{8 - row}</span>}
                {row === 7 && <span className="file-label" aria-hidden="true">{String.fromCharCode(97 + col)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="chess-panel">
        <div className="chess-status"><span className={thinking ? 'thinking-dot' : 'status-dot'} />{status}</div>

        <label className="chess-control">
          <span>Machine strength</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} disabled={thinking}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </label>

        <div className="chess-actions">
          <button type="button" className="button primary" onClick={newGame}>New game</button>
          <button type="button" className="button secondary" onClick={undoRound} disabled={thinking || engine.history.length < 2}>Undo round</button>
        </div>

        <div className="captured-line">
          <span>Captured</span>
          <div>{engine.captured.length ? engine.captured.map((piece, index) => <b key={`${piece}-${index}`}>{SYMBOLS[piece]}</b>) : <small>None yet</small>}</div>
        </div>

        <div className="move-history">
          <div className="move-history-head"><span>Move history</span><small>{Math.ceil(history.length / 2)} turns</small></div>
          <div className="move-list">
            {history.length === 0 && <p>Make the first move.</p>}
            {Array.from({ length: Math.ceil(history.length / 2) }).map((_, index) => {
              const white = history[index * 2];
              const black = history[index * 2 + 1];
              return (
                <div className="move-row" key={index}>
                  <span>{index + 1}.</span>
                  <b>{white ? `${engine.squareName(white.from)}${engine.squareName(white.to)}` : ''}</b>
                  <b>{black ? `${engine.squareName(black.from)}${engine.squareName(black.to)}` : ''}</b>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chess-note">Tap a piece, then tap one of the highlighted legal squares. Promotions auto-queen to keep the game fast on mobile.</div>
      </aside>
    </div>
  );
}
