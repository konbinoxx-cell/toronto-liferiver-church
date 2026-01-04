// 新建文件：language-manager.js
class LanguageManager {
  constructor() {
    this.currentLang = 'zh-Hant'; // 默认繁体
    this.init();
  }
  
  init() {
    // 从 localStorage 获取保存的语言设置
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) {
      this.currentLang = savedLang;
    }
    
    this.bindEvents();
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
          const lang = e.target.dataset.lang;
          this.setLanguage(lang);
          langDropdown.classList.remove('show');
          
          // 更新选中状态
          document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.remove('active');
          });
          e.target.classList.add('active');
          
          // 更新按钮文字
          const langText = {
            'zh-Hans': '简体',
            'zh-Hant': '繁體',
            'en': 'EN',
            'fr': 'FR'
          }[lang];
          langTrigger.querySelector('span').textContent = langText;
        });
      });
      
      // 点击外部关闭下拉菜单
      document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
      });
    }
  }
  
  setLanguage(lang) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      localStorage.setItem('preferredLang', lang);
      // For en/fr use remote translation; for zh-Hans/zh-Hant use local conversions
      if (lang === 'en' || lang === 'fr') {
        // Apply known translations first (data-i18n)
        this.applyLanguage();
        this.translatePageRemote(lang).catch(err => console.error('Translate error', err));
      } else {
        this.applyLanguage();
      }
      
      // 触发自定义事件，让其他组件知道语言已更改
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { lang }
      }));
    }
  }
  
  applyLanguage() {
    // 应用已定义的翻译
    Object.keys(translations || {}).forEach(key => {
      const element = document.querySelector(`[data-i18n="${key}"]`);
      if (element && translations[key][this.currentLang]) {
        element.textContent = translations[key][this.currentLang];
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
    // 转换繁体到简体
    document.querySelectorAll('body *').forEach(element => {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent;
        const converted = OpenCC.convert(text, 't2s');
        if (text !== converted) {
          element.textContent = converted;
        }
      }
    });
  }
  
  convertSimpleToTraditional() {
    // 转换简体到繁体
    document.querySelectorAll('body *').forEach(element => {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent;
        const converted = OpenCC.convert(text, 's2t');
        if (text !== converted) {
          element.textContent = converted;
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