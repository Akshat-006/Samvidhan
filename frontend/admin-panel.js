const API_BASE = 'http://localhost:3000';

// Function to get status badge class
function getStatusBadgeClass(status) {
  if (!status) return 'badge-secondary';
  
  switch (status.toLowerCase()) {
    case 'pending': return 'badge-warning text-dark border';
    case 'approved': return 'badge-success text-dark border';
    case 'rejected': return 'badge-danger text-dark border';
    case 'in-progress': return 'badge-info text-dark border';
    default: return 'badge-secondary text-dark border';
  }
}

// Function to update question status
async function updateQuestionStatus(questionId, status) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/questions/${questionId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    loadQuestions(); // Reload questions to show updated status
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update question status. Please try again.');
  }
}

// Function to submit answer
async function submitAnswer(questionId, answer) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/questions/${questionId}/answer`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer })
    });

    if (!response.ok) {
      throw new Error('Failed to submit answer');
    }

    loadQuestions(); // Reload questions to show the answer
  } catch (error) {
    console.error('Error submitting answer:', error);
    alert('Failed to submit answer. Please try again.');
  }
}

// Show loading indicator
function showLoading() {
  const questionsList = document.getElementById('questionsList');
  questionsList.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading questions...</p>
    </div>
  `;
}

// Show error message
function showError(message) {
  const questionsList = document.getElementById('questionsList');
  questionsList.innerHTML = `
    <div class="alert alert-danger">
      <strong>Error:</strong> ${message}
      <button type="button" class="btn btn-link" onclick="loadQuestions()">Try Again</button>
    </div>
  `;
}

// Function to create a question card
function createQuestionCard(question) {
  const statusBadgeClass = getStatusBadgeClass(question.status);
  const statusDisplay = question.status ? question.status.charAt(0).toUpperCase() + question.status.slice(1) : 'Unknown';

  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="card-title me-2" title="${question.questionText || 'No question text'}">
              ${question.questionText || 'No question text'}
            </h5>
            <span class="badge ${statusBadgeClass} ms-2">${statusDisplay}</span>
          </div>
          
          <div class="card-text mb-3">
            <div class="row g-2">
              <div class="col-12">
                <small class="text-muted">Department:</small>
                <div class="fw-medium">${question.department || 'Not assigned'}</div>
              </div>
              <div class="col-12">
                <small class="text-muted">Asked by:</small>
                <div class="fw-medium">${question.user ? question.user.username : 'Unknown user'}</div>
              </div>
            </div>
          </div>

          ${question.file ? `
            <div class="mb-3">
              <a href="${API_BASE}/uploads/${question.file}" 
                 class="btn-dark btn btn-outline-primary d-inline-flex align-items-center gap-2" 
                 target="_blank">
                <i class="bi bi-file-earmark-text"></i>
                View Question File
              </a>
            </div>
          ` : ''}

          ${question.answer ? `
            <div class="alert alert-info mb-3">
              <strong>Answer:</strong>
              <p class="mt-2 mb-0 text-break">${question.answer}</p>
            </div>
          ` : ''}

          <div class="mt-auto">
            <div class="card-text mb-3">
              <label class="form-label fw-medium">Update Status:</label>
              <select class="form-select form-select-sm status-select" 
                      onchange="updateQuestionStatus('${question._id}', this.value)"
                      aria-label="Change question status">
                <option value="pending" ${question.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="in-progress" ${question.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="approved" ${question.status === 'approved' ? 'selected' : ''}>Approved</option>
                <option value="rejected" ${question.status === 'rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </div>

            <form onsubmit="event.preventDefault(); submitAnswer('${question._id}', this.answer.value);" class="mt-3">
              <div class="form-group mb-3">
                <label class="form-label fw-medium">Admin Response:</label>
                <textarea name="answer" class="form-control form-control-sm" 
                  rows="3" placeholder="Write your answer here...">${question.answer || ''}</textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-dark">
                ${question.answer ? 'Update Answer' : 'Submit Answer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to create statistics section
function createStatsSection(questions) {
  const stats = {
    total: questions.length,
    pending: questions.filter(q => q.status === 'pending').length,
    inProgress: questions.filter(q => q.status === 'in-progress').length,
    approved: questions.filter(q => q.status === 'approved').length,
    rejected: questions.filter(q => q.status === 'rejected').length
  };

  return `
    <div class="row mb-4">
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card shadow-sm h-100 border">
          <div class="card-body d-flex flex-column align-items-center justify-content-center py-4">
            <h6 class="card-title mb-3">Total Questions</h6>
            <h2 class="mb-0 display-5">${stats.total}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card shadow-sm h-100 border">
          <div class="card-body d-flex flex-column align-items-center justify-content-center py-4">
            <h6 class="card-title mb-3">Pending</h6>
            <h2 class="mb-0 display-5">${stats.pending}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card shadow-sm h-100 border">
          <div class="card-body d-flex flex-column align-items-center justify-content-center py-4">
            <h6 class="card-title mb-3">Approved</h6>
            <h2 class="mb-0 display-5">${stats.approved}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card shadow-sm h-100 border">
          <div class="card-body d-flex flex-column align-items-center justify-content-center py-4">
            <h6 class="card-title mb-3">Rejected</h6>
            <h2 class="mb-0 display-5">${stats.rejected}</h2>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Load all questions for admin
async function loadQuestions() {
  const questionsList = document.getElementById('questionsList');
  showLoading();
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch(`${API_BASE}/questions/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    
    const questions = await response.json();

    if (!questions || questions.length === 0) {
      questionsList.innerHTML = `
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No questions found.
        </div>
      `;
      return;
    }

    // Create and display the stats and questions
    const statsHtml = createStatsSection(questions);
    const questionsHtml = questions.map(createQuestionCard).join('');
    
    questionsList.innerHTML = `
      ${statsHtml}
      <div class="row">
        ${questionsHtml}
      </div>
    `;

  } catch (error) {
    console.error('Error loading questions:', error);
    showError('Failed to load questions. Please try again.');
  }
}

// Check if user is admin
function checkAdminAccess() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'admin') {
    alert('Admin access required. Please log in with an admin account.');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  if (checkAdminAccess()) {
    loadQuestions();
  }
});