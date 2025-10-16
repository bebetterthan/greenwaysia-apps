document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
});

async function handleContactSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    try {
        const response = await fetch(window.location.origin + '/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            if (typeof showToast === 'function') {
                showToast('Message sent successfully! We will get back to you soon.', 'success');
            }
            document.getElementById('contact-form').reset();
        } else {
            if (typeof showToast === 'function') {
                showToast(data.message || 'Failed to send message. Please try again.', 'error');
            }
        }
    } catch (error) {
        console.error('Contact form error:', error);
        if (typeof showToast === 'function') {
            showToast('An error occurred. Please try again later.', 'error');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
