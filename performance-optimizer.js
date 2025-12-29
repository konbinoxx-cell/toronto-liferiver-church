// 性能优化脚本
class PerformanceOptimizer {
  constructor() {
    this.observedElements = new Set();
    this.init();
  }

  init() {
    console.log('🚀 性能优化器启动');
    this.setupIntersectionObserver();
    this.setupResourceScheduler();
    this.setupMemoryMonitor();
    this.optimizeAnimations();
  }

  // 交叉观察器 - 懒加载
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadDeferredContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    // 观察需要懒加载的元素
    document.querySelectorAll('[data-lazy]').forEach(el => {
      observer.observe(el);
    });
  }

  // 加载延迟内容
  loadDeferredContent(element) {
    const lazyType = element.dataset.lazy;
    
    switch(lazyType) {
      case 'image':
        const src = element.dataset.src;
        if (src) {
          element.src = src;
          element.classList.add('fade-in');
        }
        break;
      
      case 'component':
        this.loadComponent(element);
        break;
      
      case 'video':
        this.loadVideo(element);
        break;
    }
  }

  // 资源调度器
  setupResourceScheduler() {
    // 空闲时预加载关键资源
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadCriticalResources();
      });
    } else {
      setTimeout(() => this.preloadCriticalResources(), 1000);
    }
  }

  // 预加载关键资源
  preloadCriticalResources() {
    const criticalResources = [
      '/assets/images/hero-bg.jpg',
      '/assets/images/logo.png'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  // 内存监控
  setupMemoryMonitor() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const used = memory.usedJSHeapSize / 1048576;
        const limit = memory.jsHeapSizeLimit / 1048576;
        
        if (used > limit * 0.8) {
          console.warn('⚠️ 内存使用率过高:', used.toFixed(2), 'MB');
          this.cleanupMemory();
        }
      }, 30000);
    }
  }

  // 内存清理
  cleanupMemory() {
    // 清理未使用的观察器
    this.observedElements.clear();
    
    // 触发垃圾回收提示
    if (window.gc) {
      window.gc();
    }
  }

  // 动画优化
  optimizeAnimations() {
    // 使用will-change优化动画性能
    const animatedElements = document.querySelectorAll('.tech-card, .feature-card');
    
    animatedElements.forEach(el => {
      el.style.willChange = 'transform, opacity';
      
      // 动画结束后移除will-change
      el.addEventListener('animationend', () => {
        setTimeout(() => {
          el.style.willChange = 'auto';
        }, 1000);
      });
    });
  }

  // 图片优化
  optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      const placeholder = img.getAttribute('src');
      const actualSrc = img.getAttribute('data-src');
      
      // 创建模糊 placeholder
      if (placeholder && actualSrc) {
        const loader = new Image();
        loader.src = actualSrc;
        loader.onload = () => {
          img.src = actualSrc;
          img.classList.add('loaded');
        };
      }
    });
  }

  // 网络状态适配
  setupNetworkAwareLoading() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.saveData) {
        this.enableDataSaverMode();
      }
      
      connection.addEventListener('change', () => {
        this.adaptToNetwork(connection.effectiveType);
      });
    }
  }

  // 数据节省模式
  enableDataSaverMode() {
    console.log('📱 启用数据节省模式');
    // 禁用非关键动画
    document.body.classList.add('data-saver');
    
    // 降低图片质量
    const images = document.querySelectorAll('img[data-src-low]');
    images.forEach(img => {
      img.dataset.src = img.dataset.srcLow;
    });
  }

  // 网络适配
  adaptToNetwork(effectiveType) {
    switch(effectiveType) {
      case 'slow-2g':
      case '2g':
        this.enableDataSaverMode();
        break;
      case '3g':
        this.disableHeavyAnimations();
        break;
      case '4g':
        this.enableFullExperience();
        break;
    }
  }

  disableHeavyAnimations() {
    document.body.classList.add('reduced-motion');
  }

  enableFullExperience() {
    document.body.classList.remove('data-saver', 'reduced-motion');
  }

  // 错误边界
  setupErrorBoundary() {
    window.addEventListener('error', (e) => {
      this.handleError(e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      this.handleError(e.reason);
    });
  }

  handleError(error) {
    console.error('🚨 捕获错误:', error);
    
    // 发送错误报告到监控服务
    this.reportError(error);
    
    // 显示用户友好的错误信息
    this.showErrorUI();
  }

  reportError(error) {
    // 这里可以集成错误监控服务
    const errorData = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 错误报告:', errorData);
  }

  showErrorUI() {
    // 创建错误提示UI
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #e74c3c;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      max-width: 300px;
    `;
    errorDiv.innerHTML = `
      <p>⚠️ 暂时遇到技术问题</p>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; float: right;">×</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

// 初始化性能优化器
document.addEventListener('DOMContentLoaded', () => {
  window.performanceOptimizer = new PerformanceOptimizer();
});

// 导出用于其他模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}
