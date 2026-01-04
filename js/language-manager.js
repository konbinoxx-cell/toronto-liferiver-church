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
      this.applyLanguage();
      
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