import { EventEmitter } from 'events';
import request from 'request';

export class BlockchainMonitor extends EventEmitter {
  private mempool: any[];
  private mempoolTxCount: number = 0;
  private mempoolSize: number = 0;
  private topBlock: any;
  private emittedTransactions: string[];
  private averageFee: number = 0;

  constructor() {
    super();
    this.mempool = [];
    this.emittedTransactions = [];
    this.topBlock = { height: 0 };
    this.requestMempool = this.requestMempool.bind(this);
    this.handleNewMempool = this.handleNewMempool.bind(this);
    this.setMempool = this.setMempool.bind(this);
    this.requestTopBlock = this.requestTopBlock.bind(this);
    this.handleNewTopBlock = this.handleNewTopBlock.bind(this);
    this.requestTopBlock();
    this.requestMempool();
    setInterval(this.requestTopBlock, 1000);
    setInterval(this.requestMempool, 1000);
    this.setMaxListeners(1000);
  }

  public getAverageFee(): number {
    return this.averageFee;
  }

  public getBlockHeight(): number {
    return this.topBlock.height;
  }

  public getMempoolSize(): number {
    return this.mempoolSize;
  }

  public getMempoolTxCount(): number {
    return this.mempoolTxCount;
  }

  private setAverageFee(pAverage: number) {
    this.averageFee = pAverage;
  }

  private requestMempool(): void {
    const options = {
      body: {
        jsonrpc: '2.0',
        method: 'f_on_transactions_pool_json',
        params: {},
      },
      headers: { 'content-type': 'application/json' },
      json: true,
      method: 'POST',
      url: 'http://45.32.138.7:42069/json_rpc',
    };

    request(options, this.handleNewMempool);
  }

  private async handleNewMempool(
    error: any,
    response: any,
    body: any
  ): Promise<void> {
    if (error) {
      console.error(error);
    } else {
      const newMempool: any[] = body.result.transactions;

      const oldMempoolHashes = this.mempool.map((transaction: any) => {
        return transaction.hash;
      });

      const newMempoolHashes = newMempool.map((transaction: any) => {
        return transaction.hash;
      });

      let newMempoolSize: number = 0;
      let newFeeTotal: number = 0;

      newMempool.forEach((transaction: any) => {
        const { hash, size, fee } = transaction;
        newMempoolSize += size;
        newFeeTotal += fee / (size / 1024);
        if (!this.emittedTransactions.includes(hash)) {
          console.log(`transaction ${hash} added to pool, size ${size}`);
          this.emit('newTransaction', transaction);
          this.emittedTransactions.push(hash);
          if (this.emittedTransactions.length > 3000) {
            this.emittedTransactions.shift();
          }
        }
      });

      // don't divide by zero
      const averageFee =
        newMempoolSize === 0 ? 0 : newFeeTotal / newMempoolSize;
      this.setAverageFee(averageFee);
      this.setMempoolSize(newMempoolSize);

      oldMempoolHashes.forEach((hash: string) => {
        if (!newMempoolHashes.includes(hash)) {
          console.log(`transaction ${hash} removed from pool`);
          this.emit('txRemovedFromPool', hash);
        }
      });

      this.setMempool(newMempool);
      this.setMempoolTxCount(newMempool.length);
    }
  }

  private setMempoolSize(pSize: number): void {
    this.mempoolSize = pSize;
  }

  private setMempoolTxCount(pSize: number): void {
    this.mempoolTxCount = pSize;
  }

  private setMempool(pMempool: any[]): void {
    this.mempool = pMempool;
    this.emit('newMempool');
  }

  private requestTopBlock(): void {
    const options = {
      body: { jsonrpc: '2.0', method: 'getlastblockheader', params: {} },
      headers: { 'content-type': 'application/json' },
      json: true,
      method: 'POST',
      url: 'http://45.32.138.7:42069/json_rpc',
    };

    request(options, this.handleNewTopBlock);
  }

  private handleNewTopBlock(error: any, response: any, body: any): void {
    if (error) {
      console.error(error);
    } else {
      this.setTopBlock(body.result.block_header);
    }
  }

  private setTopBlock(pTopBlock: any): void {
    if (this.topBlock.height < pTopBlock.height) {
      this.topBlock = pTopBlock;
      this.emit('newTopBlock', this.topBlock);
      console.log(
        `New top block: ${this.topBlock.height}, size: ${this.topBlock.block_size}`
      );
    }
  }
}
