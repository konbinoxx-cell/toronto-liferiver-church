// 新建文件：language-manager.js
class LanguageManager {
  constructor() {
    this.currentLang = (window.CONFIG && CONFIG.DEFAULT_LANG) ? CONFIG.DEFAULT_LANG : 'zh-Hant';
    this.init();
  }
  
  init() {
    // 从 localStorage 获取保存的语言设置
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) {
      this.currentLang = savedLang;
    }
    this.bindEvents();

    // Update trigger label and active option based on currentLang
    const langTrigger = document.getElementById('langTrigger');
    const langTextMap = {
      'zh-Hans': '简体',
      'zh-Hant': '繁體',
      'en': 'EN'
    };
    if (langTrigger) {
      const span = langTrigger.querySelector('span');
      if (span) span.textContent = langTextMap[this.currentLang] || this.currentLang;
    }
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === this.currentLang);
    });

    this.applyLanguage();
  }
  
  bindEvents() {
    // 语言选择器点击事件
    const langTrigger = document.getElementById('langTrigger');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langTrigger) {
      langTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
      });
      
      // 点击语言选项
      document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = option.dataset.lang;
          // If user chooses English, show disclaimer + translator choice modal
          if (lang === 'en') {
            this.showTranslatorModal();
            return;
          }

          this.setLanguage(lang);
          langDropdown.classList.remove('show');

          // 更新选中状态
          document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
          option.classList.add('active');

          // 更新按钮文字
          const langText = {
            'zh-Hans': '简体',
            'zh-Hant': '繁體',
            'en': 'EN'
          }[lang];
          const span = langTrigger.querySelector('span');
          if (span) span.textContent = langText || lang;
        });
      });
      
      // 点击外部关闭下拉菜单
      document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
      });
    }
  }

  showTranslatorModal() {
    // Avoid duplicate modal
    if (document.getElementById('translator-disclaimer-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'translator-disclaimer-modal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.4)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    const box = document.createElement('div');
    box.style.width = '420px';
    box.style.background = '#fff';
    box.style.borderRadius = '8px';
    box.style.padding = '20px';
    box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    box.style.fontFamily = 'sans-serif';

    box.innerHTML = `
      <h3 style="margin-top:0">外部翻译提示 / External Translation Notice</h3>
      <p style="color:#333;line-height:1.4">您即将使用外部机器翻译工具将本站页面翻译成英文。由于自动翻译可能出现歧义或错误，本网站对译文不承担责任。<strong>继续即表示您已知晓并同意。</strong></p>
      <p style="color:#666;font-size:0.95rem;margin-top:8px">You are about to use an external machine translation service. Translations may be inaccurate; the site is not responsible for interpretation errors.</p>
      <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
        <label style="flex:1">选择翻译器 / Choose translator:</label>
        <select id="translator-choice" style="flex:1;padding:6px">
          <option value="google">Google Translate (recommended)</option>
          <option value="bing">Bing Translator</option>
          <option value="deepl">DeepL</option>
        </select>
      </div>
      <div style="margin-top:18px;text-align:right">
        <button id="translator-cancel" style="margin-right:8px;padding:8px 12px;border-radius:6px;border:1px solid #ccc;background:#fff">取消 / Cancel</button>
        <button id="translator-go" style="padding:8px 12px;border-radius:6px;border:0;background:#007bff;color:#fff">继续 / Continue</button>
      </div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Event handlers
    modal.querySelector('#translator-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('#translator-go').addEventListener('click', async () => {
      const choice = modal.querySelector('#translator-choice').value;
      const pageUrl = location.href;
      // For Google we can open with the URL parameter
      if (choice === 'google') {
        const translateUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(pageUrl)}`;
        window.open(translateUrl, '_blank');
      } else if (choice === 'bing') {
        // Bing does not accept page URL directly reliably; open Bing Translator and copy URL to clipboard
        try { await navigator.clipboard.writeText(pageUrl); } catch (e) { /* ignore */ }
        window.open('https://www.bing.com/translator', '_blank');
        alert('页面链接已复制到剪贴板，请在 Bing 翻译粘贴链接后翻译。');
      } else if (choice === 'deepl') {
        try { await navigator.clipboard.writeText(pageUrl); } catch (e) { /* ignore */ }
        window.open('https://www.deepl.com/translator', '_blank');
        alert('页面链接已复制到剪贴板，请在 DeepL 翻译粘贴链接或将文本粘贴后翻译。');
      }
      modal.remove();
    });
  }
  
  setLanguage(lang) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      localStorage.setItem('preferredLang', lang);
      // Only support zh-Hant / zh-Hans internally; English opens external translator in the selector
      this.applyLanguage();
      
      // 触发自定义事件，让其他组件知道语言已更改
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { lang }
      }));
    }
  }
  
  applyLanguage() {
    // Apply translations for any element with `data-i18n`
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations && translations[key] && translations[key][this.currentLang]) {
        el.textContent = translations[key][this.currentLang];
      }
    });
    
    // 处理简繁自动转换
    if (this.currentLang === 'zh-Hans') {
      this.convertTraditionalToSimple();
    } else if (this.currentLang === 'zh-Hant') {
      this.convertSimpleToTraditional();
    }
  }

  // Translate visible text nodes via LibreTranslate for en/fr
  async translatePageRemote(targetLang) {
    if (!window.CONFIG || !CONFIG.API_URL) return;
    const langTrigger = document.getElementById('langTrigger');
    if (langTrigger) langTrigger.querySelector('span').textContent = '...';

    // Gather text nodes that are not handled by data-i18n and are user-visible
    const elements = Array.from(document.querySelectorAll('body *'))
      .filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === 3)
      .filter(el => !el.closest('script') && !el.closest('style'))
      .filter(el => !el.hasAttribute('data-i18n'))
      .map(el => ({ el, text: el.textContent.trim() }))
      .filter(o => o.text && o.text.length > 1);

    // Batch translate in groups to limit payload
    const batchSize = 12;
    for (let i = 0; i < elements.length; i += batchSize) {
      const batch = elements.slice(i, i + batchSize);
      const texts = batch.map(b => b.text);
      try {
        // First try sending an array of texts (some instances accept arrays)
        let res = await fetch(CONFIG.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: texts, source: 'auto', target: targetLang, format: 'text', api_key: CONFIG.API_KEY })
        });
        let data = await res.json();

        // If response doesn't look like translations, try fallback: send joined text and split
        const looksLikeTranslations = (d) => Array.isArray(d) || (d && (Array.isArray(d.translations) || d.translatedText));
        if (!looksLikeTranslations(data)) {
          // Fallback: send joined text and split by a sentinel
          const sep = '\n\n---SPLIT---\n\n';
          res = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: texts.join(sep), source: 'auto', target: targetLang, format: 'text', api_key: CONFIG.API_KEY })
          });
          data = await res.json();
          if (data && data.translatedText) {
            const parts = data.translatedText.split(sep);
            parts.forEach((p, idx) => { if (batch[idx]) batch[idx].el.textContent = p; });
            continue;
          }
        }

        // Handle various response shapes
        if (Array.isArray(data)) {
          data.forEach((t, idx) => {
            batch[idx].el.textContent = t.translatedText || t;
          });
        } else if (Array.isArray(data.translations)) {
          data.translations.forEach((t, idx) => batch[idx].el.textContent = t.translatedText || t);
        } else if (data.translatedText && typeof data.translatedText === 'string') {
          // If the API returned a single translatedText for joined input, try to split by newline as best-effort
          const parts = data.translatedText.split('\n');
          parts.forEach((p, idx) => { if (batch[idx]) batch[idx].el.textContent = p; });
        } else {
          console.warn('Unexpected LibreTranslate response:', data);
        }
      } catch (err) {
        console.error('LibreTranslate error', err);
        // show brief error state on trigger
        if (langTrigger) langTrigger.querySelector('span').textContent = 'ERR';
      }
    }

    if (langTrigger) {
      const label = targetLang === 'en' ? 'EN' : (targetLang === 'fr' ? 'FR' : targetLang);
      langTrigger.querySelector('span').textContent = label;
    }
  }
  
  convertTraditionalToSimple() {
    // 转换繁体到简体 (异步尝试使用 opencc-js)
    document.querySelectorAll('body *').forEach(element => {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent;
        // use async converter when available, fallback to sync
        if (OpenCC && typeof OpenCC.convertAsync === 'function') {
          OpenCC.convertAsync(text, 't2s').then(converted => {
            if (converted && converted !== text) element.textContent = converted;
          }).catch(() => {
            try { const converted = OpenCC.convert(text, 't2s'); if (converted !== text) element.textContent = converted; } catch (e) {}
          });
        } else {
          try { const converted = OpenCC.convert(text, 't2s'); if (converted !== text) element.textContent = converted; } catch (e) {}
        }
      }
    });
  }
  
  convertSimpleToTraditional() {
    // 转换简体到繁体 (异步尝试使用 opencc-js)
    document.querySelectorAll('body *').forEach(element => {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent;
        if (OpenCC && typeof OpenCC.convertAsync === 'function') {
          OpenCC.convertAsync(text, 's2t').then(converted => {
            if (converted && converted !== text) element.textContent = converted;
          }).catch(() => {
            try { const converted = OpenCC.convert(text, 's2t'); if (converted !== text) element.textContent = converted; } catch (e) {}
          });
        } else {
          try { const converted = OpenCC.convert(text, 's2t'); if (converted !== text) element.textContent = converted; } catch (e) {}
        }
      }
    });
  }
  
  translate(key) {
    return translations[key]?.[this.currentLang] || key;
  }
}

// 全局实例
window.languageManager = new LanguageManager();