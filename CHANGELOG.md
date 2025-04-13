# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - YYYY-MM-DD

*(Changes for the next release go here)*

## [2.3.0] - 2024-08-13

*(Adjust date as needed)*

### Added

*   Project migrated to **TypeScript**.
*   Added built-in type definitions (`.d.ts`) distributed with the package.
*   Added **ES Module** (`dist/modulator.esm.js`) and **UMD** (`dist/modulator.umd.js`) build outputs alongside existing CommonJS (`.cjs`) and AMD (`.amd.js`).
*   Added **Source Maps** (`.map`) for all build outputs.
*   Added **ESLint** configuration (`.eslintrc.cjs`) for TypeScript using `@typescript-eslint` plugins and extending `airbnb-base`. Added `lint` scripts.
*   Added GitHub Actions workflow (`build-dist.yml`) for package CI (type check, test, build, artifact upload).
*   Added GitHub Actions workflow (`build-docs.yml`) specifically for documentation site deployment.
*   Added `.npmignore` to control published files.
*   Added `.editorconfig` for consistent coding style.
*   Added `engines` field to `package.json` specifying minimum Node.js version.
*   Added `typecheck` script to `package.json` and integrated into release scripts.
*   Added `dist/` to `.gitignore`.

### Changed

*   **BREAKING CHANGE:** The debounced function now **always returns a Promise**. This promise resolves with the result of the original function or rejects if the original function throws/rejects or if `.cancel()` is called.
*   Build process now uses TypeScript (`ts-loader`, `tsconfig.json`).
*   Testing framework switched to `ts-jest`.
*   Updated test suite to align with Promise-based API and TypeScript; fixed issues with `immediate: true` test logic.
*   Refined internal logic for handling immediate calls, cooldowns, trailing edges, `maxWait`, caching, and error propagation via Promises.
*   Refined `.cancel()` method to reject the pending Promise.
*   Updated `package.json` entry points (`main`, `module`, `browser`, `types`) and `files` list.
*   Updated GitHub Actions docs workflow (`build-docs.yml`) with correct permissions and steps.
*   Updated `README.md` extensively for TypeScript, Promise API, new build targets, CI badges, and usage examples.
*   Standardized `release:*` script names in `package.json` and added `-m` flag to `npm version`.

### Removed

*   **BREAKING CHANGE:** Removed the `debounced.result()` method.
*   Removed top-level `index.js` wrapper file.
*   Removed all Babel dependencies (`@babel/*`, `babel-loader`, `babel-jest`) as transpilation is now handled by `tsc`.
*   Removed `esbuild-jest` dependency (replaced by `ts-jest`).

## [2.2.0] - YYYY-MM-DD

*(Previous release notes)*
*   Updated dependencies.
*   Added Git tagging to release scripts.
*   Updated build configuration filenames (`.cjs`).

*(... previous versions ...)* 