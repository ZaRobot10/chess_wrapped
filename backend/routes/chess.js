const express = require('express');
const axios = require('axios');
const fs = require('fs');
const router = express.Router();

// Helper function to fetch all games for the year 2024
async function fetchGamesForYear(username, year) {
  const allGames = [];

  for (let month = 1; month <= 12; month++) {
    const monthString = month.toString().padStart(2, '0'); // Format month as "01", "02", etc.

    try {
      const response = await axios.get(
        `https://api.chess.com/pub/player/${username}/games/${year}/${monthString}`
      );
      if (response.data.games) {
        allGames.push(...response.data.games); // Add games of the current month
      }
    } catch (error) {
      console.log(`No data for ${year}-${monthString}:`, error.message);
    }
    
  }

  return allGames;
}

const parseTimeFields = (pgn) => {
  const startTimeMatch = pgn.match(/\[StartTime "([0-9]{2}:[0-9]{2}:[0-9]{2})"\]/);
  const endTimeMatch = pgn.match(/\[EndTime "([0-9]{2}:[0-9]{2}:[0-9]{2})"\]/);
  const startTimeString = startTimeMatch ? startTimeMatch[1] : null;
  const endTimeString = endTimeMatch ? endTimeMatch[1] : null;
  return { startTimeString, endTimeString };
};

