export function Physical2() {
    return fetch(`${APP_URL}/pages/physical2.html`)
        .then(response => response.text())
        .then(data => data);
}
