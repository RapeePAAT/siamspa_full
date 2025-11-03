 // โหลดภาษา (default = th)
  let currentLang = localStorage.getItem('lang') || 'th';
  loadLanguage(currentLang);
console.log(currentLang)
  // เปลี่ยนภาษาเมื่อคลิก
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      localStorage.setItem('lang', lang);
      loadLanguage(lang);
    });
  });

  function loadLanguage(lang) {
    fetch(`./scripts/language/${lang}.json`)
      .then(res => res.json())
      .then(data => {
        // เปลี่ยนข้อความในทุก element ที่มี data-key
        document.querySelectorAll('[data-key]').forEach(el => {
          const key = el.getAttribute('data-key');
          const text = key.split('.').reduce((obj, i) => obj?.[i], data);
          if (text) el.textContent = text;
        });
      });
  }