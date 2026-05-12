class AppModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._visible = false;
    this._isListening = false;
    this._isRendered = false;
  }

  static get observedAttributes() {
    return ['open'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open') {
      this._visible = newVal !== null;
      if (this._visible) {
        if (this._isRendered) this.show();
      } else {
        if (this._isRendered) this.hide();
      }
    }
  }

  connectedCallback() {
    this.render();
    this._handleKeydown = this._handleKeydown.bind(this);
    if (!this._isListening) {
      document.addEventListener('keydown', this._handleKeydown);
      this._isListening = true;
    }
    if (this._visible) {
      this.show();
    }
  }

  disconnectedCallback() {
    if (this._isListening) {
      document.removeEventListener('keydown', this._handleKeydown);
      this._isListening = false;
    }
  }

  _handleKeydown(e) {
    if (e.key === 'Escape' && this._visible) {
      this.close();
    }
  }

  show() {
    if (!this._isRendered) return;
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const closeBtn = this.shadowRoot.querySelector('.close-btn');
      if (closeBtn) closeBtn.focus();
    }
  }

  hide() {
    if (!this._isRendered) return;
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) overlay.style.display = 'none';
  }

  close() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('modal-closed'));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --modal-bg: var(--bg-color, #fff);
          --modal-text: var(--font-color, #1f1f1f);
          --modal-text-light: var(--color-text-light, #5f6368);
        }
        :host-context([data-theme="dark"]) {
          --modal-bg: #252525;
          --modal-text: #e0e0e0;
          --modal-text-light: #c0c0c0;
        }

        .overlay {
          display: ${this._visible ? 'flex' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .modal {
          background-color: var(--modal-bg);
          color: var(--modal-text);
          border-radius: 8px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          position: relative;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--modal-text-light);
        }
        ::slotted(h2) {
          margin-top: 0;
        }
      </style>
      <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal">
          <button class="close-btn" aria-label="Закрыть окно">&times;</button>
          <slot name="title"><h2 id="modal-title">Модальное окно</h2></slot>
          <slot></slot>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => this.close());
    this.shadowRoot.querySelector('.overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.close();
    });

    this._isRendered = true;
  }
}
customElements.define('app-modal', AppModal);