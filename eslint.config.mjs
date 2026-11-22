import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      // Plain <script> tags, not ES modules: functions are shared through the global scope
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Browser script that also exports its helpers to Node so Jest can require() it
    files: ["public/js/colorUtils.js"],
    languageOptions: {
      globals: {
        ...globals.commonjs,
      },
    },
  },
  {
    // Jest test files run in Node, with Jest's describe/test/expect globals
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    // Third-party library (blueimp JavaScript-MD5), kept unmodified.
    // Its UMD wrapper also checks for CommonJS `module`, and it carries its own
    // eslint-disable comment for a rule we don't enable.
    files: ["public/js/md5.js"],
    languageOptions: {
      globals: {
        ...globals.commonjs,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
];
