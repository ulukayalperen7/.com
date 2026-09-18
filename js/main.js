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
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!header || !hamburger || !navMenu) return;

    const measureHeader = () => {
        document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
    };
    const setMenuOpen = isOpen => {
        navMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        measureHeader();
    };
    hamburger.addEventListener('click', () => setMenuOpen(!navMenu.classList.contains('open')));
    document.querySelectorAll('.nav-link').forEach(link => {
        // Native anchors keep URL hashes, history and keyboard navigation intact.
        link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
            setMenuOpen(false);
            hamburger.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!header.contains(event.target)) setMenuOpen(false);
    });
    window.matchMedia('(max-width: 60rem)').addEventListener('change', () => setMenuOpen(false));
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(measureHeader).observe(header);
    else window.addEventListener('resize', measureHeader);
    measureHeader();
}

// Module scripts run after HTML parsing. Optional features fail independently.
for (const initialize of [initI18n, initTheme, initNavigation, initChat]) {
    try { initialize(); } catch (error) { console.error(`${initialize.name} failed:`, error); }
}
const year = document.getElementById('copyright-year');
if (year) year.textContent = new Date().getFullYear();
