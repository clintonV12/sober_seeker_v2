// app.js
import { Quiz } from './components/quiz.js';
import { Info } from './components/info.js';
import { Puzzle } from './components/puzzle.js';
import { Physical } from './components/physical.js';
import { PhysicalResult } from './components/physical_result.js';
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
            
            const script = document.createElement('script');
            script.src = 'app/question.js';
            script.async = true;
            document.body.appendChild(script);
            break;
        case 'info':
            content = await Info();

            const script1 = document.createElement('script');
            script1.src = 'assets/js/info.js';
            script1.async = true;
            document.body.appendChild(script1);
            break;
        case 'puzzle':
            content = await Puzzle();
            const script2 = document.createElement('script');
            script2.src = 'assets/js/puzzle.js';
            script2.async = true;
            document.body.appendChild(script2);
            break;
        case 'physical':
            content = await Physical();
            const script3 = document.createElement('script');
            script3.src = 'assets/js/physical.js';
            script3.async = true;
            document.body.appendChild(script3);
            break;
        case 'physical_result':
            content = await PhysicalResult();
            const script4 = document.createElement('script');
            script4.src = 'assets/js/physical_result.js';
            script4.async = true;
            document.body.appendChild(script4);
            break;
        case 'transport':
            content = await Transport();
            break;
        default:
            content = await Quiz();
    }

    renderPage(content);
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

