import { modulate } from './src/Modulator.js';

// Export for Node.js environment
if ( typeof module === 'object' && module.exports ) {
	module.exports = { modulate };
}

// Export for web environment
if ( typeof window === 'object' ) {
	window.modulate = modulate;
}