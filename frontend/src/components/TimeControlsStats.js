import React from 'react';
import './time.css';
import AnimatedCounter from './AnimatedCounter';
const TimeControlsStats = ({ topTimeModes, title}) => {
  return (
    <div className="time-controls-stat">
      <h2 className="section-title">{title}</h2>
      <table className="time-controls-table">
        <thead>
          <tr>
            <th>{title === "Your Favourite Chess Rivals" ? "Rivals" : "Time Control"}</th>
            <th>Games Played</th>
          </tr>
        </thead>
        <tbody>
          {topTimeModes.map((mode, index) => (
            <tr key={index}>
              <td>{title === "Your Favourite Chess Rivals" ? mode.player : mode.mode}</td>
                <td>
                    <AnimatedCounter targetValue={mode.count} style={{ fontSize: '1.5rem' }} />
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeControlsStats;
