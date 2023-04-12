import { modulate } from './src/Modulator.js';

// If the module is being used in a Node environment
if ( typeof module === 'object' && module.exports ) {
	module.exports = { modulate };
}

// If the module is being used in a web environment
if ( typeof window === 'object' ) {
	window.modulate = modulate;
}
