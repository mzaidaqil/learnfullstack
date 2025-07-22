var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
var MicroModal = require("micromodal");

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

let currentTimezone = dayjs.tz.guess(); // Get user's current timezone

function updateTime() {
    const now = dayjs().tz(currentTimezone);
    const timeElement = document.getElementById('current-time');
    const timezoneElement = document.getElementById('current-timezone');
    
    if (timeElement) {
        timeElement.textContent = now.format('MMMM D, YYYY h:mm:ss A');
    }
    
    if (timezoneElement) {
        timezoneElement.textContent = currentTimezone;
    }
}

function initializeApp() {
    // Initialize MicroModal
    MicroModal.init({
        onShow: modal => console.info(`${modal.id} is shown`),
        onClose: modal => console.info(`${modal.id} is hidden`),
        openTrigger: 'data-custom-open',
        closeTrigger: 'data-custom-close',
        disableScroll: true,
        disableFocus: false,
        awaitCloseAnimation: false,
        debugMode: true
    });
    
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Add event listener for timezone selection
    const timezoneSelect = document.getElementById('timezone-select');
    const applyButton = document.getElementById('apply-timezone');
    
    if (timezoneSelect && applyButton) {
        applyButton.addEventListener('click', () => {
            currentTimezone = timezoneSelect.value;
            updateTime();
            MicroModal.close('modal-1');
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

