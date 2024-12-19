import React from 'react';
import './time.css';
import AnimatedCounter from './AnimatedCounter';

const RatingStats = ({ firstRatings, currentRatings}) => {
  const gameModes = ['Chess Daily', 'Chess Rapid', 'Chess Bullet', 'Chess Blitz'];

  return (
    <div className="time-controls-stat">
      <h2 className="section-title">"Here's how your rating changed this year"</h2>
      <table className="time-controls-table">
        <thead>
          <tr>
            <th>Game Mode</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {firstRatings.map((rating, index) => (
            <tr key={index}>
              <td>{gameModes[index]}</td>
              <td className="custom-rating">
              {rating}
            </td>
              <td className="custom-rating">
                {currentRatings[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatingStats;
