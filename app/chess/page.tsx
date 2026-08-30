import ChessGame from './chess-game';
import './chess.css';

export default function ChessPage() {
  return (
    <main className="chess-page">
      <section className="chess-shell">
        <div className="chess-page-head">
          <div>
            <span className="kicker">PLAYGROUND</span>
            <h1>Play chess against my machine.</h1>
          </div>
          <p>A compact browser chess engine based on the machine-play logic you shared. You play White, the machine plays Black, and the whole board stays touch-friendly on phones and tablets.</p>
        </div>
        <ChessGame />
      </section>
    </main>
  );
}
