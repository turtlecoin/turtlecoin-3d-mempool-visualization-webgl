import * as BABYLON from 'babylonjs';
import { dropBall, dropBlock } from './actions';
import { blockchain } from './App';

export function setEvents(element: HTMLElement, scene: BABYLON.Scene) {
  blockchain.on('newTopBlock', (block) => {
    const { block_size } = block;
    const blockSize = block_size / 5000 < 10 ? 10 : block_size / 5000;
    dropBlock(scene, blockSize, block);
  });

  blockchain.on('newTransaction', (transaction) => {
    const { size } = transaction;

    let color: string = '#F4F7BE';

    if (0 < size && size <= 1000) {
      color = '#F4F7BE';
    } else if (1000 < size && size <= 5000) {
      color = '#E5F77D';
    } else if (5000 < size && size <= 10000) {
      color = '#DEBA6F';
    } else if (10000 < size && size <= 20000) {
      color = '#823038';
    } else if (20000 < size && size <= 40000) {
      color = '#1E000E';
    } else {
      color = '#1B1725';
    }

    const ballSize = size / 5000 < 1 ? 1 : size / 5000;

    dropBall(scene, ballSize, color, transaction);
  });
}

const CONTROLLER_DIRECTION = new BABYLON.Vector3(0, 0, -1);
