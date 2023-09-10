const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const options = document.getElementsByClassName('Answerbtn');
const streakValue = document.getElementById('streak');
const categoryTitle = document.getElementById('category');
const highScoreValue = document.getElementById('highscore'); // Add this line
const countdownElement = document.getElementById('countdown-timer');

let countdown = 10;
let streak = 0;
let highScore = 0;
let optionClicked = false
let correctAnswerCheck = "null";

let randomIndex = Math.floor(Math.random() * 4);
// Function to update the question


const addItemToHistory = (itemText) => {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = itemText;
    historyList.appendChild(listItem);
};

const handleButtonClick = (button, correctAnswer) => {
  if (optionClicked) return; // If an answer has already been clicked, do nothing
    optionClicked = true;

  if (button.textContent === correctAnswer) {
    // Correct answer clicked
    button.style.backgroundColor = 'green';
    streak++; // Increase streak
      streakValue.textContent = streak; // Update streak display
      addItemToHistory("🟩Correct!🟩");

    // Update high score if current streak is higher
  } else {
    // Incorrect answer clicked
    button.style.backgroundColor = 'red';
      addItemToHistory("🟥Incorrect🟥")
      if (streak > highScore) {
        highScore = streak;
        highScoreValue.textContent = highScore; // Update high score display
      }
    streak = 0; // Reset streak
    streakValue.textContent = streak; // Update streak display
  }

  // Disable all answer buttons after a click
  for (let j = 0; j < options.length; j++) {
    options[j].disabled = true;
  }
};

for (let i = 0; i < options.length; i++) {
  // Add click event listeners to each button
    options[i].addEventListener('click', () => {
        console.log("button: "+options[i].textContent);
        console.log("ans: "+ correctAnswerCheck);
      handleButtonClick(options[i], correctAnswerCheck);
    });
}


const updateQuestion = () => {
  fetch('/api/trivia')
    .then((response) => response.json())
    .then((data) => {
        
        const currentTime = Date.now();
        const serverTimestamp = data.timestamp;
        
        console.log("curr: "+ currentTime)
        console.log("server: "+ serverTimestamp)
        console.log("diff: "+ (currentTime-serverTimestamp))
        countdownElement.textContent = Math.max(0, Math.floor((10000 - (currentTime - serverTimestamp)) / 1000) + 1);
        

        if (currentTime - serverTimestamp >= 10000 && currentTime - serverTimestamp <10500) {
            if(!optionClicked){
                if (streak > highScore) {
                  highScore = streak;
                  highScoreValue.textContent = highScore; // Update high score display
                }
              streak = 0; // Reset streak
              streakValue.textContent = streak; // Update streak display
                addItemToHistory("🟥Did not answer🟥")
            }
            
            for (let j = 0; j < options.length; j++) {
              options[j].disabled = false;
                options[j].style.backgroundColor = '';
            }
            
            console.log(data.timestamp)
            console.log(data.data[0].category);
            console.log("");
            console.log(data.data[0].question);
            console.log("");
            console.log(data.data[0].answer);
            
            correctAnswerCheck = data.data[0].answer;
            randomIndex = Math.floor(Math.random() * 4);
            
            categoryTitle.textContent = "Category: " + data.data[0].category;
            options[randomIndex].textContent = data.data[0].answer;
            questionText.textContent = data.data[0].question;
            optionClicked = false;
        }
    })
    .catch((error) => {
      console.error('Error fetching trivia data:', error);
    });
};

// Initial question update
updateQuestion();

// Update the question every 10 seconds
setInterval(updateQuestion, 500);
