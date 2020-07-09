const question = document.getElementById('question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const questionCounterText = document.getElementById('questionCounter');
const rodadaFinal = document.querySelector('.rodadaFinal');
const rodada = document.querySelector('.rodada');
const scoreText = document.getElementById('score');
const roundText = document.getElementById('round');
const roundDesc = document.getElementById('roundDesc');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const btnJogar = document.querySelector('.btnJogar');
const btnParar = document.querySelector('.btnParar');
const btnSair = document.querySelector('.btnSair');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch('data.json')
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions;
    startGame();
  })
// constants

let CORRECT_BONUS;
const MAX_QUESTIONS = 16;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();

};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('./end.html')
  }
  questionCounter++;
  if (questionCounter <= 5) {
    roundText.innerText = '1ª'

    CORRECT_BONUS = 1000;
  } else if (questionCounter > 5 && questionCounter <= 6) {
    roundText.innerText = '2ª'

    CORRECT_BONUS = 5000;
  }
  else if (questionCounter >= 7 && questionCounter <= 10) {
    roundText.innerText = '2ª'
    CORRECT_BONUS = 10000;

  } else if (questionCounter > 10 && questionCounter <= 11) {
    roundText.innerText = '3ª'

    CORRECT_BONUS = 50000;
  }
  else if (questionCounter > 11 && questionCounter <= 15) {
    roundText.innerText = '3ª'

    CORRECT_BONUS = 100000;
  } else if (questionCounter === 16) {
    rodada.classList.add('rodadaFinal');
    // rodada.style.color = '#f8e804'
    rodada.innerText = 'Rodada Final'
    roundText.style.display = 'none'

    CORRECT_BONUS = 500000;
  }

  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });
  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener('click', event => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = event.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToAplly = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToAplly === 'correct') {
      incrementScore(CORRECT_BONUS);
      btnParar.style.visibility = 'visible';
    }
    else if (classToAplly === 'incorrect' && score === 0 || score === 500000) {
      zeroScore(CORRECT_BONUS);
    } else {
      decrementScore(CORRECT_BONUS);
      alert('Você perdeu!');
    }

    selectedChoice.parentElement.classList.add(classToAplly);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToAplly);
      getNewQuestion();
    }, 1000);
  });
});

btnParar.addEventListener('click', event => {
  event.preventDefault();
  const scoreAtual = score;
  const continuarOuParar = confirm(`Deseja parar e levar para casa R$ ${scoreAtual}?`);
  if (continuarOuParar) {
    stopScore(CORRECT_BONUS);
  }
});

btnSair.addEventListener('click', event => {
  event.preventDefault();
  return window.location.assign('./index.html');
})

incrementScore = (num) => {
  if (num) {
    score += num;
    scoreText.innerText = score;
  }
}
decrementScore = (num) => {
  if (num) {
    if (score > 0) {
      score /= 2;
      scoreText.innerText = score;
      localStorage.setItem('mostRecentScore', score);
      return window.location.assign('./end.html')
    }
  }
}

stopScore = (num) => {
  if (num) {
    if (score > 0) {
      score;
      scoreText.innerText = score;
      localStorage.setItem('mostRecentScore', score);
      return window.location.assign('./end.html')
    }
  }
}

zeroScore = (num) => {
  if (num) {
    score = 0;
    scoreText.innerText = score;
    alert('Você perdeu!');
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('./end.html')
  }
}

const tempo = document.getElementById('tempo');
let count = 121;
btnJogar.addEventListener('click', (event) => {
  event.preventDefault();
  cronometro();
});
function cronometro() {
  if ((count - 1) >= 0) {
    count -= 1;
    setTimeout('cronometro();', 1000);
    tempo.innerText = count;
  } else {
    score = 0;
    scoreText.innerText = score;
    localStorage.setItem('mostRecentScore', score);
    alert('Tempo esgotado! Você perdeu!')
    return window.location.assign('end.html')
  }
}
