class SidebarContent extends HTMLElement {
  static get observedAttributes() {
    return ['current-page'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const currentPage = this.getAttribute('current-page') || '';
    const currentPath = window.location.pathname;
    const inPagesFolder = currentPath.includes('/pages/');
    const prefix = inPagesFolder ? '' : 'pages/';

    const links = [
      { id: 'technical-seo', href: prefix + 'technical-seo.html', label: 'Техническое SEO' },
      { id: 'semantic-html', href: prefix + 'semantic-html.html', label: 'Семантика HTML' },
      { id: 'schema-org', href: prefix + 'schema-org.html', label: 'Schema.org' },
      { id: 'json-ld', href: prefix + 'json-ld.html', label: 'JSON-LD' },
      { id: 'comparison', href: prefix + 'comparison.html', label: 'Сравнение инструментов' },
      { id: 'videos', href: prefix + 'videos.html', label: 'Видео' },
    ];

    const linksHTML = links.map(l => {
      const isActive = l.id === currentPage;
      return `<li><a href="${l.href}" class="${isActive ? 'active' : ''}">${l.label}</a></li>`;
    }).join('');

    this.innerHTML = `
      <div class="container sidebar-content">
        <h2>Разделы SEO</h2>
        <ul class="sidebar-nav">
          ${linksHTML}
        </ul>
      </div>
    `;
  }
}
customElements.define('sidebar-content', SidebarContent);