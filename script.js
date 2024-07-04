const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const loadingIndicator = document.getElementById('loading-indicator');
const correctScoreElement = document.getElementById('correct-score');
const incorrectScoreElement = document.getElementById('incorrect-score');

let currentQuestionIndex = 0;
let questions = [];
let correctScore = 0;
let incorrectScore = 0;

async function fetchQuestions() {
    loadingIndicator.classList.remove('hide');
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    questions = data.results.map(question => {
        const formattedQuestion = {
            question: question.question,
            answers: []
        };
        const answerChoices = [...question.incorrect_answers];
        formattedQuestion.answers = answerChoices.map(answer => ({
            text: answer,
            correct: false
        }));
        formattedQuestion.answers.push({
            text: question.correct_answer,
            correct: true
        });
        return formattedQuestion;
    });
    loadingIndicator.classList.add('hide');
    startGame();
}

function startGame() {
    currentQuestionIndex = 0;
    correctScore = 0;
    incorrectScore = 0;
    updateScore();
    nextButton.classList.add('hide');
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionContainer.innerText = question.question;
    answerButtons.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtons.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        selectedButton.style.backgroundColor = 'green';
        correctScore++;
    } else {
        selectedButton.style.backgroundColor = 'red';
        incorrectScore++;
    }
    updateScore();
    Array.from(answerButtons.children).forEach(button => {
        button.removeEventListener('click', selectAnswer);
    });
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        nextButton.innerText = 'Restart';
        nextButton.classList.remove('hide');
    }
}

function updateScore() {
    correctScoreElement.innerText = correctScore;
    incorrectScoreElement.innerText = incorrectScore;
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        fetchQuestions();
    }
});

fetchQuestions();