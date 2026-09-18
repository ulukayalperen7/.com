export function initI18n() {
    const supportedLanguages = ['en', 'tr'];
    const langToggleBtn = document.querySelector('.lang-toggle');
    // HTML owns English copy; only Turkish translations are maintained here.
    const turkishTranslations = {
        'page.title': "Alperen Ulukaya - Bilgisayar Mühendisliği Öğrencisi",
        'page.description': "Alperen Ulukaya'nın portföyü. Backend geliştirme ve yapay zeka sistemlerine odaklanan Bilgisayar Mühendisliği öğrencisi.",
        'logo.subtitle': "Bilgisayar Mühendisliği Öğrencisi",
        'nav.home': "Ana Sayfa",
        'nav.about': "Hakkımda",
        'nav.skills': "Yetenekler",
        'nav.contact': "İletişim",
        'hero.subtitle': "Bilgisayar Mühendisliği Öğrencisi | Backend Geliştirme ve Yapay Zeka Sistemleri",
        'btn.contact': "İletişime Geç",
        'about.title': "Hakkımda",
        'education.title': "Eğitim",
        'experience.title': "Deneyim",
        'passion.title': "Tutku ve Yetenekler",
        'skills.title': "Teknolojiler",
        'contact.title': "Bana Ulaşın",
        'contact.subtitle': "Bağlantı Kuralım",
        'contact.text': "Yeni fırsatları ve yenilikçi projeleri tartışmaya her zaman açığım.",
        'form.name': "İsim",
        'form.email': "E-posta",
        'form.message': "Mesaj",
        'form.submit': "Mesajı Gönder",
        'footer.subtext': "Kod ve yapay zeka ile geleceği inşa etmek",
        'footer.copyright': "Tutku ve yenilikle hazırlandı.",
        'education.degree': "Bilgisayar Mühendisliği Lisans Programı",
        'education.university': "Akdeniz Üniversitesi (2023-2027)",
        'education.prep': "Hazırlık Okulu",
        'education.prepSchool': "Akdeniz Üniversitesi (2022-2023)",
        'experience.talya.role': "Yazılım Mühendisi Stajyeri",
        'experience.talya.dates': "30 Haziran - 8 Ağustos 2025",
        'experience.talya.summary': "Full-Stack Geliştirme",
        'experience.talya.tag': "Geliştirme",
        'passion.ai': "Yapay Zeka",
        'passion.ai_text': "Yapay zekaya ve gelecekteki potansiyeline tutkuyla bağlı",
        'passion.lead': "Proje Liderliği",
        'passion.lead_text': "Geliştirme ekiplerini yönetmek ve projeleri yönetmek",
        'nav.toggle': "Menüyü aç/kapat",
        'theme.toggle': "Temayı değiştir",
        'language.toggle': "İngilizceye geç",
        'chat.toggle': "Sohbeti aç/kapat",
        'chat.close': "Sohbeti kapat",
        'chat.title': "Alperen'in Yapay Zeka Asistanı",
        'chat.status': "Portföy sohbeti",
        'chat.greeting': "Merhaba! Alperen'in eğitimi, deneyimi veya becerileri hakkında soru sorabilirsiniz.",
        'chat.loading': "Yanıt bekleniyor",
        'chat.input': "Mesajınızı yazın..."
    };
    const localizedElements = Array.from(document.querySelectorAll('[data-i18n]'), element => {
        const attribute = element.dataset.i18nAttr;
        return {
            element,
            attribute,
            key: element.dataset.i18n,
            english: attribute ? element.getAttribute(attribute) : element.textContent
        };
    });

    function applyLanguage(language) {
        const lang = language === 'tr' ? 'tr' : 'en';
        document.documentElement.lang = lang;
        localizedElements.forEach(({ element, attribute, key, english }) => {
            const text = lang === 'tr' ? (turkishTranslations[key] ?? english) : english;
            if (attribute) {
                element.setAttribute(attribute, text);
                if (element.id === 'chat-input') element.setAttribute('aria-label', text);
            } else {
                element.textContent = text;
            }
        });
        if (langToggleBtn) {
            langToggleBtn.querySelector('.flag-en').style.display = lang === 'en' ? '' : 'none';
            langToggleBtn.querySelector('.flag-tr').style.display = lang === 'tr' ? '' : 'none';
        }
    }

    let savedLanguage = 'en';
    try { savedLanguage = localStorage.getItem('language'); } catch { /* Storage is optional. */ }
    applyLanguage(supportedLanguages.includes(savedLanguage) ? savedLanguage : 'en');
    langToggleBtn?.addEventListener('click', () => {
        const lang = document.documentElement.lang === 'en' ? 'tr' : 'en';
        applyLanguage(lang);
        try { localStorage.setItem('language', lang); } catch { /* Keep the choice for this page. */ }
    });
}
