import { Quiz } from './quiz.js';
import { Timer } from './timer.js';
import { UI } from './ui.js';

export class App {
    constructor() {
        this.quiz = new Quiz();
        this.timer = new Timer(30, () => this.handleTimeout(), (time) => UI.updateTimer(time));
    }

    async start() {
        await this.quiz.loadQuestions();
        UI.showScreen(UI.quizScreen);
        this.renderCurrentQuestion();
        this.timer.start();
    }

    renderCurrentQuestion() {
        const question = this.quiz.getCurrentQuestion();
        UI.renderQuestion(question, (userAnswer) => this.handleAnswer(userAnswer));
    }

    // Handle the user's answer if they click on an answer button
    handleAnswer(userAnswer) {
        this.timer.reset();
        const isCorrect = this.quiz.answerCurrentQuestion(userAnswer);
        UI.showFeedback(isCorrect);

        if (this.quiz.hasNextQuestion()) {
            this.quiz.nextQuestion();
            this.timer.start();
            this.renderCurrentQuestion();
        } else {
            this.finishQuiz();
        }
    }

    // Handle the timeout when the user fails to answer in time
    handleTimeout() {
        if (this.quiz.hasNextQuestion()) {
            this.quiz.nextQuestion(); // Move to the next question
            this.timer.reset(); 
            this.timer.start(); 
            this.renderCurrentQuestion(); 
        } else {
            this.finishQuiz(); 
        }
    }

    finishQuiz() {
        this.timer.stop();
        UI.showScreen(UI.resultScreen);
        UI.showScore(this.quiz.score, this.quiz.questions.length);
    }
}
