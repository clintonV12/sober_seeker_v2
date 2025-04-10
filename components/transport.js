export function Transport() {
    return fetch(`${APP_URL}/pages/transport.html`)
        .then(response => response.text())
        .then(data => data);
}
