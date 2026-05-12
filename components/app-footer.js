class SiteFooter extends HTMLElement {
  connectedCallback() {
    const path = window.location.pathname;
    const inPagesFolder = path.includes('/pages/');

    const aboutHref = inPagesFolder ? 'about.html' : 'pages/about.html';
    const contactHref = inPagesFolder ? 'contact.html' : 'pages/contact.html';

    this.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <div class="container">
          <p>© ${new Date().getFullYear()} Технологии разработки интернет-приложений.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);