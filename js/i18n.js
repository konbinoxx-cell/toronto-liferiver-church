// js/i18n.js — 轻量级国际化引擎 (48 lines)
// 支持 data-i18n="key" 自动翻译 | 自动检测浏览器语言 | 支持手动切换

class I18N {
    constructor() {
        this.translations = {};
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        const navLang = (navigator.language || navigator.userLanguage).toLowerCase();
        return navLang.startsWith('zh-hant') || navLang.includes('hk') || navLang.includes('tw') 
            ? 'zh-Hant' 
            : 'zh-Hans';
    }

    async load(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations[lang] = await response.json();
            this.currentLang = lang;
            this.applyTranslations();
        } catch (e) {
            console.warn(`[I18N] Fallback to zh-Hans`, e);
            if (lang !== 'zh-Hans') await this.load('zh-Hans');
        }
    }

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.get(key);
            if (text) {
                // 保留原有HTML结构（如 <br>），仅替换文本节点
                if (el.children.length === 0) {
                    el.textContent = text;
                } else {
                    // 若含子元素，替换第一个文本节点（安全处理）
                    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                    const firstText = walker.nextNode();
                    if (firstText) firstText.nodeValue = text;
                }
            }
        });
    }

    get(key, lang = this.currentLang) {
        return this.translations[lang]?.[key] || key;
    }

    // 可选：暴露切换接口（供未来按钮调用）
    switchLang(lang) {
        localStorage.setItem('preferred-lang', lang);
        return this.load(lang);
    }
}

// 自动初始化
const i18n = new I18N();
document.addEventListener('DOMContentLoaded', () => {
    const preferred = localStorage.getItem('preferred-lang');
    i18n.load(preferred || i18n.currentLang);
});

// 全局暴露，方便调试
window.i18n = i18n;