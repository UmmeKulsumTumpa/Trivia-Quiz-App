import { Question } from './question.js';

export class Quiz {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
    }

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

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    answerCurrentQuestion(userAnswer) {
        const question = this.getCurrentQuestion();
        if (question.isCorrect(userAnswer)) {
            this.score++;
            return true;
        }
        return false;
    }

    hasNextQuestion() {
        return this.currentIndex < this.questions.length - 1;
    }

    nextQuestion() {
        this.currentIndex++;
    }
}
