class SubscribeForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --form-bg: var(--bg-color, #fff);
          --form-text: var(--font-color, #1f1f1f);
          --form-primary: var(--color-primary, #1a73e8);
          --form-primary-dark: var(--color-primary-dark, #1557b0);
          --form-border: var(--color-lightGrey);
        }
        :host-context([data-theme="dark"]) {
          --form-bg: #252525;
          --form-text: #e0e0e0;
          --form-primary: #66bb6a;
          --form-primary-dark: #4caf50;
          --form-border: #555;
        }

        form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 360px; }
        label { font-weight: 500; color: var(--form-text); }
        input {
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--form-border);
          border-radius: 4px;
          font-size: 1rem;
          background: var(--form-bg);
          color: var(--form-text);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input.touched:invalid {
          border-color: #d43939;
          box-shadow: 0 0 0 1px #d43939;
        }
        input.touched:valid {
          border-color: #28bd14;
          box-shadow: 0 0 0 1px #28bd14;
        }
        button {
          padding: 0.6rem 1.2rem;
          background-color: var(--color-primary, #1a73e8);
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }
        button:hover { background-color: var(--form-primary-dark); }
        .message { font-size: 0.85rem; min-height: 1.2em; color: var(--form-text); }
      </style>
      <form id="sub-form" novalidate>
        <label for="email">Будьте в курсе новостей</label>
        <input type="email" id="email" name="email" placeholder="your@email.com" required autocomplete="email" aria-required="true" />
        <button type="submit">Подписаться</button>
        <div class="message" role="alert" aria-live="polite"></div>
      </form>
    `;

    const form = this.shadowRoot.getElementById('sub-form');
    const emailInput = this.shadowRoot.getElementById('email');
    const msg = this.shadowRoot.querySelector('.message');

    emailInput.addEventListener('input', () => {
      emailInput.classList.add('touched');
    });

    emailInput.addEventListener('blur', () => {
      emailInput.classList.add('touched');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      emailInput.classList.add('touched');
      const email = emailInput.value.trim();
      if (!email) {
        msg.textContent = 'Введите email';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = 'Некорректный email';
        return;
      }
      msg.textContent = 'Спасибо за подписку!';
      emailInput.value = '';
      emailInput.classList.remove('touched');
    });
  }
}
customElements.define('subscribe-form', SubscribeForm);