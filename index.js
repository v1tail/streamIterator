const Stream = require('stream');

module.exports = class StreamIterator {
  constructor(
      {
        stream,
        handler,
        separator
      }
  ) {

    if (!(stream instanceof Stream)) throw new Error('stream should be instanceof Node.js Stream');
    if (!(handler instanceof Function)) throw new Error('handler should be a function');

    this.stdin = stream;
    this.handler = handler;
    this.separator = `${separator}`;
    this.cache = '';
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.stdin.on('error', (err) => {
        this.onError(err);
        reject(err)
      });

      this.stdin.on('data', async (chunk) => {
        return this.onData(chunk)
      });

      this.stdin.on('close', () => {
        resolve()
      })
    })

  }

  onData(chunk) {

    const syncedDataPiece = this.syncChunkWithCache(chunk);

    const isFull = syncedDataPiece.endsWith(this.separator);

    const records = syncedDataPiece.split(this.separator);

    if (!isFull) this.cacheExtraPieceUntilNextIteration(records.pop());

    return Promise.all(
        records.map(async (record) => {
          this.handler(record)
        })
    )
  }

  syncChunkWithCache(chunk) {
    return this.cache + chunk
  }

  cacheExtraPieceUntilNextIteration(piece) {
    this.cache = piece
  }

  onError(err) {
    console.error('error occurred', err)
  }
};
