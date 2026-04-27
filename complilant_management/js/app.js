// Data Persistence via LocalStorage
const STORAGE_KEY = 'uni_complaints_db';

// Initialize DB
function initDB() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

// Generate unique ID like CMP-8273
function generateID() {
    return 'CMP-' + Math.floor(1000 + Math.random() * 9000);
}

// Get all complaints
function getComplaints() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save all complaints
function saveComplaints(complaints) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

// Add new complaint
function addComplaint(data) {
    const complaints = getComplaints();
    const newComplaint = {
        id: generateID(),
        name: data.name,
        rollNo: data.rollNo,
        department: data.department,
        type: data.type,
        description: data.description,
        status: 'pending', // pending, in-progress, resolved
        date: new Date().toISOString()
    };
    complaints.push(newComplaint);
    saveComplaints(complaints);
    return newComplaint.id;
}

// Get complaint by ID
function getComplaintById(id) {
    const complaints = getComplaints();
    return complaints.find(c => c.id === id.toUpperCase());
}

// Update status
function updateStatus(id, newStatus) {
    const complaints = getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index > -1) {
        complaints[index].status = newStatus;
        // Optionally update the date to reflect when it was last modified
        complaints[index].date = new Date().toISOString(); 
        saveComplaints(complaints);
        return true;
    }
    return false;
}

// Format Date nicely
function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: '2-digit', hour12: true 
    });
}

// Badge Generator HTML
function getStatusBadge(status) {
    if (status === 'pending') return '<span class="badge badge-pending">Pending</span>';
    if (status === 'in-progress') return '<span class="badge badge-progress">In Progress</span>';
    if (status === 'resolved') return '<span class="badge badge-resolved">Resolved</span>';
    return '';
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    initDB();
});

// Export globally for page scripts
window.CMS = {
    addComplaint,
    getComplaintById,
    getComplaints,
    updateStatus,
    formatDate,
    getStatusBadge
};
