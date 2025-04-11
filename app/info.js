export function initInfo() {
  console.log("score: "+ window.totalScore)
  if (window.getPageName() == "info" && window.gameMode == "Real") {

    if (window.stage == "Quiz"){
      document.getElementById("score").textContent = "Challenges completed! Your total score is " + window.totalScore;
      document.getElementById('question-text').classList.toggle("d-none");

      if (window.totalScore < 15 && window.quizLevel == "Certificate") {
        document.getElementById('question-text').textContent = "You failed...you must request transport now.";
        document.getElementById('transport').classList.toggle("d-none");

      } else if((window.totalScore >= 15 && window.totalScore < 25) && window.quizLevel == "Certificate") {
        window.quizLevel = "Delegate";
        window.totalScore = 0;
        document.getElementById('question-text').textContent = "Result is inconclusive. Try the next level quiz.";
        document.getElementById('level2').classList.toggle("d-none");

      }  else if(window.totalScore == 25 && window.quizLevel == "Certificate"){
        goToFunMode();

      } else if (window.totalScore < 15 && window.quizLevel == "Delegate") {
        document.getElementById('question-text').textContent = "You failed...you must request transport now.";
        document.getElementById('transport').classList.toggle("d-none");

      } else if((window.totalScore >= 15 && window.totalScore < 25) && window.quizLevel == "Delegate") {
        window.quizLevel = "Diplomat";
        window.totalScore = 0;
        document.getElementById('question-text').textContent = "Result is inconclusive. Try the next level quiz.";
        document.getElementById('level2').classList.toggle("d-none");

      }  else if(window.totalScore == 25 && window.quizLevel == "Diplomat"){
        goToFunMode();

      } else if (window.totalScore < 15 && window.quizLevel == "Diplomat") {
        document.getElementById('question-text').textContent = "You failed...you must request transport now.";
        document.getElementById('transport').classList.toggle("d-none");

      } else if((window.totalScore >= 15 && window.totalScore < 25) && window.quizLevel == "Diplomat") {
        document.getElementById('question-text').textContent = "Result is inconclusive. Try the puzzle instead.";
        document.getElementById('step_2').classList.toggle("d-none");
        window.totalScore = 0;

      }  else if(window.totalScore == 25 && window.quizLevel == "Diplomat"){
        goToFunMode();
      }
    }
    else if (window.stage == "Puzzle") {
      document.getElementById("score").textContent = "Challenges completed! Your total score is " + window.puzzleTotalScore;
      document.getElementById('question-text').classList.toggle("d-none");
      if (window.puzzleTotalScore < 20) {
        document.getElementById('question-text').textContent = "You failed...you cannot continue beyond this stage";
      } else {
        document.getElementById('question-text').textContent = "Click the button below to continue to stage 3.";
        document.getElementById('step_3').classList.toggle("d-none");
      }
    }

  } else if (window.getPageName() == "info" && window.gameMode == "Fun") {
    if (window.stage == "Quiz"){
      document.getElementById("score").textContent = "Challenges completed! Your total score is " + window.totalScore;
      document.getElementById('question-text').classList.toggle("d-none");

      if (window.totalScore < 15) {
        document.getElementById('question-text').textContent = "You failed...you must request transport now.";
        document.getElementById('step_2').classList.toggle("d-none");

      } else if(window.totalScore >= 15 && window.totalScore < 25) {
        document.getElementById('question-text').textContent = "Result is inconclusive. Try the next level quiz.";
        document.getElementById('step_2').classList.toggle("d-none");

      } else if(window.totalScore == 25){
        document.getElementById('question-text').textContent = "You passed the quiz with flying colors";
        document.getElementById('step_2').classList.toggle("d-none");

      }
    }
    else if (window.stage == "Puzzle") {
      document.getElementById("score").textContent = "Challenges completed! Your total score is " + window.puzzleTotalScore;
      document.getElementById('question-text').classList.toggle("d-none");
      if (window.puzzleTotalScore < 20) {
        document.getElementById('question-text').textContent = "You failed...you cannot continue beyond this stage";
      } else {
        document.getElementById('question-text').textContent = "Click the button below to continue to stage 3.";
        document.getElementById('step_3').classList.toggle("d-none");
      }
    }
  }

  function goToFunMode() {
    window.quizLevel = "Diplomat";
    window.gameMode = "Fun";
    window.totalScore = 0;
    document.getElementById('question-text').textContent = "You passed the quiz with flying colors";
    document.getElementById('fun_mode').classList.toggle("d-none");
  }
}