// Enhanced convert.js: try to use opencc-js from CDN when available, provide async convert
const OpenCC = (function() {
  // Small char-level fallback mapping (kept for environments without opencc-js)
  const fallback = {
    s2t: {
      '义': '義','见': '見','爱': '愛','乐': '樂','欢': '歡','庆': '慶','祷': '禱','经': '經','训': '訓','话': '話','说': '說','讲': '講','识': '識','让': '讓','认': '認','这': '這','个': '個','们': '們','为': '為','时': '時','会': '會','来': '來','过': '過','发': '發','与': '與'
    },
    t2s: {
      '義': '义','見': '见','愛': '爱','樂': '乐','歡': '欢','慶': '庆','禱': '祷','經': '经','訓': '训','話': '话','說': '说','講': '讲','識': '识','讓': '让','認': '认','這': '这','個': '个','們': '们','為': '为','時': '时','會': '会','來': '来','過': '过','發': '发','與': '与'
    }
  };

  // Load opencc-js UMD from CDN (unpkg) once and cache the promise
  let loadPromise = null;
  function loadOpenCCFromCDN() {
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve) => {
      try {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/opencc-js@1.0.5/dist/opencc.min.js';
        script.onload = () => { resolve(true); };
        script.onerror = () => { resolve(false); };
        document.head.appendChild(script);
      } catch (e) { resolve(false); }
    });
    return loadPromise;
  }

  // Synchronous fallback convert (char-mapping)
  function convertSync(text, mode) {
    if (!text) return text;
    const map = mode === 's2t' ? fallback.s2t : (mode === 't2s' ? fallback.t2s : null);
    if (!map) return text;
    return text.split('').map(ch => map[ch] || ch).join('');
  }

  // Async convert: prefer opencc-js if available, else attempt to load it; fallback to sync mapping
  async function convertAsync(text, mode) {
    if (!text) return text;
    // If an OpenCC global exists and has a convert function, try to use it
    if (window.OpenCC && typeof window.OpenCC.convert === 'function') {
      try { return window.OpenCC.convert(text, mode); } catch (e) { /* fallthrough */ }
    }

    // Try to load library from CDN
    const ok = await loadOpenCCFromCDN();
    if (ok && window.OpenCC && typeof window.OpenCC.convert === 'function') {
      try { return window.OpenCC.convert(text, mode); } catch (e) { /* fallthrough */ }
    }

    // Last resort: use char-map fallback
    return convertSync(text, mode);
  }

  return {
    // Backwards-compatible sync convert: uses fallback mapping or library if already present
    convert: function(text, mode) {
      if (window.OpenCC && typeof window.OpenCC.convert === 'function') {
        try { return window.OpenCC.convert(text, mode); } catch (e) { return convertSync(text, mode); }
      }
      return convertSync(text, mode);
    },
    // Async converter that loads the full library when possible
    convertAsync
  };
})();