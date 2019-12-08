import { BlockchainMonitor } from './BlockchainMonitor';
import { createScene } from './createScene';
import { setEvents } from './setEvents';
import { SoundManager } from './SoundManager';

export const blockchain = new BlockchainMonitor();
export const soundManager = new SoundManager();

export class App {
  constructor(private rootElement: HTMLCanvasElement) {}

  public getCanvas(): HTMLCanvasElement {
    return this.rootElement;
  }

  public run() {
    const engine = new BABYLON.Engine(this.rootElement, true, {
      stencil: true,
    });
    const scene = createScene(engine, this.getCanvas());

    setEvents(this.rootElement, scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }
}
