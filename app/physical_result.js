function showTestResult() {
    const result = document.getElementById('result-text');

    result.classList.remove("d-none");
    result.innerText = "You are drunk!";
}


showTestResult();
