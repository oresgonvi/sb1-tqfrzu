async function loadRecords() {
    try {
        const response = await fetch('/api/records');
        if (!response.ok) {
            throw new Error('Failed to load records');
        }
        const records = await response.json();
        
        const recordsDiv = document.getElementById('records');
        recordsDiv.innerHTML = records.map(record => `
            <div class="record">
                <p>${record.content}</p>
                <small>Created: ${new Date(record.created_at).toLocaleString()}</small>
            </div>
        `).join('');
        
        hideError();
    } catch (err) {
        showError('Error loading records: ' + err.message);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('content').value;
    
    try {
        const response = await fetch('/api/records', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
        
        if (!response.ok) {
            throw new Error('Failed to save record');
        }
        
        document.getElementById('content').value = '';
        await loadRecords();
        hideError();
    } catch (err) {
        showError('Error saving record: ' + err.message);
    }
});

// Load records when page loads
loadRecords();