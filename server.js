const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

let responseData;
let serverQuestionTime;

const axios = require('axios');


const options = {
  method: 'GET',
  url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
  params: {
    category: '',
    limit: '1'
  },
  headers: {
    'X-RapidAPI-Key': '8f8ffaa056mshe1d2054858d2cdap19754fjsnf4dabe271718',
    'X-RapidAPI-Host': 'trivia-by-api-ninjas.p.rapidapi.com'
  }
};


const fetchTriviaData = async () => {
    try {
        const response = await axios.request(options);
        responseData = response.data
        console.log(response.data[0].question);
        serverQuestionTime = Date.now()
    } catch (error) {
        console.error(error);
    }
};

setTimeout(() => {

   
}, 3000);

setInterval(fetchTriviaData, 11000);

// Initial fetch on server startup
fetchTriviaData();

app.use(express.static('public'));

app.get('/api/trivia', (req, res) => {
    
    res.json({ timestamp: serverQuestionTime, data: responseData });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
