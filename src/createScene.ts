import * as BABYLON from 'babylonjs';
import { blockchain, soundManager } from './App';
import { createSkybox } from './createSkybox';
import { numberWithCommas } from './utils';

export function createScene(
  engine: BABYLON.Engine,
  canvas: HTMLCanvasElement
): BABYLON.Scene {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color4.FromHexString('#000000ff');

  scene.collisionsEnabled = true;

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 4,
    1.1,
    80,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.target = BABYLON.Vector3.Zero();
  camera.attachControl(canvas, true);
  scene.setActiveCameraByName('camera');

  const skyboxMesh = createSkybox(scene);
  const groundMesh = BABYLON.Mesh.CreateGround('ground', 80, 80, 2, scene);

  const lights = [
    new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(500, 100, 80),
      scene
    ),
  ];

  scene.enablePhysics(
    new BABYLON.Vector3(0, -9.81, 0),
    new BABYLON.OimoJSPlugin()
  );

  const keyBox = document.createElement('div');
  keyBox.className =
    'box has-background-black is-translucent has-text-white keyBox has-text-left';
  keyBox.id = 'keybox';
  document.body.appendChild(keyBox);

  const keyColor1 = document.createElement('div');
  keyColor1.className = 'keyColor white';
  keyBox.appendChild(keyColor1);

  const key1 = document.createElement('p');
  key1.textContent = '0 - 1000 bytes';
  keyBox.appendChild(key1);

  const keyColor2 = document.createElement('div');
  keyColor2.className = 'keyColor yellow';
  keyBox.appendChild(keyColor2);

  const key2 = document.createElement('p');
  key2.textContent = '1001-5000 bytes';
  keyBox.appendChild(key2);

  const keyColor3 = document.createElement('div');
  keyColor3.className = 'keyColor orange';
  keyBox.appendChild(keyColor3);

  const key3 = document.createElement('p');
  key3.textContent = '5001-10000 bytes';
  keyBox.appendChild(key3);

  const keyColor4 = document.createElement('div');
  keyColor4.className = 'keyColor brown';
  keyBox.appendChild(keyColor4);

  const key4 = document.createElement('p');
  key4.textContent = '10001-20000 bytes';
  keyBox.appendChild(key4);

  const keyColor5 = document.createElement('div');
  keyColor5.className = 'keyColor purple';
  keyBox.appendChild(keyColor5);

  const key5 = document.createElement('p');
  key5.textContent = '20001-40000 bytes';
  keyBox.appendChild(key5);

  const keyColor6 = document.createElement('div');
  keyColor6.className = 'keyColor black';
  keyBox.appendChild(keyColor6);

  const key6 = document.createElement('p');
  key6.textContent = '40001+ bytes';
  keyBox.appendChild(key6);

  // add buttons
  const statsBox = document.createElement('div');
  statsBox.className =
    'box has-background-black is-translucent has-text-white statsBox';
  statsBox.id = 'buttonbox';
  document.body.appendChild(statsBox);

  const statsTitle = document.createElement('p');
  statsTitle.className = 'title has-text-white';
  statsTitle.textContent = 'TurtleCoin Memory Pool';
  statsBox.appendChild(statsTitle);

  const statsNextBlock = document.createElement('p');
  statsNextBlock.textContent =
    'Next Height: ' + numberWithCommas(blockchain.getBlockHeight() + 1);
  statsBox.append(statsNextBlock);

  const statsTransactionCount = document.createElement('p');
  statsTransactionCount.textContent =
    'Transactions: ' + numberWithCommas(blockchain.getMempoolTxCount());
  statsBox.appendChild(statsTransactionCount);

  const statsSize = document.createElement('p');
  statsSize.textContent =
    'Size: ' + numberWithCommas(blockchain.getMempoolSize()) + ' bytes';
  statsBox.appendChild(statsSize);

  const statsAvgFee = document.createElement('p');
  statsAvgFee.textContent =
    'Average Fee: ' + blockchain.getAverageFee().toFixed(8) + ' shells / kB';
  statsBox.append(statsAvgFee);

  const lineBreak = document.createElement('br');
  statsBox.appendChild(lineBreak);

  const volumeIcon = document.createElement('i');
  volumeIcon.id = 'volume-on-icon';
  volumeIcon.className = 'fas fa-volume-mute';

  const soundButton = document.createElement('button');
  soundButton.className = 'button is-black';
  soundButton.textContent = '';
  soundButton.onclick = () => {
    const enabled = soundManager.getSoundEnabled();
    soundManager.setSoundEnabled(!enabled);

    if (enabled) {
      volumeIcon.className = 'fas fa-volume-mute';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  };

  statsBox.appendChild(soundButton);
  soundButton.appendChild(volumeIcon);

  blockchain.on('newTransaction', setStats);
  blockchain.on('txRemovedFromPool', setStats);
  blockchain.on('newTopBlock', setStats);
  blockchain.on('newMempool', setStats);

  function setStats() {
    statsTransactionCount.textContent =
      'Transactions: ' + numberWithCommas(blockchain.getMempoolTxCount());
    statsSize.textContent =
      'Size: ' + numberWithCommas(blockchain.getMempoolSize()) + ' bytes';
    statsNextBlock.textContent =
      'Next Height: ' + numberWithCommas(blockchain.getBlockHeight() + 1);
    statsAvgFee.textContent =
      'Average Fee: ' + blockchain.getAverageFee().toFixed(8) + ' shells / kB';
  }

  groundMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
    groundMesh,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {
      friction: 0.5,
      mass: 0,
      nativeOptions: {
        move: true,
        noSleep: true,
      },
      restitution: 0.5,
    }
  );

  return scene;
}
