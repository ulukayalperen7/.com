// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    
    // Get elements
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const langToggleBtn = document.querySelector('.lang-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // HTML owns English copy; only Turkish translations are maintained here.
    const turkishTranslations = {
        page_title: "Alperen Ulukaya - Bilgisayar Mühendisliği Öğrencisi",
        page_description: "Alperen Ulukaya'nın portföyü. Backend geliştirme ve yapay zeka sistemlerine odaklanan Bilgisayar Mühendisliği öğrencisi.",
        logo_subtitle: "Bilgisayar Mühendisliği Öğrencisi",
        nav_home: "Ana Sayfa",
        nav_about: "Hakkımda",
        nav_skills: "Yetenekler",
        nav_contact: "İletişim",
        hero_subtitle: "Bilgisayar Mühendisliği Öğrencisi | Backend Geliştirme ve Yapay Zeka Sistemleri",
        btn_contact: "İletişime Geç",
        about_title: "Hakkımda",
        education_title: "Eğitim",
        experience_title: "Deneyim",
        passion_title: "Tutku ve Yetenekler",
        skills_title: "Teknolojiler",
        contact_title: "Bana Ulaşın",
        contact_subtitle: "Bağlantı Kuralım",
        contact_text: "Yeni fırsatları ve yenilikçi projeleri tartışmaya her zaman açığım.",
        form_name: "İsim",
        form_email: "E-posta",
        form_message: "Mesaj",
        form_submit: "Mesajı Gönder",
        footer_subtext: "Kod ve yapay zeka ile geleceği inşa etmek",
        footer_copyright: "Tutku ve yenilikle hazırlandı.",
        edu_bsc: "Bilgisayar Mühendisliği Lisans Programı",
        edu_bsc_school: "Akdeniz Üniversitesi (2023-2027)",
        edu_prep: "Hazırlık Okulu",
        edu_prep_school: "Akdeniz Üniversitesi (2022-2023)",
        exp_title: "Yazılım Mühendisi Stajyeri",
        exp_date: "30 Haziran - 8 Ağustos 2025",
        exp_text: "Full-Stack Geliştirme",
        exp_tag: "Geliştirme",
        passion_ai: "Yapay Zeka",
        passion_ai_text: "Yapay zekaya ve gelecekteki potansiyeline tutkuyla bağlı",
        passion_lead: "Proje Liderliği",
        passion_lead_text: "Geliştirme ekiplerini yönetmek ve projeleri yönetmek",
        nav_toggle: "Menüyü aç/kapat",
        theme_toggle: "Temayı değiştir",
        language_toggle: "İngilizceye geç",
        chat_toggle: "Sohbeti aç/kapat",
        chat_close: "Sohbeti kapat",
        chat_title: "Alperen'in Yapay Zeka Asistanı",
        chat_status: "Portföy sohbeti",
        chat_greeting: "Merhaba! Alperen'in eğitimi, deneyimi veya becerileri hakkında soru sorabilirsiniz.",
        chat_loading: "Yanıt bekleniyor",
        chat_input: "Mesajınızı yazın..."
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

    // Theme toggle functionality
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun toggle-icon"></i>';
            }
        } else {
            document.body.classList.remove('light-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon toggle-icon"></i>';
            }
        }
    }

    // Language toggle functionality
    function toggleLanguage() {
        const currentLang = document.documentElement.lang;
        const newLang = currentLang === 'en' ? 'tr' : 'en';
        applyLanguage(newLang);
        localStorage.setItem('language', newLang);
    }

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

    // Active navigation highlight on scroll
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Add particles animation
    function createParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 255, 255, 0.5);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        
        .typing-text {
            border-right: 2px solid var(--accent-cyan);
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: var(--accent-cyan); }
        }
    `;
    document.head.appendChild(style);

    // Event listeners
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // Scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);

    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    // Initialize
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = 'dark';
        localStorage.setItem('theme', savedTheme);
    }
    const savedLang = localStorage.getItem('language') || 'en';
    applyTheme(savedTheme);
    applyLanguage(savedLang);
    initSmoothScrolling();
    createParticles();
    updateActiveNavLink();

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        const setMenuOpen = isOpen => {
            navMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        };
        hamburger.addEventListener('click', () => {
            setMenuOpen(!navMenu.classList.contains('open'));
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && navMenu.classList.contains('open')) {
                setMenuOpen(false);
                hamburger.focus();
            }
        });
        window.matchMedia('(max-width: 768px)').addEventListener('change', () => setMenuOpen(false));
    }
});
