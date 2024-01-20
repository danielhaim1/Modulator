import { modulate } from './src/index.js';

// Export for Node.js environment
if (typeof module === 'object' && module.exports) {
  module.exports = { modulate };
}

// Export for web environment
if (typeof window === 'object') {
  window.modulate = modulate;
}
