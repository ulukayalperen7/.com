export function initI18n() {
    const supportedLanguages = ['en', 'tr'];
    const langToggleBtn = document.querySelector('.lang-toggle');
    // HTML owns English copy; only Turkish translations are maintained here.
    const turkishTranslations = {
        'page.title': "Alperen Ulukaya - Bilgisayar Mühendisliği",
        'page.description': "Alperen Ulukaya'nın portföyü. Backend geliştirme ve yapay zeka sistemlerine odaklanan Bilgisayar Mühendisliği öğrencisi.",
        'logo.subtitle': "Bilgisayar Mühendisliği",
        'nav.projects': "Projeler",
        'nav.experience': "Deneyim",
        'nav.about': "Hakkımda",
        'nav.skills': "Teknolojiler",
        'nav.contact': "İletişim",
        'hero.discipline': "Bilgisayar Mühendisliği",
        'hero.focus': "Backend ve Yapay Zeka Sistemleri",
        'hero.intro': "Akdeniz Üniversitesi'nde Bilgisayar Mühendisliği okuyorum. Backend servislerini, veriyi ve yapay zekayı bir araya getiren uygulamalar geliştiriyorum.",
        'hero.projects': "Projelerimi inceleyin",
        'projects.label': "Seçilmiş çalışmalar",
        'projects.title': "Projeler",
        'projects.tripmate.context': "SAN TSG staj projesi",
        'projects.tripmate.summary': "Sohbet üzerinden otel ve uçuş arama, yapılandırılmış sonuçlar ve backend rezervasyon akışı sunan bir seyahat uygulaması.",
        'projects.tripmate.engineering': "Harici seyahat API çağrıları Spring Boot backend'inde kalır; arayüze standartlaştırılmış yanıtlar iletilir.",
        'projects.tripmate.role': "Sanifest ekip üyesi",
        'projects.giraffe.status': "Geliştirme aşamasında",
        'projects.giraffe.summary': "Yapılandırılmamış kaynakları çıkarım, doğrulama ve inceleme adımlarıyla bilgi grafiğine dönüştürmeye yönelik bir platform.",
        'projects.giraffe.engineering': "Şemaya göre oluşturulan adaylar grafiğe kaydedilmeden önce doğrulanır. Düşük güvenli sonuçlar insan incelemesinden geçer.",
        'projects.source': "Kaynak kodu",
        'projects.live': "Siteyi ziyaret et",
        'about.label': "Kısaca ben",
        'about.title': "Hakkımda",
        'about.intro': "Ben Alperen, Akdeniz Üniversitesi'nde Bilgisayar Mühendisliği öğrencisiyim. Backend geliştirmeye ve dil modellerinin yazılımda pratik kullanımına odaklanıyorum.",
        'about.direction': "Bir uygulamanın bütününe ilgi duyuyorum: verisine, API sınırlarına ve bakımını kolaylaştıran kararlara.",
        'education.title': "Eğitim",
        'experience.title': "Deneyim",
        'experience.label': "Uygulama deneyimi",
        'experience.san.role': "Staj",
        'experience.san.summary': "Yapay zeka destekli seyahat arama ve rezervasyon uygulaması TripMate'i geliştiren Sanifest ekibinin bir parçası.",
        'skills.label': "Çalışmalarda kullanılan araçlar",
        'skills.title': "Teknik araçlar",
        'skills.backend': "Backend",
        'skills.data': "Veri",
        'skills.frontend': "Frontend",
        'skills.ai': "Yapay zeka entegrasyonu",
        'skills.aiTools': "Gemini · LLM API'leri · Prompt tasarımı",
        'contact.title': "Bana Ulaşın",
        'contact.subtitle': "Bağlantı Kuralım",
        'contact.text': "Yeni fırsatları ve yenilikçi projeleri tartışmaya her zaman açığım.",
        'form.name': "İsim",
        'form.email': "E-posta",
        'form.message': "Mesaj",
        'form.submit': "Mesajı Gönder",
        'footer.subtext': "Bilgisayar Mühendisliği, Akdeniz Üniversitesi",
        'footer.copyright': "Kişisel portföy.",
        'education.degree': "Bilgisayar Mühendisliği · 2023–2027",
        'education.university': "Akdeniz Üniversitesi",
        'education.prep': "Hazırlık Okulu · 2022–2023",
        'experience.talya.role': "Yazılım Mühendisi Stajyeri",
        'experience.talya.dates': "30 Haziran - 8 Ağustos 2025",
        'experience.talya.summary': "Full-stack geliştirme stajı.",
        'nav.toggle': "Menüyü aç/kapat",
        'theme.toggle': "Temayı değiştir",
        'language.toggle': "İngilizceye geç",
        'chat.toggle': "Sohbeti aç/kapat",
        'chat.close': "Sohbeti kapat",
        'chat.title': "Portföy asistanı",
        'chat.launcher': "Çalışmalarımı sorun",
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
