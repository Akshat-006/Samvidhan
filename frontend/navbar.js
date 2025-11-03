// Check authentication status and update navigation
function updateNavigation() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const navLinks = document.querySelector('.navbar-nav');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (token) {
        // User is logged in
        let navContent = `
            <li class="nav-item">
                <a class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}" href="dashboard.html">Dashboard</a>
            </li>`;

        // Add "Ask a Question" link for regular users
        if (role !== 'admin') {
            navContent += `
            <li class="nav-item">
                <a class="nav-link ${currentPage === 'upload-question.html' ? 'active' : ''}" href="upload-question.html">Ask a Question</a>
            </li>`;
        }

        navContent += `
            <li class="nav-item">
                <a class="nav-link ${currentPage === 'faq.html' ? 'active' : ''}" href="faq.html">FAQ</a>
            </li>`;
            
        if (role === 'admin') {
            navContent += `
            <li class="nav-item">
                <a class="nav-link ${currentPage === 'admin-panel.html' ? 'active' : ''}" href="admin-panel.html">Admin Panel</a>
            </li>`;
        }
        
        navContent += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="handleLogout()">Log Out</a>
            </li>`;
            
        navLinks.innerHTML = navContent;
    } else {
        // User is not logged in
        let navContent = '';
        
        if (currentPage === 'login.html') {
            navContent = `
                <li class="nav-item">
                    <a class="nav-link" href="signup.html">Sign Up</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="faq.html">FAQ</a>
                </li>`;
        } else if (currentPage === 'signup.html') {
            navContent = `
                <li class="nav-item">
                    <a class="nav-link" href="login.html">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="faq.html">FAQ</a>
                </li>`;
        } else {
            navContent = `
                <li class="nav-item">
                    <a class="nav-link" href="login.html">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="signup.html">Sign Up</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="faq.html">FAQ</a>
                </li>`;
        }
        
        navLinks.innerHTML = navContent;
    }
}


// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Update navigation when the page loads
document.addEventListener('DOMContentLoaded', updateNavigation);