export function Quiz() {
    return fetch(`${APP_URL}/pages/quiz.html`)
        .then(response => response.text())
        .then(data => data);
}
