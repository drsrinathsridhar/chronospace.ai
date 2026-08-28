/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"], // keeps utility order canonical, so diffs stay readable
};

export default config;
