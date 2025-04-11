// Define the HTML for the layout menu toggle
layoutMenuToggleHtml = `
    <div onclick="toggleExpanded()" class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
            <i class="bx bx-menu bx-sm"></i>
        </a>
    </div>
`;
//<img src="img/1.jpg" alt class="w-px-40 h-auto rounded-circle" />
// Define the HTML for the user dropdown
userDropdownHtml = `
    <li class="nav-item navbar-dropdown dropdown-user dropdown">
        <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
            <i class="bx bx-user bx-sm"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
            <li>
                <a class="dropdown-item" href="#">
                    <div class="d-flex">
                        <div class="flex-shrink-0 me-3">
                            <div class="avatar avatar-online">
                                <img src="assets/img/1.jpg" alt class="w-px-40 h-auto rounded-circle" />
                            </div>
                        </div>
                        <div class="flex-grow-1">
                            <span class="fw-semibold d-block">Guest</span>
                        </div>
                    </div>
                </a>
            </li>
            <li><div class="dropdown-divider my-divider"></div></li>
            <li>
				<a class="dropdown-item" href="#" onclick="exitSite()">
					<i class="bx bx-power-off me-2"></i>
					<span class="align-middle">Exit</span>
				</a>
			</li>
        </ul>
    </li>
`;

// Define the complete navbar HTML
appNavBarHtml = `
    ${layoutMenuToggleHtml}
    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        

        <ul class="navbar-nav flex-row align-items-center ms-auto">
            <!-- User -->
            ${userDropdownHtml}
            <!--/ User -->
        </ul>
    </div>
`;


function exitSite() {
    window.location.href = "index.html";  // Replace with your quiz page URL
}

// Inject the navbar HTML into the element with the ID 'layout-navbar'
document.getElementById("layout-navbar").innerHTML = appNavBarHtml;