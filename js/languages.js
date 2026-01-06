// 新建文件：languages.js (cleaned — only zh-Hans / zh-Hant supported)
const translations = {
  // 导航栏
  'nav.home': { 'zh-Hans': '首页', 'zh-Hant': '首頁' },
  'nav.about': { 'zh-Hans': '关于我们', 'zh-Hant': '關於我們' },
  'nav.worship': { 'zh-Hans': '崇拜聚会', 'zh-Hant': '崇拜聚會' },
  'nav.equipping': { 'zh-Hans': '装备训练', 'zh-Hant': '裝備訓練' },
  'nav.groups': { 'zh-Hans': '团契小组', 'zh-Hant': '團契小組' },
  'nav.mission': { 'zh-Hans': '事工与宣教', 'zh-Hant': '事工與宣教' },
  'nav.contact': { 'zh-Hans': '联络我们', 'zh-Hant': '聯絡我們' },

  // 首页卡片标题
  'card.worship': { 'zh-Hans': '崇拜聚会', 'zh-Hant': '崇拜聚會' },
  'card.community': { 'zh-Hans': '信仰家庭', 'zh-Hant': '信仰家庭' },
  'card.equip': { 'zh-Hans': '装备门徒', 'zh-Hant': '裝備門徒' },
  'card.mission': { 'zh-Hans': '扩展宣教', 'zh-Hant': '擴展宣教' },
  'card.future': { 'zh-Hans': '未来圣所', 'zh-Hant': '未來聖所' },

  // 通用
  'button.more': { 'zh-Hans': '了解更多', 'zh-Hant': '了解更多' },
  'footer.copyright': { 'zh-Hans': '© 2024 多伦多生命河灵粮堂 版权所有', 'zh-Hant': '© 2024 多倫多生命河靈糧堂 版權所有' }
};

// Extra keys for pages (home, giving, prayer, about, contact, works)
Object.assign(translations, {
  'home.welcome': { 'zh-Hans': '欢迎来到我们的属灵家园', 'zh-Hant': '歡迎來到我們的屬靈家園' },
  'home.subtitle': { 'zh-Hans': '以基督为中心，在爱中彼此建立', 'zh-Hant': '以基督為中心，在愛中彼此建立' },
  'button.join': { 'zh-Hans': '参加主日崇拜', 'zh-Hant': '參加主日崇拜' },
  'about.title': { 'zh-Hans': '关于我们', 'zh-Hant': '關於我們' },
  'contact.title': { 'zh-Hans': '联系我们', 'zh-Hant': '聯繫我們' },
  'prayer.generate_title': { 'zh-Hans': '祷告生成器', 'zh-Hant': '祈禱生成器' },
  'prayer.instructions': { 'zh-Hans': '输入简短的请求，我们会帮您形成祷告。', 'zh-Hant': '輸入簡短的請求，我們會幫您形成禱告。' },
  'giving.title': { 'zh-Hans': '奉献支持', 'zh-Hant': '奉獻支持' },
  'giving.description': { 'zh-Hans': '支持教会的事工与宣教。', 'zh-Hant': '支持教會的事工與宣教。' },
  'giving.methods.title': { 'zh-Hans': '奉献方式', 'zh-Hant': '奉獻方式' },
  'method.check.title': { 'zh-Hans': '支票奉献', 'zh-Hant': '支票奉獻' },
  'method.etransfer.title': { 'zh-Hans': '电子转账', 'zh-Hant': '電子轉賬' },
  'method.online.title': { 'zh-Hans': '在线奉献', 'zh-Hant': '在線奉獻' },
  'purpose.1.title': { 'zh-Hans': '福音传播', 'zh-Hant': '福音傳播' },
  'purpose.2.title': { 'zh-Hans': '社区服务', 'zh-Hant': '社區服務' },
  'purpose.3.title': { 'zh-Hans': '教会运营', 'zh-Hant': '教會運營' },
  'purpose.4.title': { 'zh-Hans': '门徒训练', 'zh-Hant': '門徒訓練' }
});

