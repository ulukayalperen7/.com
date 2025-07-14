// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    
    // Get elements
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const langToggleBtn = document.querySelector('.lang-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Translations object
    const translations = {
        en: {
            logo_subtitle: "Software Developer",
            nav_home: "Home",
            nav_about: "About",
            nav_skills: "Skills",
            nav_contact: "Contact",
            hero_subtitle: "Computer Science Student | AI Enthusiast | Full-Stack Developer",
            btn_contact: "Get In Touch",
            btn_github: "GitHub",
            btn_linkedin: "LinkedIn",
            about_title: "About Me",
            education_title: "Education",
            experience_title: "Experience",
            passion_title: "Passion & Skills",
            skills_title: "Technologies",
            contact_title: "Contact Me",
            contact_subtitle: "Let's Connect",
            contact_text: "I'm always open to discussing new opportunities and innovative projects.",
            form_name: "Name",
            form_email: "Email",
            form_message: "Message",
            form_submit: "Send Message",
            footer_text: "Computer Science Student & Software Developer",
            footer_subtext: "Building the future with code and AI",
            footer_copyright: "© 2024 Alperen Ulukaya. Crafted with passion and innovation.",
            footer_github: "GitHub",
            footer_linkedin: "LinkedIn",
            footer_email: "Email",
            edu_bsc: "Bachelor of Science - Computer Science",
            edu_bsc_school: "Akdeniz University (2023-2027)",
            edu_prep: "Preparatory School",
            edu_prep_school: "Akdeniz University (2022-2023)",
            exp_title: "Software Engineer Intern",
            exp_company: "Talya Bilişim",
            exp_date: "June 30 - August 8, 2025",
            exp_text: "Full-Stack Development",
            exp_tag: "Development",
            passion_ai: "Artificial Intelligence",
            passion_ai_text: "Passionate about AI and its future potential",
            passion_lead: "Project Leadership",
            passion_lead_text: "Leading development teams and managing projects"
        },
        tr: {
            logo_subtitle: "Yazılım Geliştirici",
            nav_home: "Ana Sayfa",
            nav_about: "Hakkımda",
            nav_skills: "Yetenekler",
            nav_contact: "İletişim",
            hero_subtitle: "Bilgisayar Mühendisliği Öğrencisi | Yapay Zeka Meraklısı | Full-Stack Geliştirici",
            btn_contact: "İletişime Geç",
            btn_github: "GitHub",
            btn_linkedin: "LinkedIn",
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
            footer_text: "Bilgisayar Mühendisliği Öğrencisi ve Yazılım Geliştirici",
            footer_subtext: "Kod ve yapay zeka ile geleceği inşa etmek",
            footer_copyright: "© 2024 Alperen Ulukaya. Tutku ve yenilikle hazırlandı.",
            footer_github: "GitHub",
            footer_linkedin: "LinkedIn",
            footer_email: "E-posta",
            edu_bsc: "Bilgisayar Bilimleri Lisans Programı",
            edu_bsc_school: "Akdeniz Üniversitesi (2023-2027)",
            edu_prep: "Hazırlık Okulu",
            edu_prep_school: "Akdeniz Üniversitesi (2022-2023)",
            exp_title: "Yazılım Mühendisi Stajyeri",
            exp_company: "Talya Bilişim",
            exp_date: "30 Haziran - 8 Ağustos 2025",
            exp_text: "Full-Stack Geliştirme",
            exp_tag: "Geliştirme",
            passion_ai: "Yapay Zeka",
            passion_ai_text: "Yapay zekaya ve gelecekteki potansiyeline tutkuyla bağlı",
            passion_lead: "Proje Liderliği",
            passion_lead_text: "Geliştirme ekiplerini yönetmek ve projeleri yönetmek"
        }
    };

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
        const currentLang = localStorage.getItem('language') || 'en';
        const newLang = currentLang === 'en' ? 'tr' : 'en';
        applyLanguage(newLang);
        localStorage.setItem('language', newLang);
    }

    function applyLanguage(lang) {
        // Update logo subtitle
        const logoSubtitle = document.querySelector('.logo-subtitle');
        if (logoSubtitle) logoSubtitle.textContent = translations[lang].logo_subtitle;

        // Update navigation links
        const navHome = document.querySelector('.nav-link[href="#home"]');
        const navAbout = document.querySelector('.nav-link[href="#about"]');
        const navSkills = document.querySelector('.nav-link[href="#skills"]');
        const navContact = document.querySelector('.nav-link[href="#contact"]');
        
        if (navHome) navHome.textContent = translations[lang].nav_home;
        if (navAbout) navAbout.textContent = translations[lang].nav_about;
        if (navSkills) navSkills.textContent = translations[lang].nav_skills;
        if (navContact) navContact.textContent = translations[lang].nav_contact;

        // Update hero section
        const heroSubtitle = document.querySelector('.hero-subtitle .typing-text');
        if (heroSubtitle) heroSubtitle.textContent = translations[lang].hero_subtitle;

        const contactBtn = document.querySelector('.contact-btn .btn-text');
        if (contactBtn) contactBtn.textContent = translations[lang].btn_contact;

        const githubBtn = document.querySelector('.github-btn .btn-text');
        if (githubBtn) githubBtn.textContent = translations[lang].btn_github;

        const linkedinBtn = document.querySelector('.linkedin-btn .btn-text');
        if (linkedinBtn) linkedinBtn.textContent = translations[lang].btn_linkedin;

        // Update section titles
        const aboutTitle = document.querySelector('#about .title-glow');
        if (aboutTitle) aboutTitle.textContent = translations[lang].about_title;

        const skillsTitle = document.querySelector('#skills .title-glow');
        if (skillsTitle) skillsTitle.textContent = translations[lang].skills_title;

        const contactTitle = document.querySelector('#contact .title-glow');
        if (contactTitle) contactTitle.textContent = translations[lang].contact_title;

        // Update about section card titles
        const educationTitle = document.querySelector('.education-card h3');
        if (educationTitle) educationTitle.textContent = translations[lang].education_title;

        const experienceTitle = document.querySelector('.experience-card h3');
        if (experienceTitle) experienceTitle.textContent = translations[lang].experience_title;

        const passionTitle = document.querySelector('.passion-card h3');
        if (passionTitle) passionTitle.textContent = translations[lang].passion_title;

        // Update contact section
        const contactSubtitle = document.querySelector('.contact-info h3');
        if (contactSubtitle) contactSubtitle.textContent = translations[lang].contact_subtitle;

        const contactText = document.querySelector('.contact-text');
        if (contactText) contactText.textContent = translations[lang].contact_text;

        // Update form labels
        const nameLabel = document.querySelector('label[for="name"]');
        if (nameLabel) nameLabel.textContent = translations[lang].form_name;

        const emailLabel = document.querySelector('label[for="email"]');
        if (emailLabel) emailLabel.textContent = translations[lang].form_email;

        const messageLabel = document.querySelector('label[for="message"]');
        if (messageLabel) messageLabel.textContent = translations[lang].form_message;

        const submitBtn = document.querySelector('.submit-btn .btn-text');
        if (submitBtn) submitBtn.textContent = translations[lang].form_submit;

        // Update footer
        const footerText = document.querySelector('.footer-text');
        if (footerText) footerText.textContent = translations[lang].footer_text;

        const footerSubtext = document.querySelector('.footer-subtext');
        if (footerSubtext) footerSubtext.textContent = translations[lang].footer_subtext;

        const footerCopyright = document.querySelector('.footer-bottom p');
        if (footerCopyright) footerCopyright.textContent = translations[lang].footer_copyright;

        // Update footer links
        const footerGithub = document.querySelector('.footer-links a[href*="github"]');
        if (footerGithub) footerGithub.innerHTML = '<i class="fab fa-github"></i> ' + translations[lang].footer_github;
        const footerLinkedin = document.querySelector('.footer-links a[href*="linkedin"]');
        if (footerLinkedin) footerLinkedin.innerHTML = '<i class="fab fa-linkedin"></i> ' + translations[lang].footer_linkedin;
        const footerEmail = document.querySelector('.footer-links a[href^="mailto"]');
        if (footerEmail) footerEmail.innerHTML = '<i class="fas fa-envelope"></i> ' + translations[lang].footer_email;

        // Update language toggle button
        if (langToggleBtn) {
            const flagEn = langToggleBtn.querySelector('.flag-en');
            const flagTr = langToggleBtn.querySelector('.flag-tr');
            if (flagEn && flagTr) {
                if (lang === 'en') {
                    flagEn.style.display = '';
                    flagTr.style.display = 'none';
                } else {
                    flagEn.style.display = 'none';
                    flagTr.style.display = '';
                }
            }
        }

        // Update education card
        const eduBsc = document.querySelector('.education-item h4');
        if (eduBsc) eduBsc.textContent = translations[lang].edu_bsc;
        const eduBscSchool = document.querySelectorAll('.education-detail')[0];
        if (eduBscSchool) eduBscSchool.textContent = translations[lang].edu_bsc_school;
        const eduPrep = document.querySelectorAll('.education-item h4')[1];
        if (eduPrep) eduPrep.textContent = translations[lang].edu_prep;
        const eduPrepSchool = document.querySelectorAll('.education-detail')[1];
        if (eduPrepSchool) eduPrepSchool.textContent = translations[lang].edu_prep_school;
        // Update experience card
        const expTitle = document.querySelector('.experience-item h4');
        if (expTitle) expTitle.textContent = translations[lang].exp_title;
        const expCompany = document.querySelector('.experience-company');
        if (expCompany) expCompany.textContent = translations[lang].exp_company;
        const expDate = document.querySelector('.experience-date');
        if (expDate) expDate.textContent = translations[lang].exp_date;
        const expText = document.querySelector('.experience-text');
        if (expText) expText.textContent = translations[lang].exp_text;
        const expTag = document.querySelector('.experience-tags .tag');
        if (expTag) expTag.textContent = translations[lang].exp_tag;
        // Update passion card
        const passionAi = document.querySelectorAll('.passion-item h4')[0];
        if (passionAi) passionAi.textContent = '🤖 ' + translations[lang].passion_ai;
        const passionAiText = document.querySelectorAll('.passion-text')[0];
        if (passionAiText) passionAiText.textContent = translations[lang].passion_ai_text;
        const passionLead = document.querySelectorAll('.passion-item h4')[1];
        if (passionLead) passionLead.textContent = '📈 ' + translations[lang].passion_lead;
        const passionLeadText = document.querySelectorAll('.passion-text')[1];
        if (passionLeadText) passionLeadText.textContent = translations[lang].passion_lead_text;
    }

    // Active navigation highlight on scroll
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
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

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Kısa bir bekleme ile başarılı gönderim mesajı göster
            setTimeout(() => {
                alert('Mesajınız başarıyla gönderildi!');
            }, 500);
        });
    }

    // Scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);

    // Initialize
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            savedTheme = 'light';
        } else {
            savedTheme = 'dark';
        }
        localStorage.setItem('theme', savedTheme);
    }
    const savedLang = localStorage.getItem('language') || 'en';
    applyTheme(savedTheme);
    applyLanguage(savedLang);
    initSmoothScrolling();
    createParticles();
    updateActiveNavLink();

    // Hamburger menu aç/kapat
    const hamburger = document.querySelector('.hamburger');
    if (hamburger && navLinks) {
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }
});