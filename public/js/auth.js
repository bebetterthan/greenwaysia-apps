document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    checkAuthStatus();
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = 'Loading...';

    try {
        const response = await api.auth.login({ email, password });

        if (response.success) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (typeof showToast === 'function') {
                showToast('Login successful! Redirecting...', 'success');
            } else {
                showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
            }

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            if (typeof showToast === 'function') {
                showToast(response.message || 'Login failed', 'error');
            } else {
                showMessage(messageDiv, response.message || 'Login failed', 'error');
            }
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        if (typeof showToast === 'function') {
            showToast('Invalid email or password', 'error');
        } else {
            showMessage(messageDiv, 'Invalid email or password', 'error');
        }
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password_confirmation = document.getElementById('password_confirmation').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const messageDiv = document.getElementById('register-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    if (password !== password_confirmation) {
        showMessage(messageDiv, 'Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage(messageDiv, 'Password must be at least 8 characters', 'error');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Loading...';

    try {
        const response = await api.auth.register({
            name,
            email,
            password,
            password_confirmation,
            phone,
            address
        });

        if (response.success) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (typeof showToast === 'function') {
                showToast('Registration successful! Redirecting...', 'success');
            } else {
                showMessage(messageDiv, 'Registration successful! Redirecting...', 'success');
            }

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            if (typeof showToast === 'function') {
                showToast(response.message || 'Registration failed', 'error');
            } else {
                showMessage(messageDiv, response.message || 'Registration failed', 'error');
            }
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        }
    } catch (error) {
        console.error('Registration error:', error);
        const errorMsg = error.message || 'Registration failed. Email may already be registered.';
        if (typeof showToast === 'function') {
            showToast(errorMsg, 'error');
        } else {
            showMessage(messageDiv, errorMsg, 'error');
        }
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
    }
}

function showMessage(element, message, type) {
    element.style.display = 'block';
    element.textContent = message;
    element.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    element.style.color = type === 'success' ? '#155724' : '#721c24';
    element.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const navActions = document.querySelector('.nav-actions');

    if (token && user) {
        const userData = JSON.parse(user);

        if (navActions) {
            const userMenuHTML = `
                <div class="user-menu">
                    <button class="user-menu-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px; display: inline; vertical-align: middle;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="user-name">${userData.name}</span>
                    </button>
                    <div class="user-dropdown">
                        <div class="user-info">
                            <p class="user-email">${userData.email}</p>
                        </div>
                        <a href="/profile" class="dropdown-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            My Profile
                        </a>
                        <a href="/saved-locations" class="dropdown-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                            </svg>
                            My Saved Locations
                        </a>
                        <button class="dropdown-item logout-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            `;

            const langSwitcher = navActions.querySelector('.language-switcher');
            const getStartedBtn = navActions.querySelector('.button-donate');

            if (getStartedBtn) {
                getStartedBtn.remove();
            }

            if (!navActions.querySelector('.user-menu')) {
                langSwitcher.insertAdjacentHTML('afterend', userMenuHTML);

                const userMenuToggle = navActions.querySelector('.user-menu-toggle');
                const userDropdown = navActions.querySelector('.user-dropdown');
                const logoutBtn = navActions.querySelector('.logout-btn');

                userMenuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userDropdown.classList.toggle('show');
                });

                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.user-menu')) {
                        userDropdown.classList.remove('show');
                    }
                });

                logoutBtn.addEventListener('click', () => {
                    logout();
                });
            }
        }
    }
}

async function logout() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            await fetch('http://127.0.0.1:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}
