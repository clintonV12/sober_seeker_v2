export function Physical() {
    return fetch(`${APP_URL}/pages/physical.html`)
        .then(response => response.text())
        .then(data => data);
}
