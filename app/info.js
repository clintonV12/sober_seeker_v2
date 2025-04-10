console.log("score"+ totalScore)
if (window.getPageName() == "info") {
	document.getElementById("score").textContent = "Challenges completed! Your total score is " + totalScore;

  if (stage == "Quiz"){
    document.getElementById('question-text').classList.toggle("d-none");
    if (totalScore < 10) {
      document.getElementById('question-text').textContent = "You failed...you cannot continue beyond this stage";
    } else {
      document.getElementById('question-text').textContent = "Click the button below to continue to stage 2.";
      document.getElementById('step_2').classList.toggle("d-none");
    }
  }
  else if (stage == "Puzzle") {
    document.getElementById('question-text').classList.toggle("d-none");
    if (puzzleTotalScore < 25) {
      document.getElementById('question-text').textContent = "You failed...you cannot continue beyond this stage";
    } else {
      document.getElementById('question-text').textContent = "Click the button below to continue to stage 3.";
      document.getElementById('step_3').classList.toggle("d-none");
    }
  }
}