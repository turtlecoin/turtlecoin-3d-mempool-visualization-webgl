import * as BABYLON from 'babylonjs';
import { blockchain, soundManager } from './App';
import { createMaterialColor } from './createMaterial';
import { getRandomFloat, numberWithCommas } from './utils';

export function dropBlock(scene: BABYLON.Scene, size: number, block: any) {
  const boxMesh: BABYLON.AbstractMesh = BABYLON.MeshBuilder.CreateBox(
    'sphere',
    { size },
    scene
  );

  const { block_size, height, hash, num_txes, reward, timestamp } = block;

  let mouseOver = false;

  const onOver = (meshEvent: any) => {
    mouseOver = true;
    const toolTip = document.createElement('div');
    // but.textContent = " ";
    toolTip.setAttribute('id', blockID);
    toolTip.className =
      'box has-background-black is-translucent has-text-white';
    // but.zIndex = 0;
    const sty = toolTip.style;
    sty.position = 'absolute';
    sty.lineHeight = '1.2em';
    sty.top = scene.pointerY + 'px';
    sty.left = scene.pointerX + 'px';
    sty.cursor = 'pointer';
    document.body.appendChild(toolTip);

    const hashText = document.createElement('p');
    hashText.textContent = `Hash: ${hash}`;
    toolTip.appendChild(hashText);

    const sizeText = document.createElement('p');
    sizeText.textContent = `Size: ${numberWithCommas(block_size)} bytes`;
    toolTip.appendChild(sizeText);

    const rewardText = document.createElement('p');
    rewardText.textContent = `Reward: ${numberWithCommas(
      reward / 100,
      2
    )} TRTL`;
    toolTip.appendChild(rewardText);

    const heightText = document.createElement('p');
    heightText.textContent = `Height: ${numberWithCommas(height)}`;
    toolTip.appendChild(heightText);

    const numTxText = document.createElement('p');
    numTxText.textContent = `Transactions: ${numberWithCommas(num_txes)}`;
    toolTip.appendChild(numTxText);

    const timestampText = document.createElement('p');
    const date = new Date();
    date.setSeconds(timestamp);
    timestampText.textContent = `Timestamp: ${date.toUTCString()}`;
    toolTip.appendChild(timestampText);

    const lineBreak = document.createElement('br');
    toolTip.appendChild(lineBreak);

    const explorerButton = document.createElement('a');
    explorerButton.textContent = 'View on Explorer';
    explorerButton.className = 'button is-black';
    explorerButton.href = `https://explorer.turtlecoin.lol/?search=${encodeURIComponent(
      hash
    )}`;

    toolTip.appendChild(explorerButton);
  };

  const blockID = 'block-' + String(height);

  const onOut = (meshEvent: any) => {
    mouseOver = false;
    document
      .getElementById(blockID)!
      .parentNode!.removeChild(document.getElementById(blockID)!);
  };

  const onMove = (positionX: number, positionY: number) => {
    if (mouseOver) {
      const toolTip = document.getElementById(blockID);
      if (toolTip) {
        // set tooltip position
      }
    }
  };

  boxMesh.actionManager = new BABYLON.ActionManager(scene);

  boxMesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      onOut
    )
  );

  boxMesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      onOver
    )
  );

  window.addEventListener('mousemove', () => {
    onMove(scene.pointerX, scene.pointerY);
  });

  const ground = scene.getMeshByName('ground');
  const blockHit = new BABYLON.Sound(
    'newBlock',
    '/assets/sounds/block.wav',
    scene
  );
  blockHit.maxDistance = 300;
  blockHit.attachToMesh(boxMesh);
  scene.registerBeforeRender(function ballContactsGround() {
    const contacts = boxMesh.intersectsMesh(ground!);
    if (contacts) {
      scene.unregisterBeforeRender(ballContactsGround);
      if (soundManager.getSoundEnabled()) {
        blockHit.play();
      }
    }
  });

  boxMesh.position = new BABYLON.Vector3(
    getRandomFloat(-20, 20),
    size + getRandomFloat(5, 10),
    getRandomFloat(-20, 20)
  );
  boxMesh.material = createMaterialColor('#00853d', scene);

  boxMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
    boxMesh,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {
      friction: 0.5,
      mass: 100,
      nativeOptions: {
        move: true,
        noSleep: true,
      },
      restitution: 0.5,
    }
  );
  blockchain.on('newTopBlock', () => {
    if (document.getElementById(blockID)) {
      document
        .getElementById(blockID)!
        .parentNode!.removeChild(document.getElementById(blockID)!);
    }
    boxMesh.dispose(true, true);
  });
}

