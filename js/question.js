export class Question {
    // object destructuring to extract properties from the object
// ----------------------------------------------------
// left work: what if wrong object is passed? need to handle this later
// ----------------------------------------------------
    constructor( {question, choices, answer} ) {
        this.question = question;
        this.choices = choices;
        this.answer = answer;
    }

    isCorrect(userAnswer) {
        return userAnswer === this.answer;
    }
}
