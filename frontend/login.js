const API_BASE = 'http://localhost:3000';

// Form validation function - temporarily relaxed for testing
function validateForm(username, password) {
  if (!username || !password) {
    return 'Username and password are required';
  }
  return null;
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = this.username.value;
  const password = this.password.value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      // Store user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.user.username);
      
      // Update navigation
      updateNavigation();
      
      // Redirect based on role
      if (data.role === 'admin') {
        window.location.href = 'admin-panel.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    } else {
      alert(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('An error occurred. Please try again.');
  }
});
