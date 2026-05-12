class SiteHeader extends HTMLElement {
  connectedCallback() {
    const currentPage = this.getAttribute('current-page') || '';
    const path = window.location.pathname;
    const inPagesFolder = path.includes('/pages/');
    const homeHref = inPagesFolder ? '../index.html' : 'index.html';
    const prefix = inPagesFolder ? '' : 'pages/';

    const seoLinks = [
      { href: prefix + 'technical-seo.html', label: 'Техническое SEO', id: 'technical-seo' },
      { href: prefix + 'semantic-html.html', label: 'Семантика HTML', id: 'semantic-html' },
      { href: prefix + 'schema-org.html', label: 'Schema.org', id: 'schema-org' },
      { href: prefix + 'json-ld.html', label: 'JSON-LD', id: 'json-ld' },
      { href: prefix + 'comparison.html', label: 'Сравнение инструментов', id: 'comparison' },
    ];
    const infoLinks = [
      { href: prefix + 'about.html', label: 'О проекте', id: 'about' },
      { href: prefix + 'contact.html', label: 'Контакты', id: 'contact' },
      { href: prefix + 'videos.html', label: 'Видео', id: 'videos' },
    ];

    const makeLink = (p) => `<li role="none"><a href="${p.href}" role="menuitem" ${p.id === currentPage ? 'aria-current="page"' : ''}>${p.label}</a></li>`;
    const makeDropdown = (summaryText, links) => `
      <li role="none" class="dropdown-wrapper">
        <details class="dropdown">
          <summary role="menuitem" aria-haspopup="true" ${links.some(l => l.id === currentPage) ? 'aria-current="page"' : ''}>${summaryText}</summary>
          <ul class="dropdown-menu" role="menu">${links.map(makeLink).join('')}</ul>
        </details>
      </li>`;

    this.innerHTML = `
      <header role="banner">
        <nav class="nav" role="navigation" aria-label="Главная навигация">
          <div class="container">
            <button class="burger" aria-expanded="false" aria-controls="main-menu" aria-label="Открыть меню">
              <span></span><span></span><span></span>
            </button>
            <a href="${homeHref}" class="logo" aria-label="На главную">SEO Guide</a>
            <div class="theme-toggle-container">
              <button id="theme-toggle" class="theme-toggle" aria-label="Переключить тему" aria-pressed="false">🌓</button>
            </div>
            <ul id="main-menu" class="nav-menu" role="menubar" aria-label="Основное меню">
              ${makeDropdown('SEO-факторы', seoLinks)}${makeDropdown('Инфо', infoLinks)}
            </ul>
          </div>
        </nav>
      </header>`;
    this.initBurger();
    this.initTheme();
    this.initDropdowns();
  }

  initBurger() {
    const burger = this.querySelector('.burger');
    const menu = this.querySelector('.nav-menu');
    if (!burger || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    };
    const openMenu = () => {
      menu.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
      const firstFocusable = menu.querySelector('a, summary, button');
      if (firstFocusable) firstFocusable.focus();
    };

    burger.addEventListener('click', () => {
      const expanded = menu.classList.contains('active');
      expanded ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Закрываем меню при клике на ссылки, но НЕ на summary (чтобы дропдауны работали)
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });
    // Для summary не добавляем закрытие — оно раскрывает/закрывает выпадающий список
    // Дополнительно: предотвращаем всплытие события с summary, чтобы случайно не закрыть меню
    menu.querySelectorAll('summary').forEach(summary => {
      summary.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  initTheme() {
    const html = document.documentElement;
    const toggleBtn = this.querySelector('#theme-toggle');
    const applyTheme = (theme) => {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      const isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-pressed', isDark);
      toggleBtn.textContent = isDark ? '🌙' : '☀️';
    };
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
    }
    mediaQuery.addEventListener('change', () => {
      if (!localStorage.getItem('theme')) {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    });
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  initDropdowns() {
    const dropdowns = this.querySelectorAll('.nav details.dropdown');
    if (!window.matchMedia('(hover: hover)').matches) return;
    dropdowns.forEach(details => {
      details.addEventListener('mouseenter', () => details.setAttribute('open', ''));
      details.addEventListener('mouseleave', () => details.removeAttribute('open'));
    });
  }
}
customElements.define('site-header', SiteHeader);