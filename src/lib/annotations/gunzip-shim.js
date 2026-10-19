import { gunzipSync } from 'fflate';

class Gunzip {
  /**
   * @param {Uint8Array | number[]} input
   */
  constructor(input) {
    this._input = input instanceof Uint8Array ? input : new Uint8Array(input);
  }

  decompress() {
    if (this._input.length >= 2 && this._input[0] === 0x1f && this._input[1] === 0x8b) {
      return gunzipSync(this._input);
    }
    return this._input;
  }
}

export const Zlib = { Gunzip };
export default { Zlib };
