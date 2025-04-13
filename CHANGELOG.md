# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - YYYY-MM-DD

*(Changes for the next release go here)*

## [2.3.0] - YYYY-MM-DD

*(Assuming the next release is 2.3.0 - adjust version and date)*

### Added

*   Project migrated to **TypeScript**.
*   Added built-in type definitions (`.d.ts`) distributed with the package.
*   Added **ES Module** (`dist/modulator.esm.js`) and **UMD** (`dist/modulator.umd.js`) build outputs alongside existing CommonJS (`.cjs`) and AMD (`.amd.js`).
*   Added **Source Maps** (`.map`) for all build outputs.
*   Added `.npmignore` to control published files.
*   Added `.editorconfig` for consistent coding style.
*   Added `engines` field to `package.json` specifying minimum Node.js version.
*   Added `typecheck` script to `package.json`.

### Changed

*   **BREAKING CHANGE:** The debounced function now **always returns a Promise**. This promise resolves with the result of the original function or rejects if the original function throws/rejects or if `.cancel()` is called.
*   **BREAKING CHANGE:** Removed the `debounced.result()` method. Use the returned Promise to get the result.
*   Build process now uses TypeScript (`ts-loader`, `tsconfig.json`).
*   Testing framework switched to `ts-jest`.
*   Updated test suite to align with Promise-based API and TypeScript.
*   Refined cache implementation (eviction logic, Promise handling).
*   Refined error propagation (sync/async errors now consistently reject the Promise).
*   Refined `.cancel()` method to reject the pending Promise.
*   Refined `maxWait` logic implementation.
*   Updated `package.json` entry points (`main`, `module`, `browser`, `types`) and `files` list.
*   Removed top-level `index.js` wrapper; builds now use `src/index.ts` directly.

### Removed

*   **BREAKING CHANGE:** Removed the `debounced.result()` method.
*   Removed top-level `index.js` wrapper file.
*   Removed `esbuild-jest` dependency (replaced by `ts-jest`).

## [2.2.0] - YYYY-MM-DD

*(Add previous release notes here if available)*
*   Updated dependencies.
*   Added Git tagging to release scripts.
*   Updated build configuration filenames (`.cjs`).

*(... previous versions ...)* 