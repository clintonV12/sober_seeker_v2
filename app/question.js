import data from '../constants/data.js';

export function initQuiz() {
  console.log(window.quizLevel);
  const questions = data.questions;
  let currentQuestionIndex = 0;
  window.stage = "Quiz";

  function getRandomQuestionsByLevel(questions, level, count = 5) {
    const filtered = questions.filter(q => q.level === level);
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const selectedQuestions = getRandomQuestionsByLevel(questions, window.quizLevel);

  function resetOptionStyles() {
    document.querySelectorAll('.option').forEach(option => {
      option.style.backgroundColor = "#4c566a";
      option.style.color = "#eceff4";
      option.classList.remove("selected");
    });
  }

  function loadQuestion() {
    resetOptionStyles();
    const question = selectedQuestions[currentQuestionIndex];

    if (!question) return;

    document.getElementById('question-text').textContent = question.text;
    document.getElementById('optionA').textContent = 'A: ' + question.options[0];
    document.getElementById('optionB').textContent = 'B: ' + question.options[1];
    document.getElementById('optionC').textContent = 'C: ' + question.options[2];
    document.getElementById('optionD').textContent = 'D: ' + question.options[3];
    document.getElementById('score').firstElementChild.textContent = window.totalScore + ' Points';
    document.getElementById('question-number').textContent = `${currentQuestionIndex + 1} / ${selectedQuestions.length}`;
  }

  function selectOption(selectedOption) {
    const question = selectedQuestions[currentQuestionIndex];
    const correctAnswer = question.answer;

    if (selectedOption === correctAnswer) {
      window.totalScore += question.reward;
      showMsgToast(`Correct! You've earned ${question.reward} points`);
    } else {
      showMsgToast(`Incorrect! The correct answer was ${correctAnswer}.`);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < selectedQuestions.length) {
      loadQuestion();
    } else {
      window.setPageName('info');
      window.router();
    }
  }

  // Make selectOption globally available to inline HTML onclicks
  window.selectOption = selectOption;
  document.getElementById('quiz_level').textContent = `Level: ${window.quizLevel}`;
  loadQuestion();
}
