// app.js
import { Quiz } from './components/quiz.js';
import { Info } from './components/info.js';
import { Puzzle } from './components/puzzle.js';
import { Physical } from './components/physical.js';
import { Physical2 } from './components/physical2.js';
import { Transport } from './components/transport.js';

let pagename = 'quiz'; // Default to 'home' page

// Function to set the page name
function setPageName(page) {
    pagename = page;
}

// Function to get the current page name
function getPageName() {
    return pagename;
}

// Function to render the full page
function renderPage(content) {
    document.getElementById('app').innerHTML = `
        <div id="content">${content}</div>
    `;
    // Attach event listeners to the navigation links
    document.querySelectorAll('.page-router').forEach(link => {
        link.addEventListener('click', navigate);
    });
}

// Function to load the correct content based on pagename
async function router() {
    let content = '';

    switch (pagename) {
        case 'quiz':
            content = await Quiz();
            renderPage(content);
            const { initQuiz } = await import('./app/question.js');
            initQuiz();
            break;
        case 'info':
            content = await Info();
            renderPage(content);
            const { initInfo } = await import('./app/info.js');
            initInfo();
            break;
        case 'puzzle':
            content = await Puzzle();
            renderPage(content);
            const { initPuzzle } = await import('./app/puzzle.js');
            initPuzzle();
            break;
        case 'physical':
            content = await Physical();
            const { initPhysical } = await import('./app/physical.js');
            initPhysical();
            break;
        case 'physical2':
            content = await Physical2();
            const { initPhysical2 } = await import('./app/physical2.js');
            initPhysical2();
            break;
        case 'transport':
            content = await Transport();
            //const { initTransport } = await import('./app/transaport.js');
            //initTransport();
            break;
        default:
            content = await Quiz();
            renderPage(content);
            await import('./app/question.js');
    }
} 

// Function to handle navigation
function navigate(event) {
    event.preventDefault();
    const page = event.target.getAttribute('data-page');
    if (page) {
        setPageName(page);
        router();
    }
}

// Attach event listeners to navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Load the correct page on initial load
    const initialPage = 'quiz';
    setPageName(initialPage);
    router();
});

window.router = router;
window.setPageName = setPageName;
window.getPageName = getPageName;

