import { initI18n } from './i18n.js';
import { initChat } from './chat.js';

function initTheme() {
    const button = document.querySelector('.theme-toggle');
    let theme = 'dark';
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') theme = saved;
    } catch { /* Storage is optional. */ }
    const applyTheme = () => {
        document.body.classList.toggle('light-mode', theme === 'light');
        button?.setAttribute('aria-pressed', String(theme === 'light'));
    };
    applyTheme();
    button?.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        try { localStorage.setItem('theme', theme); } catch { /* Keep the choice for this page. */ }
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
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
        window.matchMedia('(max-width: 60rem)').addEventListener('change', () => setMenuOpen(false));
    }
    initSmoothScrolling();
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
}

// Module scripts run after HTML parsing. Optional features fail independently.
for (const initialize of [initI18n, initTheme, initNavigation, initChat]) {
    try { initialize(); } catch (error) { console.error(`${initialize.name} failed:`, error); }
}
const year = document.getElementById('copyright-year');
if (year) year.textContent = new Date().getFullYear();
