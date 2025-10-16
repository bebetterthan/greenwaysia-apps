document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserProfile();
    setupTabs();
    setupForms();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
}

async function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('avatar-initials').textContent = user.name.charAt(0).toUpperCase();

    document.getElementById('info-name').textContent = user.name;
    document.getElementById('info-email').textContent = user.email;
    document.getElementById('info-phone').textContent = user.phone || 'Not provided';
    document.getElementById('info-address').textContent = user.address || 'Not provided';

    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-address').value = user.address || '';

    if (user.created_at) {
        const createdDate = new Date(user.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        document.getElementById('days-member').textContent = daysDiff;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/saved-locations', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('saved-locations-count').textContent = data.data?.length || 0;
        }
    } catch (error) {
        console.error('Error loading saved locations:', error);
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function setupForms() {
    document.getElementById('edit-profile-form').addEventListener('submit', handleProfileUpdate);
    document.getElementById('change-password-form').addEventListener('submit', handlePasswordChange);
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const name = document.getElementById('edit-name').value;
    const phone = document.getElementById('edit-phone').value;
    const address = document.getElementById('edit-address').value;
    const messageDiv = document.getElementById('edit-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, phone, address })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.name = name;
            user.phone = phone;
            user.address = address;
            localStorage.setItem('user', JSON.stringify(user));

            if (typeof showToast === 'function') {
                showToast('Profile updated successfully!', 'success');
            } else {
                showMessage(messageDiv, 'Profile updated successfully!', 'success');
            }
            loadUserProfile();
            setTimeout(() => switchTab('overview'), 1500);
        } else {
            if (typeof showToast === 'function') {
                showToast(data.message || 'Update failed', 'error');
            } else {
                showMessage(messageDiv, data.message || 'Update failed', 'error');
            }
        }
    } catch (error) {
        console.error('Update error:', error);
        if (typeof showToast === 'function') {
            showToast('An error occurred. Please try again.', 'error');
        } else {
            showMessage(messageDiv, 'An error occurred. Please try again.', 'error');
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Save Changes';
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageDiv = document.getElementById('password-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    if (newPassword !== confirmPassword) {
        showMessage(messageDiv, 'New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showMessage(messageDiv, 'Password must be at least 8 characters', 'error');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Changing...';

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/profile/change-password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            if (typeof showToast === 'function') {
                showToast('Password changed successfully!', 'success');
            } else {
                showMessage(messageDiv, 'Password changed successfully!', 'success');
            }
            e.target.reset();
            setTimeout(() => switchTab('overview'), 1500);
        } else {
            if (typeof showToast === 'function') {
                showToast(data.message || 'Password change failed', 'error');
            } else {
                showMessage(messageDiv, data.message || 'Password change failed', 'error');
            }
        }
    } catch (error) {
        console.error('Password change error:', error);
        if (typeof showToast === 'function') {
            showToast('An error occurred. Please try again.', 'error');
        } else {
            showMessage(messageDiv, 'An error occurred. Please try again.', 'error');
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Change Password';
    }
}

function showMessage(element, message, type) {
    element.style.display = 'block';
    element.textContent = message;
    element.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    element.style.color = type === 'success' ? '#155724' : '#721c24';
    element.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
}
