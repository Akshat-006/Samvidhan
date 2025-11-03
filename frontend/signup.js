const API_BASE = 'http://localhost:3000';

// Form validation function
function validateForm(formData) {
  if (formData.get('password').length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (formData.get('age') < 18) {
    return 'You must be at least 18 years old';
  }
  if (formData.get('role') === 'admin' && !formData.get('adminCode')) {
    return 'Admin access code is required for admin registration';
  }
  return null;
}

document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Convert form data to JSON format
  const userData = {
    firstName: this.elements.firstName.value,
    lastName: this.elements.lastName.value,
    username: this.elements.username.value,
    email: this.elements.email.value,
    age: parseInt(this.elements.age.value),
    gender: this.elements.gender.value,
    password: this.elements.password.value,
    role: this.elements.role.value
  };

  if (userData.role === 'admin' && document.getElementById('adminCode')) {
    userData.adminCode = document.getElementById('adminCode').value;
  }

  // Validate that all required fields are filled
  for (const [key, value] of Object.entries(userData)) {
    if (!value && key !== 'adminCode') {
      alert(`${key} is required`);
      return;
    }
  }

  try {
    // Signup request
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Auto-login after signup
      try {
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: userData.username,
            password: userData.password
          })
        });
        
        const loginData = await loginRes.json();
        
        if (loginRes.ok && loginData.token) {
          // Store user data in localStorage
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('role', loginData.role);
          localStorage.setItem('username', loginData.user.username);
          
          // Update navigation
          updateNavigation();
          
          // Redirect based on role
          if (loginData.role === 'admin') {
            window.location.href = 'admin-panel.html';
          } else {
            window.location.href = 'dashboard.html';
          }
        } else {
          alert('Signup successful but login failed. Please try logging in.');
          window.location.href = 'login.html';
        }
      } catch (loginErr) {
        console.error('Login error:', loginErr);
        alert('Signup successful but login failed. Please try logging in.');
        window.location.href = 'login.html';
      }
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    console.error('Signup error:', err);
    alert('An error occurred during signup. Please try again.');
  }
});
document.getElementById('role').addEventListener('change', function() {
  const role = this.value;
  const adminOptions = document.getElementById('adminOptions');
  if (role === 'admin') {
    adminOptions.style.display = 'block';
    // Add adminCode input if not present
    if (!document.getElementById('adminCode')) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-control mt-2';
      input.name = 'adminCode';
      input.id = 'adminCode';
      input.placeholder = 'Admin Access Code';
      input.required = true;
      adminOptions.appendChild(input);
    }
  } else {
    adminOptions.style.display = 'none';
    // Remove adminCode input if present
    const input = document.getElementById('adminCode');
    if (input) adminOptions.removeChild(input);
  }
});
document.getElementById('adminOptions').style.display = 'none'; // Hide by default