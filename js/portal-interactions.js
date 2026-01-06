/**
 * Portal Interactions Module
 * Handles the interactive features for the future sanctuary portal
 */

class PortalInteractions {
    constructor() {
        this.SPEED_THRESHOLD = 250; // Stricter: 250ms instead of 350ms
        this.init();
    }

    init() {
        this.setupPortalSpeedTest();
        this.setupLogoLongPress();
    }

    /**
     * Sets up the speed test for portal access via title clicks
     */
    setupPortalSpeedTest() {
        const portalTitle = document.getElementById('portal-title');
        const speedFeedback = document.getElementById('speed-feedback');
        let lastClick = 0;

        if (!portalTitle || !speedFeedback) {
            console.warn('Portal elements not found. Skipping portal speed test setup.');
            return;
        }

        portalTitle.addEventListener('click', (e) => {
            const now = new Date().getTime();
            const timespan = now - lastClick;

            if (timespan > 0 && timespan < 2000) { // Only show feedback if clicks are within 2 seconds
                // Display the speed
                speedFeedback.textContent = `${timespan}ms`;
                speedFeedback.style.opacity = '1';

                // Check if fast enough
                if (timespan < this.SPEED_THRESHOLD) {
                    // SUCCESS: Green text and enter portal
                    speedFeedback.style.color = '#00ff88';
                    speedFeedback.style.textShadow = '0 0 10px rgba(0, 255, 136, 0.8)';

                    // Entry animation
                    portalTitle.style.transform = 'scale(1.1)';
                    portalTitle.style.textShadow = '0 0 30px rgba(0, 255, 136, 1)';

                    setTimeout(() => {
                        window.location.href = 'future.html';
                    }, 500);
                } else {
                    // FAIL: Red text
                    speedFeedback.style.color = '#ff4444';
                    speedFeedback.style.textShadow = '0 0 10px rgba(255, 68, 68, 0.8)';

                    // Shake animation for failure
                    portalTitle.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        portalTitle.style.animation = '';
                    }, 500);
                }

                // Hide feedback after 2 seconds
                setTimeout(() => {
                    speedFeedback.style.opacity = '0';
                    portalTitle.style.transform = '';
                }, 2000);
            }

            lastClick = now;
        });
    }

    /**
     * Sets up the long press interaction on the logo for portal access
     */
    setupLogoLongPress() {
        let logoTimer;
        const logo = document.querySelector('.logo');

        if (!logo) {
            console.warn('Logo element not found. Skipping logo long press setup.');
            return;
        }

        // Mouse events for desktop
        logo.addEventListener('mousedown', () => {
            logoTimer = setTimeout(() => {
                window.location.href = 'future.html';
            }, 3000); // 3 seconds long press
        });

        logo.addEventListener('mouseup', () => clearTimeout(logoTimer));
        logo.addEventListener('mouseleave', () => clearTimeout(logoTimer));

        // Touch events for mobile
        logo.addEventListener('touchstart', () => {
            logoTimer = setTimeout(() => {
                window.location.href = 'future.html';
            }, 3000);
        });

        logo.addEventListener('touchend', () => clearTimeout(logoTimer));
        logo.addEventListener('touchcancel', () => clearTimeout(logoTimer));
    }
}

// Initialize the portal interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortalInteractions();
});