// Additional giving/prayer-specific strings
Object.assign(translations, {
  'scripture.text': { 'zh-Hans': '各人要随本心所酌定的，不要作难，不要勉强，因為捐得乐意的人是神所喜爱。', 'zh-Hant': '各人要隨本心所酌定的，不要作難，不要勉強，因為捐得樂意的人是神所喜愛。' },
  'scripture.ref': { 'zh-Hans': '哥林多后书 9:7', 'zh-Hant': '哥林多後書 9:7' },
  'method.check.desc': { 'zh-Hans': '请将支票邮寄至教会地址，抬头请写：', 'zh-Hant': '請將支票郵寄至教會地址，抬頭請寫：' },
  'method.check.payee': { 'zh-Hans': 'Toronto River of Life Christian Church', 'zh-Hant': 'Toronto River of Life Christian Church' },
  'btn.get_address': { 'zh-Hans': '获取邮寄地址', 'zh-Hant': '獲取郵寄地址' },
  'method.etransfer.desc': { 'zh-Hans': '通过 Interac e-Transfer 进行奉献，方便快捷', 'zh-Hant': '通過 Interac e-Transfer 進行奉獻，方便快捷' },
  'method.etransfer.email': { 'zh-Hans': '收款邮箱: giving@trolcc.ca', 'zh-Hant': '收款郵箱: giving@trolcc.ca' },
  'btn.etransfer.help': { 'zh-Hans': '使用帮助', 'zh-Hant': '使用幫助' },
  'btn.online.giving': { 'zh-Hans': '前往奉献平台', 'zh-Hant': '前往奉獻平台' },
  'purpose.title': { 'zh-Hans': '奉献用途', 'zh-Hant': '奉獻用途' },
  'purpose.desc': { 'zh-Hans': '您的奉献支持以下事工的发展', 'zh-Hant': '您的奉獻支持以下事工的發展' },
  'transparency.title': { 'zh-Hans': '财务透明', 'zh-Hant': '財務透明' },
  'transparency.desc': { 'zh-Hans': '我们承诺对奉献款项进行透明管理', 'zh-Hant': '我們承諾對奉獻款項進行透明管理' },
  'btn.financial_report': { 'zh-Hans': '查看年度财务报告', 'zh-Hant': '查看年度財務報告' },
  'btn.tax_receipt': { 'zh-Hans': '奉献收据信息', 'zh-Hant': '奉獻收据信息' },
  'method.online.desc': { 'zh-Hans': '通过安全的在线平台使用信用卡奉献', 'zh-Hant': '通過安全的在線平台使用信用卡奉獻' },
  'purpose.1.desc': { 'zh-Hans': '支持本地与海外宣教事工', 'zh-Hant': '支持本地與海外宣教事工' },
  'purpose.2.desc': { 'zh-Hans': '开展社区外展与慈善活动', 'zh-Hant': '開展社區外展與慈善活動' },
  'purpose.3.desc': { 'zh-Hans': '维持教会日常运作与设施', 'zh-Hant': '維持教會日常運作與設施' },
  'purpose.4.desc': { 'zh-Hans': '支持神学教育与信徒培训', 'zh-Hant': '支持神學教育與信徒培訓' },
  'footer.about': { 'zh-Hans': '多伦多生命河灵粮堂教会', 'zh-Hant': '多倫多生命河靈糧堂' },
  'footer.about.text': { 'zh-Hans': '我们是一个充满爱心和信仰的社区，致力于传播福音、服务人群，并在基督的爱中共同成长。', 'zh-Hant': '我們是一個充滿愛心和信仰的社區，致力於傳播福音、服事人群，並在基督的愛中共同成長。' },
  'footer.links.title': { 'zh-Hans': '快速链接', 'zh-Hant': '快速連結' },
  'footer.contact.title': { 'zh-Hans': '联系我们', 'zh-Hant': '聯繫我們' },
  'footer.address': { 'zh-Hans': '📍 2460 The Collegeway, Mississauga, ON L5L 1V3', 'zh-Hant': '📍 2460 The Collegeway, Mississauga, ON L5L 1V3' },
  'footer.phone': { 'zh-Hans': '📞 (416) 123-4567', 'zh-Hant': '📞 (416) 123-4567' },
  'footer.email': { 'zh-Hans': '✉️ info@trolcc.ca', 'zh-Hant': '✉️ info@trolcc.ca' },
  'footer.hours': { 'zh-Hans': '🕒 周一至周五: 9:00 AM - 5:00 PM', 'zh-Hant': '🕒 周一至周五: 9:00 AM - 5:00 PM' }
});

// Added placeholders for homepage and future page texts discovered missing
Object.assign(translations, {
  'home.sections.title': { 'zh-Hans': '我们的五大事工', 'zh-Hant': '我們的五大事工' },
  'home.sections.subtitle': { 'zh-Hans': '承接母堂传统，深耕多伦多社区', 'zh-Hant': '承接母堂傳統，深耕多倫多社區' },
  'work.church_vision': { 'zh-Hans': '教会异象', 'zh-Hant': '教会异象' },
  'work.church_vision.desc': { 'zh-Hans': 'Ekklesia异象：祂的教会，祂的使命。', 'zh-Hant': 'Ekklesia異象：祂的教會，祂的使命。' },
  'card.worship.desc': { 'zh-Hans': '以心灵和诚实敬拜，带入神的同在。', 'zh-Hant': '以心靈和誠實敬拜，帶入神的同在。' },
  'card.equip.desc': { 'zh-Hans': '系统化查经与培训，建立扎实的信仰根基。', 'zh-Hant': '系統化查經與培訓，建立扎實的信仰根基。' },
  'card.community.desc': { 'zh-Hans': '在小团契中彼此关怀，活出基督的爱。', 'zh-Hant': '在小團契中彼此關懷，活出基督的愛。' },
  'card.mission.desc': { 'zh-Hans': '将福音传遍地极，完成大使命。', 'zh-Hant': '將福音傳遍地極，完成大使命。' },
  'home.map.title': { 'zh-Hans': '教会位置', 'zh-Hant': '教會位置' },
  'home.map.subtitle': { 'zh-Hans': '欢迎来访，我们期待与您相见', 'zh-Hant': '歡迎來訪，我們期待與您相見' },
  'home.bulletin.title': { 'zh-Hans': '教会布告栏', 'zh-Hant': '教會佈告欄' },
  'home.bulletin.subtitle': { 'zh-Hans': '最新消息与活动公告', 'zh-Hant': '最新消息與活動公告' },
  'nav.prayer_ai': { 'zh-Hans': '量子祷告', 'zh-Hant': '量子禱告' },
  'nav.return': { 'zh-Hans': '返回地表', 'zh-Hant': '返回地表' },
  'btn.enter_prayer': { 'zh-Hans': '进入祷告空间', 'zh-Hant': '進入禱告空間' },
  'btn.explore_ecosystem': { 'zh-Hans': '探索生态网络', 'zh-Hant': '探索生態網絡' },
  'preview-footer-text': { 'zh-Hans': '感谢赞美主', 'zh-Hant': '感謝讚美主' },
  'nav.bible_study': { 'zh-Hans': 'Qwen查经', 'zh-Hant': 'Qwen查經' }
});