// Fetch Chess.com stats and games
router.post('/fetch', async (req, res) => {
  var { username } = req.body;

  try {
    // Fetch player stats
    const statsResponse = await axios.get(`https://api.chess.com/pub/player/${username}/stats`);

    // Fetch all games for the year 2024
    const year = 2024;
    const games = await fetchGamesForYear(username, year);

    if (games.length)
    {
      if (games[0].white.username.toLowerCase() === username.toLowerCase()) {
        username = games[0].white.username;
      }

      if (games[0].black.username.toLowerCase() === username.toLowerCase()) {
        username = games[0].black.username;
      }
    }

    
    // const filename = `${username}_games_${year}.json`;

    // // Write the fetched games data into a file
    // fs.writeFileSync(filename, JSON.stringify(games, null, 2));


    const stats = statsResponse.data;

    // console.log('Stats:', stats);
    // console.log('Games:', games.length);

    const currRatings = [
      stats.chess_daily.last.rating,
      stats.chess_rapid.last.rating,
      stats.chess_bullet.last.rating,
      stats.chess_blitz.last.rating
    ];

    const firstRatings = [stats.chess_daily.last.rating,
      stats.chess_rapid.last.rating,
      stats.chess_bullet.last.rating,
      stats.chess_blitz.last.rating];

      // create a set called found
      const found = new Set();


    let totalTime = 0;
    const playerCounts = new Map(); // To count occurrences of each opponent
    const timeModes = new Map(); // To count occurrences of each time mode
    games.forEach((game) => {
      const timeSpent = parseInt(game.time_control, 10); // Convert to integer

      if (!isNaN(timeSpent)) {
        totalTime += timeSpent;
      }
      
        // Track opponents
      const players = [game.white.username, game.black.username];
      players.forEach((player) => {
        if (player === username) return; // Skip counting self
        if (playerCounts.has(player)) {
          playerCounts.set(player, playerCounts.get(player) + 1);
        } else {
          playerCounts.set(player, 1);
        }
      });

      // Count time modes
      if (game.rules == 'chess' && game.time_class == 'bullet' && !found.has('bullet')) {
        found.add('bullet');
        if (username === game.white.username) {
          firstRatings[2] = game.white.rating;
        }
        if (username === game.black.username) {
          firstRatings[2] = game.black.rating;
        }
        
      }

      if (game.rules == 'chess' && game.time_class == 'blitz' && !found.has('blitz')) {
        found.add('blitz');
        if (username === game.white.username) 
        {
          firstRatings[3] = game.white.rating;
        }

        if (username === game.black.username) 
        {
          firstRatings[3] = game.black.rating;
        }
      }

      if (game.rules == 'chess' && game.time_class == 'rapid' && !found.has('rapid')) {
        found.add('rapid');
        if (username === game.white.username) {
          firstRatings[1] = game.white.rating;
        }

        if (username === game.black.username) {
          firstRatings[1] = game.black.rating;
        }
      }

      if (game.rules == 'chess' && game.time_class == 'daily' && !found.has('daily')) {
        found.add('daily');
        if (username === game.white.username) {
          firstRatings[0] = game.white.rating;
        }

        if (username === game.black.username) {
          firstRatings[0] = game.black.rating;
        }
      }


      var timeControl = game.time_class;
      if (game.rules != 'chess')
      {
        timeControl = game.rules;
      }
      if (timeModes.has(timeControl)) {

        timeModes.set(timeControl, timeModes.get(timeControl) + 1);
      } else {
        timeModes.set(timeControl, 1);
      }
    });
    
    // console.log('First Ratings:', firstRatings);
    // console.log('Current Ratings:', currRatings);
   
    // Convert maps to arrays and sort in descending order by count
const topPlayers = Array.from(playerCounts.entries())
.sort((a, b) => b[1] - a[1]) // Sort by count in descending order
.slice(0, 5) // Take top 5
.map(([player, count]) => ({ player, count })); // Format as objects

const topTimeModes = Array.from(timeModes.entries())
.sort((a, b) => b[1] - a[1]) // Sort by count in descending order
.slice(0, 5) // Take top 5
.map(([mode, count]) => ({ mode: mode.charAt(0).toUpperCase() + mode.slice(1), count })); // Format as objects


// console.log('Top players:', topPlayers);
// console.log('Top time modes:', topTimeModes);

    // Convert totalTime (in seconds) to hours and minutes
const hours = Math.floor(totalTime / 3600); // Get hours
const minutes = Math.floor((totalTime % 3600) / 60); // Get remaining minutes
  

var game1 = {
  "url": "https://www.chess.com/game/live/126783558999",
  "time_control": "180",
  "end_time": 1733044833,
  "rated": true,
  "tcn": "lB2Udt92bs!TcM8!MT2TmCZRnD5QCKRKDK6LtlT2+CLCsC0Sec+V=u=J+T2TCT!2-!9!T!2!ln+M-DMDuD",
  "uuid": "c013365f-afc4-11ef-90b3-6cfe544c0428",
  "initial_setup": "",
  "fen": "r2q2k1/ppp2p1p/2n1p1pb/3pP3/3P1P2/8/PPP2QPP/2KR1BNR b - -",
  "time_class": "blitz",
  "rules": "bughouse",
  "white": {
    "rating": 588,
    "result": "win",
    "@id": "https://api.chess.com/pub/player/lordofsouls666",
    "username": "LordOfSouls666",
    "uuid": "c883b50a-57ce-11ea-8fb3-836169fc62fd"
  },
  "black": {
    "rating": 653,
    "result": "bughousepartnerlose",
    "@id": "https://api.chess.com/pub/player/umeshjhaveri",
    "username": "umeshjhaveri",
    "uuid": "4a474d6e-c19d-11e8-8016-000000000000"
  },
  "eco": "https://www.chess.com/openings/Modern-Defense-with-1-d4"
};
var game2 = {
  "url": "https://www.chess.com/game/live/126783558999",
  "time_control": "180",
  "end_time": 1733044833,
  "rated": true,
  "tcn": "lB2Udt92bs!TcM8!MT2TmCZRnD5QCKRKDK6LtlT2+CLCsC0Sec+V=u=J+T2TCT!2-!9!T!2!ln+M-DMDuD",
  "uuid": "c013365f-afc4-11ef-90b3-6cfe544c0428",
  "initial_setup": "",
  "fen": "r2q2k1/ppp2p1p/2n1p1pb/3pP3/3P1P2/8/PPP2QPP/2KR1BNR b - -",
  "time_class": "blitz",
  "rules": "bughouse",
  "white": {
    "rating": 588,
    "result": "win",
    "@id": "https://api.chess.com/pub/player/lordofsouls666",
    "username": "LordOfSouls666",
    "uuid": "c883b50a-57ce-11ea-8fb3-836169fc62fd"
  },
  "black": {
    "rating": 653,
    "result": "bughousepartnerlose",
    "@id": "https://api.chess.com/pub/player/umeshjhaveri",
    "username": "umeshjhaveri",
    "uuid": "4a474d6e-c19d-11e8-8016-000000000000"
  },
  "eco": "https://www.chess.com/openings/Modern-Defense-with-1-d4"
};
if (games.length > 0)
{
  game1 = games[0]
  game2 = games[games.length - 1]
}

const analyzedData = {
    username,
    gamesPlayed: games.length,
    
    // Wins
    wins: games.filter((game) => {
      return (
        (game.white.result === 'win' && game.white.username === username) || 
        (game.black.result === 'win' && game.black.username === username) || 
        (game.white.result === 'kingofthehill' && game.white.username === username) || 
        (game.black.result === 'kingofthehill' && game.black.username === username)
      );
    }).length,
    
    // Losses
    losses: games.filter((game) => {
      return (
        (game.white.result === 'lose' && game.white.username === username) ||
        (game.black.result === 'lose' && game.black.username === username) ||
        (game.white.result === 'checkmated' && game.white.username === username) ||
        (game.black.result === 'checkmated' && game.black.username === username) ||
        (game.white.result === 'bughousepartnerlose' && game.white.username === username) ||
        (game.black.result === 'bughousepartnerlose' && game.black.username === username) ||
        (game.white.result === 'timeout' && game.white.username === username) ||
        (game.black.result === 'timeout' && game.black.username === username) ||
        (game.white.result === 'resigned' && game.white.username === username) ||
        (game.black.result === 'resigned' && game.black.username === username) ||
        (game.white.result === 'abandoned' && game.white.username === username) ||
        (game.black.result === 'abandoned' && game.black.username === username) ||
        (game.white.result === 'kingofthehilllose' && game.white.username === username) ||
        (game.black.result === 'kingofthehilllose' && game.black.username === username) ||
        (game.white.result === 'threecheckmate' && game.white.username === username) ||
        (game.black.result === 'threecheckmate' && game.black.username === username)

      );
    }).length,
    
    // Draws
    draws: games.filter((game) => {
      return (
        game.white.result === 'stalemate' || 
        game.black.result === 'stalemate' || 
        game.white.result === 'agreed' || 
        game.black.result === 'agreed' || 
        game.white.result === 'repetition' || 
        game.black.result === 'repetition' || 
        game.white.result === 'insufficient' || 
        game.black.result === 'insufficient' || 
        game.white.result === '50move' || 
        game.black.result === '50move' || 
        game.white.result === 'timevsinsufficient' || 
        game.black.result === 'timevsinsufficient'
      );
    }).length,
  
    favoriteOpening: 'King’s Pawn', // Placeholder (requires deeper game analysis)

    hours: hours,
    minutes : minutes,
    topPlayers,
    topTimeModes,
    firstRatings,
    currRatings,
    game1,
    game2


  };

// Initialize counters for each result type
// let wins = 0;
// let losses = 0;
// let draws = 0;
// let abandoned = 0;
// let timeout = 0;
// let resigned = 0;
// let repetition = 0;
// let timeVsInsufficient = 0;

// // Create a set to store unique game results
// const resultsSet = new Set();

// // Define the list of possible results
// const resultTypes = [
//   'win',
//   'bughousepartnerlose',
//   'abandoned',
//   'checkmated',
//   'timeout',
//   'resigned',
//   'repetition',
//   'timevsinsufficient'
// ];

// // Loop through each game
// games.forEach((game) => {
//   // Check if username matches white player
//   if (game.white.username === username) {
//     if (game.white.result) {
//       // Add result to the set
//       resultsSet.add(game.white.result);

//       // Update the count for the result
//       if (resultTypes.includes(game.white.result)) {
//         if (game.white.result === 'win') wins++;
//         if (game.white.result === 'bughousepartnerlose' || game.white.result === 'checkmated') losses++;
//         if (game.white.result === 'repetition' || game.white.result === 'timevsinsufficient') draws++;
//         if (game.white.result === 'abandoned') abandoned++;
//         if (game.white.result === 'timeout') timeout++;
//         if (game.white.result === 'resigned') resigned++;
//       }
//     }
//   }

//   // Check if username matches black player
//   if (game.black.username === username) {
//     if (game.black.result) {
//       // Add result to the set
//       resultsSet.add(game.black.result);

//       // Update the count for the result
//       if (resultTypes.includes(game.black.result)) {
//         if (game.black.result === 'win') wins++;
//         if (game.black.result === 'bughousepartnerlose' || game.black.result === 'checkmated') losses++;
//         if (game.black.result === 'repetition' || game.black.result === 'timevsinsufficient') draws++;
//         if (game.black.result === 'abandoned') abandoned++;
//         if (game.black.result === 'timeout') timeout++;
//         if (game.black.result === 'resigned') resigned++;
//       }
//     }
//   }
// });

// // Print out unique results
// console.log("Unique results: ", [...resultsSet]);

// Print counts for each result type
// console.log(`Wins: ${wins}`);
// console.log(`Losses: ${losses}`);
// console.log(`Draws: ${draws}`);
// console.log(`Abandoned: ${abandoned}`);
// console.log(`Timeouts: ${timeout}`);
// console.log(`Resigned: ${resigned}`);
// console.log(`Repetitions: ${repetition}`);
// console.log(`Time vs Insufficient: ${timeVsInsufficient}`);

// // Print the results stored in the set
// console.log("Unique game results:", [...resultsSet]);
  

    res.json(analyzedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
