class SeoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data-name', 'data-logo-webp', 'data-logo-fallback', 'data-link'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute('data-name') || '';
    const logoWebp = this.getAttribute('data-logo-webp') || '';
    const logoFallback = this.getAttribute('data-logo-fallback') || '';
    const link = this.getAttribute('data-link') || '#';

    const pictureHTML = logoFallback ? `
      <picture>
        ${logoWebp ? `<source srcset="${logoWebp}" type="image/webp">` : ''}
        <img src="${logoFallback}" alt="Логотип ${name}" loading="lazy" />
      </picture>
    ` : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .card {
          border: 1px solid var(--color-lightGrey, #dadce0);
          border-radius: var(--border-radius, 8px);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: var(--bg-color, #fff);
          color: var(--font-color, #1f1f1f);
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          height: 100%;
          box-sizing: border-box;
          contain: layout style paint;
        }
        .card:hover {
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          transform: translateY(-3px);
        }
        picture {
          display: block;
          width: 100px;
          height: 100px;
          margin-bottom: 1rem;
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        /* Инверсия логотипа в тёмной теме */
        :host-context([data-theme="dark"]) picture img {
          filter: invert(1) hue-rotate(180deg);
        }
        .text-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-top: auto;
        }
        h3 {
          margin: 0 0 0.4rem;
          font-size: 1.3rem;
          line-height: 1.3;
          width: 100%;
        }
        ::slotted(span) {
          color: var(--color-text-light, #5f6368);
          font-size: 0.9rem;
          margin: 0 0 1rem;
        }
        a.card-link {
          margin-top: 0;
          padding: 0.5rem 1.2rem;
          background-color: var(--color-primary, #1a73e8);
          color: #ffffff;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        a.card-link:hover {
          background-color: var(--color-primary-dark, #1557b0);
        }
      </style>
      <div class="card">
        ${pictureHTML}
        <div class="text-block">
          <h3>${name}</h3>
          <slot name="description"><span>Описание отсутствует</span></slot>
          <a href="${link}" class="card-link" aria-label="Узнать больше о ${name}">Подробнее</a>
        </div>
      </div>
    `;
  }
}
customElements.define('seo-card', SeoCard);