/**
 * Main
 */

'use strict';

var menu, animate;

function loadScript(url, callback) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = function() {
      console.log(`Script ${url} loaded successfully.`);
      if (callback) callback();
    };

    script.onerror = function() {
      console.error(`Failed to load script ${url}.`);
    };

    document.head.appendChild(script);
  };

  // URL of the PerfectScrollbar library
  var scrollbarLibraryUrl = 'https://cdnjs.cloudflare.com/ajax/libs/perfect-scrollbar/1.5.3/perfect-scrollbar.min.js';

  // Function to initialize the layout menu
  function initializeLayoutMenu() {
    let layoutMenuEl = document.querySelectorAll('#layout-menu');

    layoutMenuEl.forEach(element => {
      try {
        // Initialize the menu with the specified options
        let menu = new Menu(element, {
          orientation: 'vertical',
          closeChildren: false
        });

        // Scroll to the active element without animation
        window.Helpers.scrollToActive({ animate: false });
        window.Helpers.mainMenu = menu;

      } catch (error) {
        // Handle specific error without relying on string comparison
        if (error.message.includes('no element is specified to initialize PerfectScrollbar')) {
          setCurrentPage(currentPage);
        } else {
          console.error('Unexpected error occurred during menu initialization:', error);
        }
      }
    });
  }

function toggleExpanded() {
  window.Helpers.toggleCollapsed();
  document.querySelector('.layout-menu-toggle').classList.add('d-block');
  console.log('menu-toggle');
}

(function () {
  // Initialize menu
  //----------------

  // Lazy load the PerfectScrollbar library and then initialize the layout menu
  loadScript(scrollbarLibraryUrl, initializeLayoutMenu);


  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll('.layout-menu-toggle');
  menuToggler.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      // Call the toggle function
      window.Helpers.toggleCollapsed();
    });
  });


  // Display menu toggle (layout-menu-toggle) on hover with delay
  let delay = function (elem, callback) {
    let timeout = null;
    elem.onmouseenter = function () {
      // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
      if (!Helpers.isSmallScreen()) {
        timeout = setTimeout(callback, 300);
      } else {
        timeout = setTimeout(callback, 0);
      }
    };

    elem.onmouseleave = function () {
      // Clear any timers set to timeout
      document.querySelector('.layout-menu-toggle').classList.remove('d-block');
      clearTimeout(timeout);
    };
  };
  if (document.getElementById('layout-menu')) {
    delay(document.getElementById('layout-menu'), function () {
      // not for small screen
      if (!Helpers.isSmallScreen()) {
        document.querySelector('.layout-menu-toggle').classList.add('d-block');
      }
    });
  }

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName('menu-inner'),
    menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
      if (this.querySelector('.ps__thumb-y').offsetTop) {
        menuInnerShadow.style.display = 'block';
      } else {
        menuInnerShadow.style.display = 'none';
      }
    });
  }

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
      e.target.closest('.accordion-item').classList.add('active');
    } else {
      e.target.closest('.accordion-item').classList.remove('active');
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
    accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
  });

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  window.Helpers.setCollapsed(true, false);
})();