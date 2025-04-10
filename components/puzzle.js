export function Puzzle() {
    return fetch(`${APP_URL}/pages/puzzle.html`)
        .then(response => response.text())
        .then(data => data);
}
