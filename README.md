# Trivia Quiz App

## Overview

The **Trivia Quiz App** is a simple, interactive web app built using **HTML**, **CSS**, and **Vanilla JavaScript**. It allows users to answer trivia questions, track their performance with a score, and view the results at the end of the quiz. The app is designed with a basic structure and is responsive across different devices.

### Live Demo

[Try the Trivia Quiz App](https://ummekulsumtumpa.github.io/Trivia-Quiz-App/)

---

## Features

- **Start Screen**: A homepage to begin the quiz.
- **Question & Answer Display**: Display trivia questions with multiple-choice answers.
- **Timer**: A countdown timer for each question or the entire quiz.
- **Score Tracker**: Track the user's score as they answer questions.
- **Result Screen**: Display the user's score at the end of the quiz.
- **Random Question Generator**: Questions are randomly selected from a set pool.
- **Correct & Incorrect Feedback**: Visual feedback to indicate if the user's answer is correct or incorrect.

---

## Technologies Used
- **HTML**: For the structure of the web app.
- **CSS**: For styling and layout.
- **JavaScript**: For interactivity and functionality.
- **JSON**: For storing trivia questions and answers.

---

## 📁 Project Structure and Workflow

This project is a raw JavaScript quiz app structured around modular components. It separates responsibilities across multiple files based on dependency order, from lower (utility/config) to higher (app logic and UI interaction).

---

## Workflow Overview

* The application loads quiz question data from a JSON file.
* It consists of two core components:

  * `UI`: A singleton object responsible for rendering and DOM updates.
  * `App`: A class that contains the core application logic and manages the quiz flow.
* Data is fetched, structured, and rendered dynamically to allow seamless quiz experiences.

---

## 📂 Module-Level Documentation

### 1. `config.js`

* Stores configuration constants such as `timePerQuestion`.
* This avoids hard-coding such values inside the logic and supports easy future changes.

### 2. `question.js`

* Exports a `Question` class that encapsulates a single quiz question.
* The constructor uses **object destructuring** to initialize `question`, `choices`, and `answer`.

```js
constructor({ question, choices, answer }) {
    this.question = question;
    this.choices = choices;
    this.answer = answer;
}
```

* The `isCorrect(userAnswer)` method compares the user’s answer to the correct answer and returns a boolean.

```js
isCorrect(userAnswer) {
    return userAnswer === this.answer;
}
```

**Why object destructuring?**

> It simplifies parameter handling and improves code readability by allowing properties to be extracted directly.

### 3. `quiz.js`

#### Key Methods:

* `async loadQuestions()`
  Fetches question data from a local JSON file and transforms it into `Question` instances.

```js
async loadQuestions() {
    try {
        const res = await fetch('./data/questions.json');
        if (!res.ok) {
            throw new Error('Failed to load questions');
        }
        const data = await res.json();
        this.questions = data.map(q => new Question(q));
    } catch (error) {
        console.error(error);
        throw new AppError('An error occurred while fetching questions'); // need to implement this error class
    }
}
```

- *Note:* the work that is left here: the custom error class, which i will implement later

**Why `async/await`?**

> Fetching external data is asynchronous. Using `async/await` ensures non-blocking execution while maintaining readability.

* `getCurrentQuestion()`
  Returns the current question based on `currentIndex`.

* `answerCurrentQuestion(userAnswer)`
  Checks the answer and updates the score if correct.

* `hasNextQuestion()`
  Returns whether more questions are left.

* `nextQuestion()`
  Advances the quiz to the next question.

### 4. `timer.js`

* Exports a `Timer` class that handles countdown logic for each question.

#### Key Methods:

* `start()`

```js
start() {
    this.interval = setInterval(() => {
        this.remaining--;
        this.onTick(this.remaining);
        if (this.remaining <= 0) {
            this.stop();
            this.onTimeUp();
        }
    }, 1000);
}
```

  Starts a 1-second interval that:

  * Decrements the remaining time.
  * Invokes a `onTick` callback to update the UI.
  * Stops the timer and calls `onTimeUp` when time runs out.

**Why `setInterval()`?**

> It schedules repetitive execution (every 1000 ms) for countdown behavior.

* `stop()`
  Stops the countdown using `clearInterval`.

* `reset()`
  Stops and resets the remaining time to the initial duration.


### 5 `app.js`

* Manages the overall quiz lifecycle by coordinating between the `Quiz`, `Timer`, and `UI`.

#### Key Methods:

* Constructor initializes `Quiz` and `Timer` instances.

```js
constructor() {
    this.quiz = new Quiz();
    this.timer = new Timer(
        config.timePerQuestion,
        () => this.handleTimeout(),
        (time) => UI.updateTimer(time)
    );
}
```

* `async start()`
  Loads the questions, renders the UI, and starts the timer.

```js
async start() {
    await this.quiz.loadQuestions();
    UI.showScreen(UI.quizScreen);
    this.renderCurrentQuestion();
    this.timer.start();
}
```

**Why asynchronous here?**

> Because `loadQuestions()` fetches data asynchronously, this method must also be `async` to properly await it.

* `renderCurrentQuestion()`
  Gets the current question and delegates rendering to the `UI`.

* `handleAnswer(userAnswer)`
  Invoked when a user selects an answer.

* `handleTimeout()`
  Invoked when time runs out.

* `finishQuiz()`
  Stops the timer and displays the final result.

### 6. `UI.js`

This module exports a singleton `UI` object responsible for handling all DOM manipulations and visual updates. Centralizing UI logic in one object ensures maintainability and avoids repetitive DOM queries throughout the app.

#### Properties

Each property corresponds to a DOM element, selected once at initialization to avoid redundant calls to `document.getElementById()`.

```js
startScreen, quizScreen, resultScreen,
startBtn, restartBtn,
questionContainer, answersContainer,
timerElement, scoreElement
```

#### Methods

* `showScreen(screen)`
  Hides all major screens (`start`, `quiz`, `result`) and then displays the specified one.

  **Why this approach?**

  > Ensures only one screen is visible at a time and avoids direct display style manipulation.

* `renderQuestion(questionObj, onAnswerClick)`

  * Renders the question text and dynamically creates answer buttons.
  * Each button is given an event listener that passes the selected answer to the provided callback.

  **Why use dynamic button creation?**

  > Allows flexibility for any number of choices per question and supports dynamic interaction without hard-coded markup.

* `showScore(score, total)`

  * Updates the result screen with the final score.

* `updateTimer(time)`

  * Updates the visible timer countdown in the UI.

* `showFeedback(isCorrect)`

  * Changes the background color briefly to indicate whether the user's answer was correct (green) or incorrect (red).
  * Resets the background after 1 second using `setTimeout`.

  **Why this visual feedback?**

  > Immediate visual response improves user experience and reinforces answer correctness without interrupting the quiz flow.

### 7. `main.js`

- it directly interacts with the html file
- it import the UI object and the App class
- creates a new app instance 
- add two event listener: start and restart btn through the UI object


