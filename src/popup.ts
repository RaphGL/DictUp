import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("dict-definition-type")
class DictDefinitionType extends LitElement {
  static styles = css`
    div {
      border-radius: 0.5em;
      border: solid 1px var(--color-text);
      padding: 0.2em;
      font-size: 0.6em;
      font-weight: bold;
      display: flex;
    }
  `;

  render() {
    return html`<div><slot /></div>`;
  }
}

@customElement("dict-definition")
class DictDefinition extends LitElement {
  static styles = css`
    .definition-box {
      border-radius: 0.3em;
      padding: 0 1em;
      transition: background-color 0.1s ease-in;
      min-width: 15em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .definition-clipboard {
      display: none;

      :hover {
        color: var(--color-sky);
      }
    }

    .definition-box:hover {
      background-color: var(--color-surface);

      .definition-clipboard {
        display: block;
      }
    }

    .definition {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }

    .types {
      display: flex;
      gap: 0.2em;
    }
  `;

  @property({ type: String })
  definition = "";

  // todo improve copy to clipboard functionality
  copyToClipboard() {    
    navigator.clipboard.writeText(this.definition)
  }

  render() {
    return html`
      <div class="definition-box">
        <div class="definition">
          <div class="types">
            <slot />
          </div>
          <p>${this.definition}</p>
        </div>

        <div class="definition-clipboard" @click="${this.copyToClipboard}">
          <dict-clipboard-icon></dict-clipboard-icon>
        </div>
      </div>
    `;
  }
}

@customElement("dict-entry")
class DictEntry extends LitElement {
  static styles = css`
    h2 {
      font-size: 1.4em;
      margin: 0.2em;
      margin-left: 0.5em;
      color: var(--color-sky);
    }
  `;

  @property({ type: String })
  name = "";

  render() {
    return html`<div class="entry">
      <h2>${this.name}</h2>
      <div class="definitions">
        <slot />
      </div>
    </div>`;
  }
}

@customElement("dictup-injected-comp")
export class InjectedComponent extends LitElement {
  static styles = css`
    .component {
        position: fixed;
        top: 0;
        left: 0;
        padding: 0.5em;
        box-shadow: 1px 1px 5px var(--color-sky);
        border-radius: 0.5em;
        background-color: var(--color-base);
        z-index: 999;
        overflow: auto;
        max-height: 60vh;
    }
  `;

  @state()
  private definitions: string[] = [];

  hide(b: boolean) {
    this.style.display = b ? "none" : "block";
  }

  setAbsolutePosition(x: number, y: number) {
    const convertNum = (num: number) => num.toFixed().toString() + "px";
    let yProp = convertNum(y);
    let xProp = convertNum(x);

    let component = this.shadowRoot?.querySelector(".component");
    component?.setAttribute("style", `left:${xProp};top:${yProp};`);
  }

  getDimensions() {
    let component = this.shadowRoot?.querySelector(".component");
    let bound = component?.getBoundingClientRect();
    if (!bound) return { height: 0, width: 0 };
    return { height: bound?.height, width: bound?.width };
  }

  // todo: retrieve information about the definitions
  setCurrentSelection(text: string) {
    this.definitions = text.split(' ')
  }

  render() {
    let definitions = [];

    for (const definition of this.definitions) {
      definitions.push(html`
        <dict-entry name="${definition}">
          <dict-definition definition="Greetings">
            <dict-definition-type>noun</dict-definition-type>
            <dict-definition-type>verb</dict-definition-type>
          </dict-definition>
          <dict-definition definition="What's up">
            <dict-definition-type>noun</dict-definition-type>
          </dict-definition>
          <dict-definition definition="How is it going">
            <dict-definition-type>noun</dict-definition-type>
          </dict-definition>
        </dict-entry>
      `);
    }

    return html`<div class="component">
      ${definitions}
    </div>`;
  }
}
