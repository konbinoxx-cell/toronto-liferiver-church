class LanguageManager {
    constructor() {
        this.state = {
            currentLang: 'zh-TW',
            isTranslating: false
        };

        // Safe localStorage access
        try {
            const saved = localStorage.getItem('user_lang');
            if (saved) {
                this.state.currentLang = saved;
            } else {
                // Auto-detect browser language
                const browserLang = navigator.language.slice(0, 2);
                if (browserLang === 'en') this.state.currentLang = 'en';
                else if (browserLang === 'fr') this.state.currentLang = 'fr';
                else if (browserLang === 'zh') {
                    // Check for simplified vs traditional if possible, otherwise default to TW as per original
                    this.state.currentLang = navigator.language === 'zh-CN' ? 'zh-CN' : 'zh-TW';
                }
            }
        } catch (e) {
            console.warn('LocalStorage access denied', e);
        }

        // Default fallbacks if config is missing
        this.defaultLang = (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_LANG) ? CONFIG.DEFAULT_LANG : 'zh-TW';

        this.init();
    }

    init() {
        // Ensure DOM is ready before rendering
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        this.renderLanguageSelector();

        // If current lang != default, translate
        if (this.state.currentLang !== this.defaultLang) {
            this.translatePage(this.state.currentLang);
        }
    }

    renderLanguageSelector() {
        // Remove existing if any
        const existing = document.querySelector('.language-selector-widget');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'language-selector-widget';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 8px 12px;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 2147483647; /* Max z-index */
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            border: 1px solid rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        `;

        // Icon
        const icon = document.createElement('span');
        icon.textContent = '🌐';
        icon.style.fontSize = '1.2rem';
        container.appendChild(icon);

        const select = document.createElement('select');
        select.style.cssText = `
            border: none;
            background: transparent;
            font-size: 0.9rem;
            color: #333;
            font-weight: 500;
            outline: none;
            cursor: pointer;
            padding-right: 5px;
        `;

        // Ensure LANGUAGES is available
        const langs = (typeof LANGUAGES !== 'undefined') ? LANGUAGES : {
            'zh-TW': { name: '繁體中文', flag: '🇹🇼' },
            'zh-CN': { name: '简体中文', flag: '🇨🇳' },
            'en': { name: 'English', flag: '🇺🇸' },
            'fr': { name: 'Français', flag: '🇫🇷' }
        };

        for (const [code, info] of Object.entries(langs)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${info.flag} ${info.name}`;
            if (code === this.state.currentLang) option.selected = true;
            select.appendChild(option);
        }

        select.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        container.appendChild(select);
        document.body.appendChild(container);
    }

    async setLanguage(lang) {
        if (lang === this.state.currentLang || this.state.isTranslating) return;

        try {
            localStorage.setItem('user_lang', lang);
        } catch (e) { }

        this.state.currentLang = lang;

        if (lang === this.defaultLang) {
            location.reload();
        } else {
            await this.translatePage(lang);
        }
    }

    async translatePage(targetLang) {
        this.state.isTranslating = true;
        const status = document.createElement('div');
        status.textContent = 'Translating / 正在翻譯...';
        status.style.cssText = `
            position: fixed; 
            top: 70px; 
            right: 20px; 
            padding: 8px 12px; 
            background: rgba(0,0,0,0.8); 
            color: #fff; 
            border-radius: 20px; 
            font-size: 12px; 
            z-index: 2147483647;
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(status);

        try {
            const textNodes = [];

            // Helper to collect text nodes
            const collectText = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue.trim();
                    if (text && text.length > 1) { // Skip single chars or empty
                        textNodes.push(node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = node.tagName;
                    if (tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'NOSCRIPT' && tag !== 'svg') {
                        // Don't traverse into the selector widget itself
                        if (!node.classList.contains('language-selector-widget')) {
                            for (let child of node.childNodes) {
                                collectText(child);
                            }
                        }
                    }
                }
            };

            collectText(document.body);

            // Fetch config or default
            const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'https://libretranslate.de/translate';
            const apiKey = (typeof CONFIG !== 'undefined' && CONFIG.API_KEY) ? CONFIG.API_KEY : '';

            // Batch translate
            const BATCH_SIZE = 20;
            const chunks = [];
            for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
                chunks.push(textNodes.slice(i, i + BATCH_SIZE));
            }

            for (const chunk of chunks) {
                const q = chunk.map(n => n.nodeValue);

                try {
                    const res = await fetch(apiUrl, {
                        method: 'POST',
                        body: JSON.stringify({
                            q: q,
                            source: "auto", // Auto-detect source
                            target: targetLang,
                            format: "text",
                            api_key: apiKey
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!res.ok) throw new Error(`API Error: ${res.status}`);

                    const data = await res.json();

                    // Handle response formats (some instances return {translatedText: [...]}, others array)
                    // The official LibreTranslate /translate handles single string or batch.
                    // If batch, it returns { translatedText: ["...","..."] }

                    let validResults = [];
                    if (data.translatedText && Array.isArray(data.translatedText)) {
                        validResults = data.translatedText;
                    } else if (Array.isArray(data)) {
                        validResults = data; // Some forks might do this
                    } else if (data.translatedText) {
                        // Single result for single query (shouldn't happen with batch request but handle anyway)
                        validResults = [data.translatedText];
                    }

                    chunk.forEach((node, i) => {
                        if (validResults[i]) {
                            node.nodeValue = validResults[i];
                        }
                    });

                } catch (err) {
                    console.error('Batch translation failed', err);
                    // Continue to next chunk even if one fails
                }
            }

            status.textContent = '✓ Done';
            status.style.background = 'rgba(46, 204, 113, 0.9)';
            setTimeout(() => status.remove(), 2000);

        } catch (e) {
            console.error('Translation process error', e);
            status.textContent = 'Translation Failed';
            status.style.background = 'rgba(231, 76, 60, 0.9)';
            setTimeout(() => status.remove(), 3000);
        } finally {
            this.state.isTranslating = false;
        }
    }
}

// Global instance
window.languageManager = new LanguageManager();
