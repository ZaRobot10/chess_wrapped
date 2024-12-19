import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard'; // Corrected import
import { Chess } from 'chess.js';

const ChessGame = ({fen1}) => {
  const [fen, setFen] = useState(fen1); // FEN from your example


  const handleMove = (move) => {
    const chess = new Chess(fen);  // Initialize chess object with current FEN
    const legalMove = chess.move(move);
    if (legalMove === null) return;
    // setFen(chess.fen());
  };
 

  return (
    <div>
      <Chessboard position={fen1} />
      {/* <button onClick={() => setFen('r6r/p1p1Rp2/p1k4p/8/3P2p1/P6P/1PP2PP1/2K1R3 w - -')}>Set Initial Position</button> */}
    </div>
  );
};

export default ChessGame;
