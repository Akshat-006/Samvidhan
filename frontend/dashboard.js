const API_BASE = 'http://localhost:3000';

// Load user profile and questions
async function loadDashboard() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  try {
    // Load user profile
    const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!profileResponse.ok) throw new Error('Failed to fetch profile');
    const profile = await profileResponse.json();

    // Display user profile
    const profileSection = document.getElementById('userProfile');
    profileSection.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 text-center">
              ${profile.profilePhoto ? 
                `` :
                '<div class="placeholder-profile mb-3"><img src="img/istockphoto-1300845620-612x612.jpg" alt="Profile" class="img-fluid rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;"></div>'
              }
              
            </div>
            <div class="col-md-8">
              <h3>${profile.firstName} ${profile.lastName}</h3>
              <p><strong>Username:</strong> ${profile.username}</p>
              <p><strong>Email:</strong> ${profile.email}</p>
              <p><strong>Age:</strong> ${profile.age}</p>
              <p><strong>Gender:</strong> ${profile.gender}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Load user's questions
    const questionsResponse = await fetch(`${API_BASE}/questions/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
    const questions = await questionsResponse.json();

    // Display questions
    const questionsList = document.getElementById('questionsList');
    if (questions.length === 0) {
      questionsList.innerHTML = '<p class="text-muted">No questions asked yet.</p>';
      return;
    }

    questionsList.innerHTML = questions.map(q => `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${q.questionText}</h5>
          <p class="card-text"><small class="text-muted">Keywords: ${q.keywords.join(', ')}</small></p>
          <p class="card-text"><strong>Department:</strong> ${q.department}</p>
          <p class="card-text"><strong>Status:</strong> <span class="badge bg-${getStatusBadgeColor(q.status)}">${q.status}</span></p>
          ${q.file ? `<p class="card-text"><a href="${API_BASE}/uploads/${q.file}" target="_blank" class="btn btn-sm btn-outline-primary">View Attachment</a></p>` : ''}
          ${q.answer ? `
            <div class="mt-3 p-3 bg-light rounded">
              <h6>Admin Response:</h6>
              <p class="mb-0">${q.answer}</p>
            </div>
          ` : '<p class="text-muted mb-0">Awaiting response...</p>'}
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error:', error);
    alert('Error loading dashboard');
  }
}

// Utility function to get badge color based on status
function getStatusBadgeColor(status) {
  switch (status) {
    case 'pending': return 'warning';
    case 'reviewed': return 'info';
    case 'approved': return 'success';
    default: return 'secondary';
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  // Set up navigation
  const role = localStorage.getItem('role');
  const navLinks = document.getElementById('navLinks');
  if (role === 'admin') {
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="admin-panel.html">Admin Panel</a></li>
      <li class="nav-item"><a class="nav-link" onclick="handleLogout()" style="cursor: pointer;">Logout</a></li>
    `;
  } else {
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="upload-question.html">Ask Question</a></li>
      <li class="nav-item"><a class="nav-link" onclick="handleLogout()" style="cursor: pointer;">Logout</a></li>
    `;
  }

  loadDashboard();
});