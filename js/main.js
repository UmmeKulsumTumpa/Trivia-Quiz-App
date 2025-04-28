import { App } from './app.js';
import { UI } from './ui.js';

const app = new App();

UI.startBtn.addEventListener('click', () => app.start());
UI.restartBtn.addEventListener('click', () => window.location.reload());
