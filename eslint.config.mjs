import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

import noClientProcessEnv from "./tooling/eslint/rules/no-client-process-env.mjs";
import noDangerousHtml from "./tooling/eslint/rules/no-dangerous-html.mjs";
import noInlineStyle from "./tooling/eslint/rules/no-inline-style.mjs";
import noInlineSvg from "./tooling/eslint/rules/no-inline-svg.mjs";
import noUseClientOutsideClientFiles from "./tooling/eslint/rules/no-use-client-outside-client-files.mjs";
import sectionIndexExports from "./tooling/eslint/rules/section-index-exports.mjs";
import tokenFirstTailwind, {
  preferTailwindScale,
} from "./tooling/eslint/rules/token-first-tailwind.mjs";

const seedRules = {
  rules: {
    "no-client-process-env": noClientProcessEnv,
    "no-dangerous-html": noDangerousHtml,
    "no-inline-style": noInlineStyle,
    "no-inline-svg": noInlineSvg,
    "no-use-client-outside-client-files": noUseClientOutsideClientFiles,
    "prefer-tailwind-scale": preferTailwindScale,
    "section-index-exports": sectionIndexExports,
    "token-first-tailwind": tokenFirstTailwind,
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      seed: seedRules,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      "seed/no-client-process-env": "error",
      "seed/no-dangerous-html": "error",
      "seed/no-inline-style": "error",
      "seed/no-inline-svg": "error",
      "seed/no-use-client-outside-client-files": "error",
      "seed/prefer-tailwind-scale": "warn",
      "seed/section-index-exports": "error",
      "seed/token-first-tailwind": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent worktrees checked out inside the repo carry their own copies.
    ".claude/**",
  ]),
]);

export default eslintConfig;
