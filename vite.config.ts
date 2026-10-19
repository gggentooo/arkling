import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [svelte()],
  resolve: {
    alias: {
      // path-browserify shim for Node's `path` module used by kuromoji internals
      path: 'path-browserify',
      // Replace legacy zlibjs IIFE (crashes under Vite ESM strict mode) with an
      // fflate-backed shim that exposes the same { Zlib: { Gunzip } } interface.
      'zlibjs/bin/gunzip.min.js': resolve(import.meta.dirname, 'src/lib/annotations/gunzip-shim.js'),
    },
  },
})
