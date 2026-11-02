import './styles/main.css';
import { Board } from './core/types';
import { PieceInspector } from './ui/PieceInspector';
import { SetupScreen } from './ui/SetupScreen';
import { CurtainScreen } from './ui/CurtainScreen';
import { MatchScreen } from './ui/MatchScreen';

class GameController {
  private appContainer: HTMLElement;
  private inspector: PieceInspector;
  private setupScreen: SetupScreen;
  private curtainScreen: CurtainScreen;
  private matchScreen: MatchScreen;

  private whiteArmy: Board | null = null;
  private blackArmy: Board | null = null;

  constructor() {
    this.appContainer = document.getElementById('app')!;
    this.inspector = new PieceInspector();
    this.setupScreen = new SetupScreen(this.inspector);
    this.curtainScreen = new CurtainScreen();
    this.matchScreen = new MatchScreen(this.inspector);

    // Append views
    this.appContainer.appendChild(this.setupScreen.getElement());
    this.appContainer.appendChild(this.curtainScreen.getElement());
    this.appContainer.appendChild(this.matchScreen.getElement());

    this.startPhase1();
  }

  // Phase 1: Player 1 Setup
  private startPhase1(): void {
    this.matchScreen.getElement().classList.add('hidden');
    this.curtainScreen.hide();
    this.setupScreen.getElement().classList.remove('hidden');

    this.setupScreen.startSetup('white', (army) => {
      this.whiteArmy = army;
      this.startCurtainPhase();
    });
  }

  // Phase 2: Privacy Curtain
  private startCurtainPhase(): void {
    this.setupScreen.getElement().classList.add('hidden');
    this.curtainScreen.show(() => {
      this.startPhase2();
    });
  }

  // Phase 3: Player 2 Setup
  private startPhase2(): void {
    this.setupScreen.getElement().classList.remove('hidden');
    this.setupScreen.startSetup('black', (army) => {
      this.blackArmy = army;
      this.startMatchPhase();
    });
  }

  // Phase 4: Match Reveal & Gameplay
  private startMatchPhase(): void {
    if (!this.whiteArmy || !this.blackArmy) return;

    this.setupScreen.getElement().classList.add('hidden');
    this.curtainScreen.hide();
    this.matchScreen.getElement().classList.remove('hidden');

    this.matchScreen.startMatch(
      this.whiteArmy,
      this.blackArmy,
      // Rematch with same armies
      () => this.startMatchPhase(),
      // New army setup
      () => this.startPhase1()
    );
  }
}

// Initialize on DOM load (or immediately if DOM is already ready)
function bootstrap(): void {
  new GameController();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

