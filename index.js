import { modulate } from './src/index.js';

const Modulator = { modulate };

// Export for Node.js environment
if (typeof module === 'object' && module.exports) {
    module.exports = Modulator;
}

// Export for AMD environment
if (typeof define === 'function' && define.amd) {
    define('Modulator', [], () => Modulator);
}

// Export for web environment
if (typeof window === 'object') {
    window.Modulator = Modulator;
}