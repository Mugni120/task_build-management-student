const API_URL = 'http://localhost:3000/api/students';
const studentForm = document.getElementById('student-form');
const studentList = document.getElementById('student-list');
const submitBtn = document.getElementById('submit-btn');

// Escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// View Student Details
async function fetchStudents() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const students = await res.json();
        studentList.innerHTML = '';
        students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${escapeHtml(String(student.name))}</td>
                <td>${student.age}</td>
                <td>${escapeHtml(String(student.grade))}</td>
            `;
            const actionTd = document.createElement('td');
            actionTd.innerHTML = `
                <button class="btn-edit" data-id="${student.id}" data-name="${escapeHtml(String(student.name))}" data-age="${student.age}" data-grade="${escapeHtml(String(student.grade))}">Edit</button>
                <button class="btn-delete" data-id="${student.id}">Delete</button>
            `;
            tr.appendChild(actionTd);
            studentList.appendChild(tr);
        });
    } catch (err) {
        console.error('Failed to fetch students:', err);
        studentList.innerHTML = '<tr><td colspan="5">Failed to load students. Is the server running?</td></tr>';
    }
}

// Add or Update Records
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const studentData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value
    };

    try {
        if (id) {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to update student');
                return;
            }
            submitBtn.textContent = 'Add Student';
        } else {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to add student');
                return;
            }
        }
        studentForm.reset();
        document.getElementById('student-id').value = '';
        fetchStudents();
    } catch (err) {
        console.error('Failed to save student:', err);
        alert('Failed to save student. Is the server running?');
    }
});

// Event delegation for Edit and Delete buttons
studentList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-edit')) {
        const btn = e.target;
        document.getElementById('student-id').value = btn.dataset.id;
        document.getElementById('name').value = btn.dataset.name;
        document.getElementById('age').value = btn.dataset.age;
        document.getElementById('grade').value = btn.dataset.grade;
        submitBtn.textContent = 'Update Student';
    }

    if (e.target.classList.contains('btn-delete')) {
        const id = e.target.dataset.id;
        if (confirm('Yakin ingin menghapus data ini?')) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const err = await res.json();
                    alert(err.error || 'Failed to delete student');
                    return;
                }
                fetchStudents();
            } catch (err) {
                console.error('Failed to delete student:', err);
                alert('Failed to delete student. Is the server running?');
            }
        }
    }
});

// Load data saat pertama kali dibuka
fetchStudents();
