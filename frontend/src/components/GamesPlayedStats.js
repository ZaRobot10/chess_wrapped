import React, { useState, useEffect } from 'react';
import AnimatedCounter from './AnimatedCounter'; // Ensure AnimatedCounter is imported

const GamesPlayedStats = ({ data }) => {
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    if (data && data.gamesPlayed) {
      setAnimationFinished(true);
    }
  }, [data]);

  const calculatePercentage = (count) => {
    const totalGames = data.gamesPlayed;
    return ((count / totalGames) * 100).toFixed(1);
  };

  const calculateWins = () => data.wins || 0;
  const calculateDraws = () => data.draws || 0;
  const calculateLosses = () => data.losses || 0;

  return (
    <div className="games-played-stat">
      <span className="game-stat-number">
        {data && <AnimatedCounter targetValue={data.gamesPlayed} />}
      </span>
      <h2 className="game-stat-title">Games Played</h2>

      {animationFinished && data && (
        <div className="win-loss-stats">
          <div className="win-stat">
            <img src="/win-icon.png" alt="Win" />
            <span>{calculatePercentage(calculateWins())}%</span>
            <p>{calculateWins()} Won</p>
          </div>

          <div className="draw-stat">
            <img src="/draw-icon3.png"  style={{ width: '25px', height: '25px' }} alt="Draw" />
            <span>{calculatePercentage(calculateDraws())}%</span>
            <p>{calculateDraws()} Drawn</p>
          </div>

          <div className="loss-stat">
            <img src="/loss-icon.png" alt="Loss" />
            <span>{calculatePercentage(calculateLosses())}%</span>
            <p>{calculateLosses()} Lost</p>
          </div>
        </div>
      )}
      <h4 style={{ fontSize: '40px' }}>Wow! That's quite a lot of Games Played</h4>
    </div>
  );
};

export default GamesPlayedStats;
