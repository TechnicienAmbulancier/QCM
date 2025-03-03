let quiz = [];

// Load quiz questions from questions.json
fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    quiz = data;
    initializeButtons(); // Initialize event listeners when quiz is loaded
  })
  .catch(error => {
    console.error("Error loading quiz questions:", error);
  });

let currentQuestion = 0;
let score = 0;
let mode = '';
let timerInterval;
let timeLeft;
let numQuestions = 75;
let shuffledQuiz = [];
let examHistory = JSON.parse(localStorage.getItem('examHistory')) || [];
let markedQuestions = JSON.parse(localStorage.getItem('markedQuestions')) || [];
const exerciseResults = JSON.parse(localStorage.getItem('exerciseResults')) || {};

function initializeButtons() {
  document.getElementById("startExamButton")?.addEventListener("click", startExam);
  document.getElementById("startExerciseButton")?.addEventListener("click", chooseExerciseRange);
  document.getElementById("showMarkedButton")?.addEventListener("click", showMarkedQuestions);
}

function startExam() {
  if (quiz.length === 0) {
    alert("Les questions ne sont pas encore chargées.");
    return;
  }
  mode = 'exam';
  timeLeft = 120 * 60;
  numQuestions = Math.min(75, quiz.length);
  shuffledQuiz = quiz.slice(0, numQuestions);
  document.querySelector(".quiz-container").classList.add("hidden");
  document.getElementById("footer").style.display = "none";
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("timer").classList.remove("hidden");
  document.getElementById("score").classList.remove("hidden");
  currentQuestion = 0;
  score = 0;
  showQuestions();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showFinalScore();
      return;
    }
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `Temps restant : ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, 1000);
}

function selectAnswer(questionIndex, answerIndex, button) {
  const q = shuffledQuiz[questionIndex];
  button.classList.toggle("selected");
}

function chooseExerciseRange() {
  if (quiz.length === 0) {
    alert("Les questions ne sont pas encore chargées.");
    return;
  }
  document.querySelector(".quiz-container").classList.add("hidden");
  document.getElementById("footer").style.display = "none";
  document.getElementById("exerciseRangePage").classList.remove("hidden");
  const exerciseRangeOptions = document.getElementById("exerciseRangeOptions");
  exerciseRangeOptions.innerHTML = '';

  for (let i = 0; i < quiz.length - 100; i += 30) {
    let start = i + 1;
    let end = Math.min(i + 30, quiz.length - 100);
    let rangeKey = `${start}-${end}`;
    
    const rangeButton = document.createElement("button");
    rangeButton.textContent = `${rangeKey} (${exerciseResults[rangeKey] || 0}%)`;
    rangeButton.onclick = () => startExerciseRange(start - 1, end, rangeKey);
    exerciseRangeOptions.appendChild(rangeButton);
  }
}
