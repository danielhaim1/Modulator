module.exports = {
  // Specifies the ESLint parser for TypeScript
  parser: '@typescript-eslint/parser',
  // Specifies the ESLint configuration extends
  extends: [
    'airbnb-base', // Uses the base rules from Airbnb (no React)
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    // Consider adding 'plugin:import/typescript' if you face issues with import resolution
  ],
  // Specifies the plugins required
  plugins: [
    '@typescript-eslint', // Plugin for TypeScript rules
    'import', // Plugin for ES6+ import/export syntax
  ],
  // Defines global variables that are predefined
  env: {
    browser: true, // Defines browser global variables like 'window'
    es2021: true, // Enables ES2021 globals and syntax
    node: true, // Defines Node.js global variables and Node.js scoping
    jest: true, // Defines Jest global variables like 'describe', 'test'
  },
  // Defines project-specific settings
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'], // Help 'eslint-plugin-import' resolve TS files
      },
      // Add typescript resolver if node resolver isn't enough (requires eslint-import-resolver-typescript)
      // typescript: {},
    },
  },
  // Defines parsing options
  parserOptions: {
    ecmaVersion: 'latest', // Use the latest ECMAScript standard
    sourceType: 'module', // Allows for the use of imports
  },
  // Defines custom rules or overrides
  rules: {
    // --- Airbnb Overrides & TS Compatibility ---
    'import/extensions': [ // Allow importing .ts files without extension
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'no-unused-vars': 'off', // Disable base rule; @typescript-eslint/no-unused-vars handles it
    '@typescript-eslint/no-unused-vars': ['warn', { // Warn on unused vars (less strict than error)
      argsIgnorePattern: '^_', // Allow unused args starting with _
      varsIgnorePattern: '^_', // Allow unused vars starting with _
      caughtErrorsIgnorePattern: '^_', // Allow unused caught errors starting with _
    }],
    'no-shadow': 'off', // Disable base rule; @typescript-eslint/no-shadow handles it better
    '@typescript-eslint/no-shadow': ['error'],
    'import/prefer-default-export': 'off', // Allow named exports (often preferred in TS)
    'no-underscore-dangle': 'off', // Allow dangling underscores (common convention)

    // --- Personal Preferences / Common Adjustments (Optional) ---
    'max-len': ['warn', { code: 120, ignoreComments: true, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }], // Warn on lines > 120 chars
    'no-console': 'warn', // Warn about console.log statements
    'no-plusplus': 'off', // Allow ++ and -- operators
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }], // Allow single-line class members without blank lines

    // Add any other specific rule overrides here
  },
  // Specifies files and directories to ignore
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'docs/_site/', // Ignore Jekyll build output
    '*.cjs', // Ignore CommonJS config files like this one, webpack.config, etc.
    '*.js', // Ignore plain JS files if project is fully TS (adjust if needed)
  ],
}; 