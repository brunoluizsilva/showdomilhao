const username = document.getElementById('user');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const finalText = document.querySelector('.final-text')
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;

if (mostRecentScore == 1000000) {
  finalText.innerText = 'Parabéns! Você é o novo milionário!'
  finalScore.style.color = '#f8e804'
  finalScore.innerText = `R$ ${mostRecentScore}`;

} else if (mostRecentScore == 0) {
  finalText.innerText = 'Que decepção! Treine mais e tente novamente!'
  finalScore.innerText = `R$ ${mostRecentScore}`;
}
else {
  finalText.innerText = 'Continue tentando e você será um novo milionário!'
  finalScore.innerText = `R$ ${mostRecentScore}`;
}

username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (event) => {
  event.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => {
    return b.score - a.score;
  });
  highScores.splice(5);

  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign('./index.html');
};