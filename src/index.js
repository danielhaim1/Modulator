import { modulate } from './eventModulator.js';

export { modulate };

if (typeof window === 'object') {
  window.modulate = modulate;
}
