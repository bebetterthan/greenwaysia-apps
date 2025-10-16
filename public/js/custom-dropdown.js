document.addEventListener('DOMContentLoaded', () => {
    const customDropdown = document.querySelector('.custom-dropdown.language-switcher-mobile');

    if (customDropdown) {
        const trigger = customDropdown.querySelector('.dropdown-trigger');
        const options = customDropdown.querySelectorAll('.dropdown-option');
        const selectedLangSpan = customDropdown.querySelector('.selected-lang');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customDropdown.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                const selectedValue = option.getAttribute('data-value');
                selectedLangSpan.textContent = option.textContent;
                setLanguage(selectedValue); // This function is from language.js
                customDropdown.classList.remove('active');
            });
        });

        // Close dropdown if clicked outside
        window.addEventListener('click', () => {
            if (customDropdown.classList.contains('active')) {
                customDropdown.classList.remove('active');
            }
        });
    }
});
