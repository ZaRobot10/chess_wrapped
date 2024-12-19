import React from 'react';
import ChessBoard from './chess'; // Ensure ChessBoard is imported
import './GameDisplay.css'; // Optional: Add custom styling for this component

const GameDisplay = ({ firstGame, lastGame }) => {
  const firstGameFEN = firstGame.fen;
  const firstGameBlack = firstGame.black.username;
  const firstGameWhite = firstGame.white.username;

  const lastGameFEN = lastGame.fen;
  const lastGameBlack = lastGame.black.username;
  const lastGameWhite = lastGame.white.username;

  return (
    <div style={{ margin: '0', padding: '0' }}>
  <h1 style={{ margin: '0', padding: '0', textAlign: 'center', color: '#0077b6'}}>YOUR</h1>
      <div className="game-display-container">
        {/* First Game */}
        <div className="game-container">
          <h3>First Game</h3>
          <p className="username black-username">Black: {firstGameBlack}</p>
          <ChessBoard fen1={firstGameFEN} />
          <p className="username white-username">White: {firstGameWhite}</p>
        </div>

        {/* Last Game */}
        <div className="game-container">
          <h3>Last Game</h3>
          <p className="username black-username">Black: {lastGameBlack}</p>
          <ChessBoard fen1={lastGameFEN} />
          <p className="username white-username">White: {lastGameWhite}</p>
        </div>
      </div>
    </div>
  );
};

export default GameDisplay;
