# live-trivia

Server is run on computer. Accessed through local host, but by using ngrok or another hosting service, can be accessed online. The server updates the webpage over intervals, updating the leaderboard, questions. The questions are the exact same for every user on the server, and are given the same timer per question. The timer is run on the server starting at 10 seconds for each question, so if you come into a question late, you might only get 10-x seconds, so that your question finishes at the same as everyone else. New questions come up at the same time on every screen. <br>
<br>
- Questions and Answer options are provided by an ai trivia question API. Trivia by API-Ninjas
- Leaderboard is updated once you lose your streak which is visible under the questions.
- Data is saved for your username and password on your local browser, and also the server. On the first screen you have to login, or create an account if the login doesn't find an existing user. When your browser loads the page, all users and their highscores are loaded onto the server. But the server also stores and saves all the users created while it is running. The local save on the browser useful for if I end the server, so that people can still keep their highscores if I choose to reboot the server.
  - Line 8 of the terminal screenshot shows, "recieved userdata", which is the local data. All the currently loaded users are printed regularly in the terminal along with passwords


<img width="1431" alt="Loginscreen" src="https://github.com/mdurc/live-trivia-iot/assets/121322100/03857aa2-5509-43ae-9faa-cf658c0fe95c">
<img width="1438" alt="twoUsers" src="https://github.com/mdurc/live-trivia-iot/assets/121322100/8e197b26-28b5-4a30-a57e-2a03eb9b21dd">
<img width="1437" alt="twoUsersAnswer" src="https://github.com/mdurc/live-trivia-iot/assets/121322100/bca96d69-c566-4799-b457-ed26664c1954">
<img width="1433" alt="highscoreUpdated" src="https://github.com/mdurc/live-trivia-iot/assets/121322100/219603d3-91af-4eb5-a71a-588797cf8324">
<img width="567" alt="terminal" src="https://github.com/mdurc/live-trivia-iot/assets/121322100/81154a4a-e194-4a7d-88a6-37b477009a10">

