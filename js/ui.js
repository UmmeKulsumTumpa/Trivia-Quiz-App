export const UI = {
    startScreen: document.getElementById('start-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    questionContainer: document.getElementById('question-container'),
    answersContainer: document.getElementById('answers-container'),
    timerElement: document.getElementById('time'),
    scoreElement: document.getElementById('score'),

    showScreen(screen) {
        this.startScreen.classList.add('hidden');
        this.quizScreen.classList.add('hidden');
        this.resultScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    },

    renderQuestion(questionObj, onAnswerClick) {
        this.questionContainer.innerText = questionObj.question;
        console.log(questionObj.question);
        
        this.answersContainer.innerHTML = '';
        questionObj.choices.forEach((choice) => {
            const btn = document.createElement('button');
            btn.innerText = choice;
            btn.addEventListener('click', () => onAnswerClick(choice));
            this.answersContainer.appendChild(btn);
        });
    },

    showScore(score, total) {
        this.scoreElement.innerText = `Your Score: ${score}/${total}`;
    },

    updateTimer(time) {
        this.timerElement.innerText = time;
    },

    showFeedback(isCorrect) {
        document.body.style.backgroundColor = isCorrect ? '#d4edda' : '#f8d7da';
        setTimeout(() => {
            document.body.style.backgroundColor = '#f4f4f4';
        }, 1000);
    }
};
