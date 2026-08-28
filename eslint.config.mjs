import next from "eslint-config-next";
import project from "./tooling/eslint/project-rules.mjs";

const eslintConfig = [
  ...(Array.isArray(next) ? next : [next]),
  {
    // The project's own conventions — see AGENTS.md and docs/. These are errors, not suggestions:
    // they are what keeps the design system intact and the client bundle small.
    plugins: { project },
    rules: {
      "project/no-inline-style": "error",
      "project/no-inline-svg": "error",
      "project/no-client-process-env": "error",
      "project/no-use-client-on-routes": "error",
      "project/token-first": "error",
      "project/named-section-exports": "error",
      "project/no-dangerous-html": "error",
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**", ".devlooper/**"] },
];

export default eslintConfig;
