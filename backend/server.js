const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chessRoutes = require('./routes/chess');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/chess', chessRoutes);

// Uptime Route for UptimeRobot
app.get('/uptime', (req, res) => {
    console.log('okay');
    res.status(200).send('Service is up and running');
  });
  

// Start Server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

