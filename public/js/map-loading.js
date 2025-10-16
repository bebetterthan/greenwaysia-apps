
const loadingText = document.getElementById('loading-text');
const loadingMessages = {
    en: ["loading data", "almost finished", "loading map"],
    id: ["memuat data", "hampir selesai", "memuat map"]
};

let messageIndex = 0;
let intervalId;

function updateLoadingText() {
    const messages = loadingMessages[currentLang];
    if (loadingText) {
        loadingText.textContent = messages[messageIndex];
    }
    messageIndex = (messageIndex + 1) % messages.length;
}

function startLoadingMessages() {
    messageIndex = 0;
    if (loadingText) {
        updateLoadingText();
        intervalId = setInterval(updateLoadingText, 1500);
    }
}

function stopLoadingMessages() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    if (loadingText) {
        loadingText.textContent = '';
    }
}

// Override the setLanguage function to also handle loading text
const originalSetLanguage = setLanguage;
setLanguage = function(lang) {
    originalSetLanguage(lang);
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay && loadingOverlay.style.display === 'flex') {
        stopLoadingMessages();
        startLoadingMessages();
    }
}
