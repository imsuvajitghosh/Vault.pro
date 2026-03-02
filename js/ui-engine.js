/**
 * PRO-VAULT UI & NOTIFICATION ENGINE v2026
 * Features: Hardware-accelerated Toasts, Biometric Feedback, 
 * Mobile-style Micro-interactions.
 */

const UI = {
    /**
     * Professional Toast Notification System
     * @param {string} msg - The message to display
     * @param {string} type - 'success', 'error', or 'info'
     */
    toast(msg, type = 'success') {
        const stack = document.getElementById('alert-stack');
        if (!stack) return;

        const id = 'toast-' + Math.random().toString(36).substr(2, 9);
        
        // Define theme colors based on the main.css variables
        const themes = {
            success: 'border-green-500/50 bg-green-500/10 text-green-400',
            error: 'border-red-500/50 bg-red-500/10 text-red-400',
            info: 'border-blue-500/50 bg-blue-500/10 text-blue-400'
        };

        const toastHtml = `
            <div id="${id}" class="flex items-center p-4 border rounded-2xl backdrop-blur-md animate__animated animate__slideInRight ${themes[type]} min-w-[300px] shadow-2xl shadow-black/50">
                <div class="mr-3 text-lg">
                    ${type === 'success' ? '✅' : type === 'error' ? '🚫' : 'ℹ️'}
                </div>
                <div class="flex-1 font-semibold text-sm tracking-wide">
                    ${msg}
                </div>
                <button onclick="UI.removeToast('${id}')" class="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        stack.insertAdjacentHTML('beforeend', toastHtml);

        // Auto-remove logic with "Slide Out" animation
        setTimeout(() => {
            this.removeToast(id);
        }, 4500);
    },

    /**
     * Removes a toast with a smooth slide-out animation
     * @param {string} id - The element ID to remove
     */
    removeToast(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.replace('animate__slideInRight', 'animate__slideOutRight');
            setTimeout(() => {
                if (el.parentNode) el.remove();
            }, 500);
        }
    },

    /**
     * Updates the 8-digit PIN display dots with glow effects
     * @param {number} length - Current buffer length
     */
    updatePinDots(length) {
        const dots = document.querySelectorAll('.pin-dot');
        dots.forEach((dot, i) => {
            if (i < length) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    },

    /**
     * Professional Screen Shake Effect for Errors
     * @param {string} selector - CSS selector of the element to shake
     */
    shake(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('animate__animated', 'animate__headShake');
            setTimeout(() => {
                el.classList.remove('animate__animated', 'animate__headShake');
            }, 1000);
        }
    },

    /**
     * Dynamic Navigation Path Tracker (Breadcrumbs)
     * @param {Array} paths - Array of path segments
     */
    updateBreadcrumbs(paths) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        breadcrumb.innerHTML = paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const style = isLast ? 'text-blue-500 font-black' : 'text-slate-500 hover:text-white cursor-pointer';
            const action = isLast ? '' : `onclick="VaultCore.Explorer.navigateBack(${index})"`;
            
            return `<span class="${style}" ${action}>${path.toUpperCase()}</span>`;
        }).join('<span class="mx-2 opacity-30">/</span>');
    }
};