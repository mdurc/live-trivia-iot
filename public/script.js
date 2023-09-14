const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const options = document.getElementsByClassName('Answerbtn');
const main = document.getElementsByClassName('main');
const streakValue = document.getElementById('streak');
const categoryTitle = document.getElementById('category');

const historyList = document.getElementById('history-list');

const leaderboardList = document.getElementById('leaderboard-list');

const countdownElement = document.getElementById('countdown-timer');

let countdown = 10;
let streak = 0;
let optionClicked = false
let correctAnswerCheck = "null";

let username = "";
let password = "";

let randomIndex = Math.floor(Math.random() * 4);

let userHighscore = 0;

const loginContainer = document.getElementById('login-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const startButton = document.getElementById('start-button');





const setNewHighScore = (username, highscore) => {
    console.log(username + " HIGHSCORE: "+ highscore)
    console.log(username, highscore)
    console.log(usernameInput.value.trim())
    sendScoreToServer(username, highscore);
    
    updateLeaderboard();
};

const checkUsername = (username, password) => {
    fetch('/check-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.exists) {
            // Username exists, check the password
            if (data.correctPassword) {
                // Correct password, proceed to the game
                showTrivia();
            } else {
                alert('Incorrect password. Please try again.');
            }
        } else {
            // Username doesn't exist, register the user
            const newUser = { username, password, highscore: 0 };
            const usersData = JSON.parse(localStorage.getItem('usersData')) || [];
            let actualUser;
            const userExists = usersData.some((user) => {
                if (user.username === username) {
                    console.log(user); // Print the specific user when found
                    console.log(user.password);
                    console.log(user.password !== password);
                    actualUser = user;
                    return true; // Return true to indicate that the user exists
                }
                return false;
            });
            
            if (userExists) {
                if(actualUser.password !== password){
                    alert('Incorrect Password');
                    console.log("inputted: " + password);
                }else{
                    showTrivia();
                }
            }else{
                // Add the new user to the usersData array
                registerUser(username, password);
                sendScoreToServer(username, 0);
                usersData.push(newUser);
                // Save the updated usersData array in local storage
                localStorage.setItem('usersData', JSON.stringify(usersData));
            }
        }
    })
    .catch((error) => {
        console.error('Error checking username:', error);
    });
};

const registerUser = (username, password) => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            // User registered successfully, proceed to the game
            showTrivia();
        } else {
            alert('Failed to register user. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error registering user:', error);
    });
};

const clearUsers = () => {
    fetch('/clear-users', {
        method: 'DELETE',
    })
        .then((response) => {
            localStorage.clear()
            if (response.status === 200) {
                console.log('Users and leaderboard data cleared successfully');
            } else {
                console.error('Failed to clear users and leaderboard data');
            }
        })
        .catch((error) => {
            console.error('Error clearing users and leaderboard data:', error);
        });
};


const showTrivia = () => {
    historyList.innerHTML = '';
    main[0].style.display = 'flex';
    loginContainer.style.display = 'none'; // Hide the username container
    questionContainer.style.display = 'block'; // Show the trivia questions container
    updateQuestion(); // Start fetching and displaying questions
};

const sendScoreToServer = (username, score) => {
    fetch('/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, score }),
    })
    .then((response) => {
        if (response.status === 200) {
            console.log('Score recorded successfully');
        } else {
            console.error('Failed to record score');
        }
    })
    .catch((error) => {
        console.error('Error sending score:', error);
    });
};

for (let j = 0; j < options.length; j++) {
  options[j].disabled = true;
}

// Add a click event listener to the "Start" button
startButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    password = passwordInput.value.trim();
    
    if (username.length === 0 || password.length === 0) {
        alert('Please enter both a valid username and password.');
    } else {
        // Check if the username exists on the server
        console.log(username, password);
        checkUsername(username, password);
    }
});



