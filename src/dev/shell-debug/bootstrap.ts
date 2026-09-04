import { initPreviewWindowMode } from './previewWindowSize';
import './scenarios/commonScenarioPack';
import './scenarios/signingScenarioPack';

initPreviewWindowMode();

export { registerCommonScenarioPack } from './scenarios/commonScenarioPack';
export { registerSigningScenarioPack } from './scenarios/signingScenarioPack';
