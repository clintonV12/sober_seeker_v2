export function Info() {
    return fetch(`${APP_URL}/pages/info.html`)
        .then(response => response.text())
        .then(data => data);
}