const updateLeaderboard = () => {
    console.log("updating leaderboard");
    const tempLeader = document.createElement('ul');
    tempLeader.id = 'leaderboard';
    tempLeader.classList.add('list');

    // Sort the leaderboard by high score
    fetch('/leaderboard')
        .then((response) => response.json())
        .then((leaderboardData) => {
            // Sort the leaderboard by score in descending order
            leaderboardData.sort((a, b) => b.score - a.score);

            // Update the leaderboard UI with the sorted entries
            leaderboardData.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${index + 1}. ${entry.username}: <span>${entry.score}</span>`;
                tempLeader.appendChild(listItem);
            });
            if(leaderboardList.innerHTML !== tempLeader.innerHTML){
                leaderboardList.innerHTML = tempLeader.innerHTML;
            }
        })
        .catch((error) => {
            console.error('Error fetching leaderboard data:', error);
        });
};

const addItemToHistory = (itemText) => {
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
      addItemToHistory("✔ Correct! ✔ Answer: "+ correctAnswerCheck);
      console.log("streak: "+ streak);
      console.log("highscoreforuser: "+ userHighscore);

    // Update high score if current streak is higher
  } else {
    // Incorrect answer clicked
    button.style.backgroundColor = 'red';
      addItemToHistory("✘ Incorrect ✘ Answer: "+ correctAnswerCheck)
      getHighscore(username)
      console.log("userHighScore: " + userHighscore)
      if (streak > userHighscore) {
          setNewHighScore(username, streak)
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
        
        countdownElement.textContent = Math.max(0, Math.floor((10000 - (currentTime - serverTimestamp)) / 1000) + 1);
        

        if (currentTime - serverTimestamp >= 10000 && currentTime - serverTimestamp <10500) {
            if(!optionClicked){
                getHighscore(username)
                console.log("userHighScore: " + userHighscore)
                if (streak > userHighscore) {
                    setNewHighScore(username, streak) // Update high score display
                }
              streak = 0; // Reset streak
              streakValue.textContent = streak; // Update streak display
                if(correctAnswerCheck!="null"){
                    addItemToHistory("⏱ Timeout ⏱ Answer: "+ correctAnswerCheck)
                }
            }
            
            for (let j = 0; j < options.length; j++) {
                options[j].disabled = false;
                options[j].style.backgroundColor = '';
                options[j].textContent = data.data[j].answer;
                console.log("Option "+ j+ ":" + data.data[j].answer);
            }
            
            
            //set current answer
            fetch('/question-index', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((result) => {
                console.log("ANSWER: "+ data.data[result.number].answer);
                
                correctAnswerCheck = data.data[result.number].answer;
                
                categoryTitle.textContent = "Category: " + data.data[result.number].category;
                
                questionText.textContent = data.data[result.number].question;
            })
            .catch((error) => {
                console.error('Error fetching random number:', error);
            });
            
            
            optionClicked = false;
        }
    })
    .catch((error) => {
      console.error('Error fetching trivia data:', error);
    });
};

const getHighscore = (username) => {
    if(username.length > 0){
        fetch(`/highscore?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then((response) => {
            if (response.status === 200) {
                // Parse the JSON response to get the highscore data
                return response.json();
            } else if (response.status === 404) {
                // User not found in leaderboard, set highscore to 0
                return { username, highscore: 0 };
            } else {
                console.log('Failed to retrieve highscore, defaulting to 0');
                return { username, highscore: 0 };
            }
        })
        .then((data) => {
            if (data) {
                // Parse the highscore as an integer
                const usersData = JSON.parse(localStorage.getItem('usersData')) || [];

                // Find the user with the matching username
                const userToUpdate = usersData.find((user) => user.username === username);

                if (userToUpdate) {
                    // Update the user's highscore
                    userToUpdate.highscore = parseInt(data.highscore);

                    // Save the updated usersData array back to local storage
                    localStorage.setItem('usersData', JSON.stringify(usersData));
                } else {
                    console.error('User not found');
                }
                userHighscore = parseInt(data.highscore);
                console.log(`Server highscore for ${data.username}: ${userHighscore}`);
            }
        })
        .catch((error) => {
            console.error('Error retrieving highscore:', error);
        });
    }
};

const sendUsersDataToServer = (usersData) => {
    fetch('/send-users-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usersData }),
    })
    .then((response) => {
        if (response.status === 200) {
            console.log('Users data sent successfully');
        } else {
            console.error('Failed to send users data');
        }
    })
    .catch((error) => {
        console.error('Error sending users data:', error);
    });
};





// Initial question update
updateQuestion();
updateLeaderboard();

const usersData = JSON.parse(localStorage.getItem('usersData')) || [];
sendUsersDataToServer(usersData);


setInterval(updateLeaderboard,5000)
setInterval(updateQuestion, 500);
