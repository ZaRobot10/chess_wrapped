import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import AnimatedCounter from './components/AnimatedCounter';
import GamesPlayedStats from './components/GamesPlayedStats';
import TimeControlsStats from './components/TimeControlsStats'; // Ensure TimeControlsStats is imported
import RatingStats from './components/RatingStats.js';
import GameDisplay from './components/GameDisplay.js'; // Ensure GameDisplay is imported
import LastPage from './components/LastPage.js';

// Replace this with your desired image path
import chessImage from './chess.png';




const App = () => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0); // To track the current page
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  // Handle username input change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setIsFetching(true);
      const response = await axios.post('http://localhost:5001/api/chess/fetch', { username });
      setError('');
      setData(response.data);
      setIsFetching(false);
      setPage(0); // Once data is fetched, start displaying the first stat page
    } catch (error) {
      setIsFetching(false);
      setError('Error fetching data');

      console.error('Error fetching data:', error);

    }
  };
  
  console.log(data);

  // List of pages to display
  const pages = [
    {
      title: `Hi ${username}`,
      content: (
        <div>
          <img src={chessImage} alt="Chess" className="chess-image" />
          <h2>What a chess year you had!</h2>
        </div>
      ),
    },

    {
      content: (
        <div className="games-played-stat">
          <span className="game-stat-number">
            {/* Check if gamesPlayed exists before rendering AnimatedCounter */}
           {data && <GamesPlayedStats data={data} />}
          </span>
        </div>
      )
    }
      
    ,    
    {
      content: (
        <div className="games-played-stat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Display Hours */}
          {data && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              <AnimatedCounter 
            targetValue={data.hours} 
            style={{ fontSize: '5rem', fontWeight: 'bold' }} // Customize font size here
          />
              </span>
              <h3 style={{ fontSize: '2rem', color: '#333', marginLeft: '10px', fontWeight: 'bold' }}>Hours</h3>
            </div>
          )}
          
          {/* Display Minutes */}
          {data && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              <AnimatedCounter 
            targetValue={data.minutes} 
            style={{ fontSize: '5rem', fontWeight: 'bold' }} // Customize font size here
          />
              </span>
              <h3 style={{ fontSize: '2rem', color: '#333', marginLeft: '10px', fontWeight: 'bold' }}>Minutes</h3>
            </div>
          )}
    
          {/* Spent Playing Text */}
          <h4 style={{ fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>Spent Playing!</h4>

          <h4 style={{ fontSize: '40px', color: '#0077b6', fontWeight: 'bold' }}>
  Impressive!<br />Let's see how you wasted this time
</h4>
        </div>
      )
    },
    
    
    
    {
      
      content: (
        <div className="time-controls-section">
          {data && <TimeControlsStats topTimeModes={data.topTimeModes} title="What time controls and variants did you play?"/>}
        </div>
      )
    
    },
    {
      content: (
        <div className="time-controls-section">
          {data && <TimeControlsStats topTimeModes={data.topPlayers} title="Your Favourite Chess Rivals"/>}
        </div>
      )
    },

    {
      content: (
        <div className="rating-section">
          {data && <RatingStats firstRatings={data.firstRatings} currentRatings={data.currRatings} />}
        </div>
      )
    },

    {
      content: (
        <div className="rating-section">
          {data && <GameDisplay firstGame={data.game1} lastGame={data.game2} />}
        </div>
      )
    },

    {
      content: (
        <LastPage />
      )
    }


  ];

  // Function to go to the next page
  const nextPage = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const justifyContentValue = page === 0 ? 'center' : 'flex-start';
  return (

    <div className="App">
      <div className="page-wrapper" >
        {data ? (
          <>
            <div className="content" style={{ justifyContent: justifyContentValue }}>
              <h1>{pages[page].title}</h1>
              <div className="content-body">{pages[page].content}</div>
            </div>

            <div className="navigation">
              <button onClick={prevPage} disabled={page === 0}>
                Previous
              </button>
              <button onClick={nextPage} disabled={page === pages.length - 1}>
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="username-form">
      <h2 className="welcome-title">Welcome to your chess review!</h2>
      <input
        type="text"
        placeholder="Enter Chess.com username"
        value={username}
        onChange={handleUsernameChange}
        className="username-input"
      />
      <button
        onClick={fetchData}
        className="fetch-button"
        disabled={isFetching} // Disable button if fetching
      >
        {isFetching ? 'Fetching...' : 'Fetch Stats'} {/* Change text based on fetching state */}
      </button>
      {error && <p style={{ color: 'red', fontSize: '1.2em' }}>{error}</p>}
    </div>
        )}
      </div>
    </div>
  );
};

export default App;