export function dropBall(
  scene: BABYLON.Scene,
  ballSize: number,
  color: string,
  tx: any
) {
  const { amount_out, fee, hash, size } = tx;
  const sphereMesh = BABYLON.MeshBuilder.CreateSphere(
    'sphere',
    { diameter: ballSize, diameterX: ballSize },
    scene
  );
  let mouseOver = false;
  sphereMesh.position = new BABYLON.Vector3(
    getRandomFloat(-30, 30),
    ballSize + getRandomFloat(10, 20),
    getRandomFloat(-30, 30)
  );
  sphereMesh.material = createMaterialColor(color, scene);

  const onOver = (meshEvent: any) => {
    mouseOver = true;
    const toolTip = document.createElement('div');
    // but.textContent = " ";
    toolTip.setAttribute('id', hash);
    toolTip.className =
      'box has-background-black is-translucent has-text-white';
    // but.zIndex = 0;
    const sty = toolTip.style;
    sty.position = 'absolute';
    sty.lineHeight = '1.2em';
    sty.top = scene.pointerY + 'px';
    sty.left = scene.pointerX + 'px';
    sty.cursor = 'pointer';
    document.body.appendChild(toolTip);

    const hashText = document.createElement('p');
    hashText.textContent = `Hash: ${hash}`;
    toolTip.appendChild(hashText);

    const sizeText = document.createElement('p');
    sizeText.textContent = `Size: ${numberWithCommas(size)} bytes`;
    toolTip.appendChild(sizeText);

    const feeText = document.createElement('p');
    feeText.textContent = `Fee: ${numberWithCommas(fee / 100, 2)} TRTL`;
    toolTip.appendChild(feeText);

    const amountText = document.createElement('p');
    amountText.textContent = `Amount: ${numberWithCommas(
      amount_out / 100,
      2
    )} TRTL`;
    toolTip.appendChild(amountText);
  };

  const onOut = (meshEvent: any) => {
    mouseOver = false;
    document
      .getElementById(hash)!
      .parentNode!.removeChild(document.getElementById(hash)!);
  };

  const onMove = (positionX: number, positionY: number) => {
    if (mouseOver) {
      const toolTip = document.getElementById(hash);
      if (toolTip) {
        console.log(positionX, positionY);
      }
    }
  };

  sphereMesh.actionManager = new BABYLON.ActionManager(scene);

  sphereMesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      onOut
    )
  );

  sphereMesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      onOver
    )
  );

  const ground = scene.getMeshByName('ground');
  const hit0 = new BABYLON.Sound('newBlock', '/assets/sounds/hit0.wav', scene);
  hit0.attachToMesh(sphereMesh);
  hit0.maxDistance = 300;
  scene.registerBeforeRender(function ballContactsGround() {
    const contacts = sphereMesh.intersectsMesh(ground!);
    if (contacts) {
      scene.unregisterBeforeRender(ballContactsGround);
      if (soundManager.getSoundEnabled()) {
        hit0.play();
      }
    }
  });

  sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
    sphereMesh,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {
      friction: 0.5,
      mass: 10,
      nativeOptions: {
        move: true,
        noSleep: true,
      },
      restitution: 0.5,
    }
  );
  blockchain.on('txRemovedFromPool', (removeHash: string) => {
    if (removeHash === hash) {
      sphereMesh.dispose(true, true);
    }
  });
}
