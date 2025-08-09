document.addEventListener('DOMContentLoaded', () => {
    const AppUI = window.AppUI;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = [
        { href: 'index.html', icon: 'fa-house', text: 'Dashboard' },
        { href: 'log.html', icon: 'fa-plus-circle', text: 'Log Workout' },
        { href: 'history.html', icon: 'fa-clock-rotate-left', text: 'History' },
        { href: 'progress.html', icon: 'fa-chart-line', text: 'Progress' },
    ];

    const desktopNavContainer = document.getElementById('desktop-nav');
    const mobileNavContainer = document.getElementById('mobile-nav');

    if (desktopNavContainer) {
        desktopNavContainer.innerHTML = AppUI.createDesktopNav(navLinks, currentPage);
    }
    if (mobileNavContainer) {
        mobileNavContainer.innerHTML = AppUI.createMobileNav(navLinks, currentPage);
    }
});
