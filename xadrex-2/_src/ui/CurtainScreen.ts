export class CurtainScreen {
  private element: HTMLElement;
  private onReadyCallback: () => void = () => {};

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'curtain-container hidden';
    this.element.innerHTML = `
      <div class="curtain-card">
        <div class="curtain-emblem">🐱 🎭 🐾</div>
        <h2>Zona Secreta de Privacidade</h2>
        <p class="curtain-message">
          Passe o mouse / tablet para o <strong>Jogador 2</strong>!
        </p>
        <p class="curtain-hint">
          Nenhuma formação do Jogador 1 será visível. O Jogador 2 montará seu exército às cegas antes da revelação simultânea.
        </p>
        <button class="btn btn-primary btn-large curtain-btn" id="curtain-proceed-btn">
          Estou Pronto! Iniciar Montagem do Jogador 2 ➔
        </button>
      </div>
    `;

    const btn = this.element.querySelector('#curtain-proceed-btn')!;
    btn.addEventListener('click', () => {
      this.hide();
      this.onReadyCallback();
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public show(onReady: () => void): void {
    this.onReadyCallback = onReady;
    this.element.classList.remove('hidden');
  }

  public hide(): void {
    this.element.classList.add('hidden');
  }
}
