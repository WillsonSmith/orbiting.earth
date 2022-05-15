import { LitElement, html, css } from 'lit';

import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

import '../star-sheet/star-sheet.js';

class PageHeader extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      noStars: { type: Boolean, attribute: `no-stars` },
    };
  }

  static get styles() {
    return css`
      :host {
        --font-family: 'Fredoka', var(--sl-font-sans), sans-serif;
        --border-width: 1px;
        --background: var(--sl-color-neutral-0);
      }

      .header {
        background: var(--background);
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: var(--border-width) solid var(--sl-color-neutral-300);
        padding: var(--sl-spacing-x-small) var(--sl-spacing-small);

        z-index: 1;
      }

      .header-title {
        margin: 0;
        font-family: var(--font-family);
        font-size: var(--sl-font-size-2x-large);
        line-height: var(--sl-line-height-normal);
        font-weight: var(--sl-font-weight-semibold);
        color: var(--sl-color-neutral-900);
      }

      .header-title ::slotted(a) {
        text-decoration: none;
        color: var(--sl-color-neutral-900);
      }

      .social {
        display: flex;
        align-items: center;
      }

      colorize-word {
        font-family: 'Fredoka', var(--sl-font-sans);
      }

      star-sheet {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        z-index: -1;
      }

      sl-dropdown {
        margin-right: var(--sl-spacing-2x-small);
      }

      sl-menu {
        margin-top: var(--sl-spacing-2x-small);
      }
    `;
  }

  constructor() {
    super();
    this.title = `Page Title`;
  }

  render() {
    const starSheet = this.noStars ? `` : html`<star-sheet star-density="2"></star-sheet>`;
    return html`
      <header class="header">
        ${starSheet}
        <h1 class="header-title">
          <slot name="title"></slot>
        </h1>
        <nav class="header-social">
          <sl-dropdown>
            <sl-button slot="trigger" pill size="small" caret>
              <sl-icon name="moon" label="Select theme"></sl-icon>
            </sl-button>
            <sl-menu value="automatic" @sl-select=${this._handleThemeChange}>
              <sl-menu-item value="light">Light</sl-menu-item>
              <sl-menu-item value="dark">Dark</sl-menu-item>
              <sl-menu-item value="automatic">Automatic</sl-menu-item>
            </sl-menu>
          </sl-dropdown>

          <sl-tooltip content="Twitter">
            <sl-icon-button
              name="twitter"
              label="Twitter"
              href="https://twitter.com/modfox"
              target="_blank"
            ></sl-icon-button>
          </sl-tooltip>
          <sl-tooltip content="GitHub">
            <sl-icon-button
              name="github"
              label="GitHub"
              href="https://github.com/willsonsmith/willsonsmith.com"
              target="_blank"
            ></sl-icon-button>
          </sl-tooltip>
        </nav>
      </header>
    `;
  }

  _handleThemeChange(event) {
    const theme = event.detail.item.value;
    this.dispatchEvent(new CustomEvent(`theme-change`, { detail: { theme } }));
  }
}

customElements.define(`page-header`, PageHeader);
