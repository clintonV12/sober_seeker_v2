export function PhysicalResult() {
    return fetch(`${APP_URL}/pages/physical_result.html`)
        .then(response => response.text())
        .then(data => data);
}
