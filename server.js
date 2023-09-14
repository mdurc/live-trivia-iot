const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

let responseData;
let serverQuestionTime;

let leaderboard = [];
let userDatabase = {};

let randomAnswerIndex = 0;

const axios = require('axios');


const options = {
  method: 'GET',
  url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
  params: {limit: '4'},
  headers: {
    'X-RapidAPI-Key': '81c58a39b9msh62f6fa945e90cc8p19590bjsnfeab9f319bcb',
    'X-RapidAPI-Host': 'trivia-by-api-ninjas.p.rapidapi.com'
  }
};


const fetchTriviaData = async () => {
    console.log(userDatabase);
    randomAnswerIndex = Math.floor(Math.random()*4);
    try {
        const response = await axios.request(options);
        responseData = response.data
        console.log(response.data[randomAnswerIndex].question);
        serverQuestionTime = Date.now()
    } catch (error) {
        console.error(error);
    }
};



setInterval(fetchTriviaData, 11000);

// Initial fetch on server startup
fetchTriviaData();

app.use(express.static('public'));

app.get('/api/trivia', (req, res) => {
    
    res.json({ timestamp: serverQuestionTime, data: responseData });
});

app.get('/question-index', (req, res) => {
    res.status(200).json({ number: randomAnswerIndex });
});

app.get('/leaderboard', (req, res) => {
    // Assuming you have a 'leaderboard' array on the server
    res.status(200).json(leaderboard);
});

app.get('/highscore', (req, res) => {
    const { username } = req.query; // Get the username from the query parameters

    if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
    }

    // Find the highest score for the specified username in the leaderboard
    const userScores = leaderboard.filter(entry => entry.username === username);

    if (userScores.length === 0) {
        // User not found in the leaderboard
        res.json({ username, highscore: -1 });
    } else {
        // Calculate the highest score for the user and parse it as an integer
        const highscore = Math.max(...userScores.map(entry => entry.score));
        res.status(200).json({ username, highscore: parseInt(highscore) });
    }
});





app.post('/send-users-data', (req, res) => {
    const { usersData } = req.body;

    if (Array.isArray(usersData)) {
        // Print the received usersData array to the server console
        console.log('Received usersData:', usersData);
        for (let i = 0; i < usersData.length; i++) {
            const { username, highscore } = usersData[i];
            if (!leaderboard.some((user) => user.username === username)) {
                leaderboard.push({ username, score: highscore });
            }
        }

        res.status(200).json({ message: 'Users data received successfully' });
    } else {
        res.status(400).json({ message: 'Invalid request' });
    }
});





app.post('/score', (req, res) => {
    const { username, score } = req.body;

    if (!username || typeof score !== 'number') {
        res.status(400).json({ message: 'Invalid request' });
        return;
    }

    // Check if the username already exists in the leaderboard
    const existingEntryIndex = leaderboard.findIndex(entry => entry.username === username);

    if (existingEntryIndex !== -1) {
        // Update the score for the existing username
        leaderboard[existingEntryIndex].score = score;
        res.status(200).json({ message: 'Score updated successfully' });
    } else {
        // Add a new entry for the username and score
        leaderboard.push({ username, score });
        res.status(200).json({ message: 'Score recorded successfully' });
    }
});




app.post('/check-username', (req, res) => {
    const { username, password } = req.body;
    if (userDatabase[username]) {
        // Username exists, check the password
        const correctPassword = userDatabase[username] === password;
        res.json({ exists: true, correctPassword });
    } else {
        // Username doesn't exist
        res.json({ exists: false });
    }
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (userDatabase[username]) {
        // Username already exists
        res.json({ success: false });
    } else {
        // Register the new user
        userDatabase[username] = password;
        res.json({ success: true });
    }
});

app.delete('/clear-users', (req, res) => {
    userDatabase = {};
    leaderboard = [];

    res.status(200).json({ message: 'User data and leaderboard cleared successfully' });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
