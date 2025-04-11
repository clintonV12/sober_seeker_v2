export function Physical3() {
    return fetch(`${APP_URL}/pages/physical3.html`)
        .then(response => response.text())
        .then(data => data);
}
