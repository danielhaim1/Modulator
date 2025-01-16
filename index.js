import { modulate } from './src/index.js';

const Modulator = { modulate };

// ----------------------------------------------------
// Exports for various environments
// ----------------------------------------------------

// 1.1. Export for Node.js (CommonJS) environment
if (typeof module === 'object' && module.exports) {
  module.exports = Modulator;
}

// 1.2. Export for AMD environment
if (typeof define === 'function' && define.amd) {
  define('Modulator', [], () => Modulator);
}

// 1.3. Export as a global for the web/browser environment
if (typeof window === 'object') {
  window.Modulator = Modulator;
}

// ----------------------------------------------------
// 2. ES Module Export
// ----------------------------------------------------

export default Modulator;
export { modulate };
