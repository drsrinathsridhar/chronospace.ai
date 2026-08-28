// Project lint rules. Each one encodes a convention the whole codebase relies on, so a violation is a
// build failure rather than a review comment. Plain ESLint rule objects - no dependencies.

/** style={{ ... }} defeats the token system and can't be themed. CSS custom properties are allowed,
 *  because a dynamic token value (style={{ '--x': v }}) has no Tailwind equivalent. */
const noInlineStyle = {
  meta: {
    type: "problem",
    docs: {
      description: "Use Tailwind utilities/tokens instead of inline styles",
    },
    schema: [],
  },
  create(ctx) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== "style") return;
        const val = node.value;
        if (
          val?.type !== "JSXExpressionContainer" ||
          val.expression?.type !== "ObjectExpression"
        )
          return;
        const props = val.expression.properties.filter(
          (p) => p.type === "Property",
        );
        const allVars =
          props.length > 0 &&
          props.every((p) => {
            const k =
              p.key?.type === "Literal" ? String(p.key.value) : p.key?.name;
            return typeof k === "string" && k.startsWith("--");
          });
        if (!allVars)
          ctx.report({
            node,
            message:
              "No inline styles - use Tailwind utilities and design tokens (CSS custom properties are allowed).",
          });
      },
    };
  },
};

/** A pasted <svg> is unreviewable, unshareable and bloats the component. Icons belong in the icon
 *  module, imported by name. */
const noInlineSvg = {
  meta: {
    type: "problem",
    docs: { description: "Import icons instead of pasting inline <svg>" },
    schema: [],
  },
  create(ctx) {
    const file = ctx.filename || ctx.getFilename();
    if (/[\\/](icons?|assets)[\\/]/i.test(file)) return {}; // the icon module itself is where SVG lives
    return {
      JSXOpeningElement(node) {
        if (node.name?.type === "JSXIdentifier" && node.name.name === "svg") {
          ctx.report({
            node,
            message:
              "No inline <svg> - put it in the icon module and import it by name.",
          });
        }
      },
    };
  },
};

/** Anything read from process.env in a client component ships to the browser. Only NEXT_PUBLIC_* is
 *  intended to be public; everything else is a leak waiting to happen. */
const noClientProcessEnv = {
  meta: {
    type: "problem",
    docs: { description: "No non-public env vars in client components" },
    schema: [],
  },
  create(ctx) {
    const src = ctx.sourceCode || ctx.getSourceCode();
    const isClient = /^\s*(['"])use client\1/m.test(
      src.getText().slice(0, 200),
    );
    if (!isClient) return {};
    return {
      MemberExpression(node) {
        if (node.object?.type !== "MemberExpression") return;
        if (
          node.object.object?.name !== "process" ||
          node.object.property?.name !== "env"
        )
          return;
        const key = node.property?.name || node.property?.value;
        if (typeof key === "string" && !key.startsWith("NEXT_PUBLIC_")) {
          ctx.report({
            node,
            message: `"${key}" is not NEXT_PUBLIC_ - reading it in a client component leaks it into the browser bundle.`,
          });
        }
      },
    };
  },
};

/** A route entry ('use client' in page.tsx / layout.tsx) turns the whole subtree into a client bundle.
 *  Keep pages server components and push interactivity into small islands. */
const noUseClientOnRoutes = {
  meta: {
    type: "problem",
    docs: { description: "Keep route entries server components" },
    schema: [],
  },
  create(ctx) {
    const file = ctx.filename || ctx.getFilename();
    if (!/[\\/](page|layout|template)\.(t|j)sx?$/.test(file)) return {};
    return {
      Program(node) {
        const first = node.body[0];
        if (
          first?.type === "ExpressionStatement" &&
          first.expression?.value === "use client"
        ) {
          ctx.report({
            node: first,
            message:
              "No 'use client' on a route entry - keep the page a server component and move interactivity into a client island.",
          });
        }
      },
    };
  },
};

/** Arbitrary COLOUR and TYPE values bypass the design system, so the site drifts from its tokens.
 *  Arbitrary LAYOUT values (w-[37px], top-[12px]) stay allowed on purpose: matching a design exactly
 *  matters more than scale purity, and layout has no token to drift from. */
const TOKENISED =
  /^(bg|text|border|ring|fill|stroke|shadow|from|via|to|decoration|outline|divide|accent|caret|placeholder)-\[/;
const COLOURY = /(#[0-9a-f]{3,8}|\b(rgb|hsl|oklch|lab)a?\()/i;
const TYPEY = /^text-\[(\d|\.)+(px|rem|em)\]$/;
const tokenFirst = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Use design tokens for colour and type, not arbitrary values",
    },
    schema: [],
  },
  create(ctx) {
    const check = (node, text) => {
      for (const cls of String(text).split(/\s+/)) {
        const bare = cls.replace(/^[a-z-]+:/i, ""); // drop variants (hover:, md:, …)
        const isColour = TOKENISED.test(bare) && COLOURY.test(bare);
        if (isColour || TYPEY.test(bare)) {
          ctx.report({
            node,
            message: `"${cls}" hardcodes a design-system value - add it as a token in globals.css and use the token utility instead. (Arbitrary LAYOUT values are fine.)`,
          });
        }
      }
    };
    return {
      JSXAttribute(node) {
        if (!/^(className|class)$/.test(node.name?.name || "")) return;
        if (node.value?.type === "Literal") check(node, node.value.value);
        else if (node.value?.type === "JSXExpressionContainer") {
          const e = node.value.expression;
          if (e?.type === "TemplateLiteral")
            for (const q of e.quasis) check(node, q.value.raw);
          if (e?.type === "Literal") check(node, e.value);
        }
      },
    };
  },
};

/** A section must be importable by name, so pages compose `import { Hero } from …` and a rename is a
 *  compile error rather than a silently different component. Default exports make that impossible. */
const namedSectionExports = {
  meta: {
    type: "problem",
    docs: { description: "Sections/components use named exports" },
    schema: [],
  },
  create(ctx) {
    const file = ctx.filename || ctx.getFilename();
    if (
      !/[\\/]components[\\/]/.test(file) ||
      /[\\/](icons?|ui)[\\/]/i.test(file)
    )
      return {};
    return {
      ExportDefaultDeclaration(node) {
        ctx.report({
          node,
          message:
            "Use a named export for a section/component (`export function Hero()`), so pages import it by name.",
        });
      },
    };
  },
};

/** Injecting raw HTML is how content becomes an XSS hole, and a marketing site never needs it.
 *  (Own implementation rather than react/no-danger, so the rule works without registering the whole
 *  React plugin in this flat config.) */
const noDangerousHtml = {
  meta: {
    type: "problem",
    docs: { description: "No dangerouslySetInnerHTML" },
    schema: [],
  },
  create(ctx) {
    return {
      JSXAttribute(node) {
        if (node.name?.name === "dangerouslySetInnerHTML") {
          ctx.report({
            node,
            message:
              "No dangerouslySetInnerHTML - render content as JSX (it is an XSS hole and unreviewable).",
          });
        }
      },
    };
  },
};

const plugin = {
  rules: {
    "no-inline-style": noInlineStyle,
    "no-inline-svg": noInlineSvg,
    "no-client-process-env": noClientProcessEnv,
    "no-use-client-on-routes": noUseClientOnRoutes,
    "token-first": tokenFirst,
    "named-section-exports": namedSectionExports,
    "no-dangerous-html": noDangerousHtml,
  },
};

export default plugin;
