const API_BASE = 'http://localhost:3000';

// Load departments for dropdown
async function loadDepartments() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/departments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const departments = await response.json();
    const dropdown = document.getElementById('departmentDropdown');
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept.name;
      option.textContent = dept.name;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading departments:', error);
    alert('Error loading departments');
  }
}

// Handle form submission
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('questionText', this.questionText.value);
  formData.append('keywords', this.keywords.value);
  formData.append('department', this.department.value);
  
  if (this.file.files[0]) {
    formData.append('file', this.file.files[0]);
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/questions/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      alert('Question uploaded successfully!');
      window.location.href = 'dashboard.html';
    } else {
      const data = await response.json();
      alert(data.message || 'Error uploading question');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error uploading question');
  }
});

// Load departments when page loads
document.addEventListener('DOMContentLoaded', loadDepartments);
