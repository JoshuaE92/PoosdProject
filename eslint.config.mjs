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
