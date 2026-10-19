/**
 * gunzip-shim.js
 *
 * Provides a `{ Zlib: { Gunzip } }` interface that kuromoji's BrowserDictionaryLoader
 * expects, implemented via fflate instead of the legacy zlibjs package.
 *
 * zlibjs uses an old IIFE pattern that assigns to `this` (was `window` in legacy browsers,
 * but is `undefined` in Vite's strict ESM environment), causing a crash at import time.
 * This shim is aliased over `zlibjs/bin/gunzip.min.js` in vite.config.ts.
 */
import { gunzipSync } from 'fflate';

class Gunzip {
  /**
   * @param {Uint8Array | number[]} input
   */
  constructor(input) {
    this._input = input instanceof Uint8Array ? input : new Uint8Array(input);
  }

  decompress() {
    // Only attempt gunzip if magic bytes match (0x1f 0x8b)
    if (this._input.length >= 2 && this._input[0] === 0x1f && this._input[1] === 0x8b) {
      return gunzipSync(this._input);
    }
    return this._input;
  }
}

export const Zlib = { Gunzip };
export default { Zlib };
