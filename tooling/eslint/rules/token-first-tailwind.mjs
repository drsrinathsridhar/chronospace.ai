const arbitraryColorAndTypographyPrefixes = [
  "bg",
  "text",
  "from",
  "via",
  "to",
  "fill",
  "stroke",
  "accent",
  "caret",
  "placeholder",
  "font",
  "leading",
  "tracking",
];

const arbitraryColorPrefixes = [
  "border",
  "decoration",
  "divide",
  "outline",
  "ring",
];

const arbitraryScalePrefixes = [
  "shadow",
  "rounded",
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "gap",
  "space-x",
  "space-y",
  "size",
  "w",
  "h",
  "min-w",
  "min-h",
  "max-w",
  "max-h",
];

const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow arbitrary Tailwind values for color and typography decisions.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== "className") {
          return;
        }

        for (const className of getStaticClassNames(node.value)) {
          const baseClass = getBaseClassName(className);

          if (!isForbiddenColorOrTypographyClass(baseClass)) {
            continue;
          }

          context.report({
            node,
            message: `Avoid arbitrary Tailwind value "${className}". Use existing color or typography tokens.`,
          });
        }
      },
    };
  },
};

export default rule;

export const preferTailwindScale = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer Tailwind scale utilities over simple arbitrary layout values.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== "className") {
          return;
        }

        for (const className of getStaticClassNames(node.value)) {
          const baseClass = getBaseClassName(className);

          if (!isArbitraryScaleClass(baseClass)) {
            continue;
          }

          context.report({
            node,
            message: `Prefer Tailwind numeric spacing-scale utilities over "${className}" when possible, such as w-25 instead of w-[100px].`,
          });
        }
      },
    };
  },
};

function getStaticClassNames(value) {
  if (!value) {
    return [];
  }

  if (value.type === "Literal" && typeof value.value === "string") {
    return value.value.split(/\s+/).filter(Boolean);
  }

  if (
    value.type === "JSXExpressionContainer" &&
    value.expression?.type === "Literal" &&
    typeof value.expression.value === "string"
  ) {
    return value.expression.value.split(/\s+/).filter(Boolean);
  }

  if (
    value.type === "JSXExpressionContainer" &&
    value.expression?.type === "TemplateLiteral" &&
    value.expression.expressions.length === 0
  ) {
    return value.expression.quasis[0].value.raw.split(/\s+/).filter(Boolean);
  }

  return [];
}

function getBaseClassName(className) {
  let bracketDepth = 0;

  for (let index = className.length - 1; index >= 0; index--) {
    const char = className[index];

    if (char === "]") {
      bracketDepth++;
      continue;
    }

    if (char === "[") {
      bracketDepth--;
      continue;
    }

    if (char === ":" && bracketDepth === 0) {
      return className.slice(index + 1);
    }
  }

  return className;
}

function isForbiddenColorOrTypographyClass(className) {
  if (!className.includes("-[")) {
    return false;
  }

  if (
    arbitraryColorAndTypographyPrefixes.some((prefix) =>
      isClassWithPrefix(className, prefix),
    )
  ) {
    return true;
  }

  const arbitraryValue = getArbitraryValue(className);

  return arbitraryColorPrefixes.some(
    (prefix) =>
      isClassWithPrefix(className, prefix) &&
      isColorLikeArbitraryValue(arbitraryValue),
  );
}

function isArbitraryScaleClass(className) {
  if (!className.includes("-[")) {
    return false;
  }

  const arbitraryValue = getArbitraryValue(className);

  if (isStructuralEscapeHatch(arbitraryValue)) {
    return false;
  }

  return arbitraryScalePrefixes.some((prefix) =>
    isClassWithPrefix(className, prefix),
  );
}

function getArbitraryValue(className) {
  const start = className.indexOf("-[");

  if (start === -1) {
    return null;
  }

  const end = className.indexOf("]", start + 2);

  if (end === -1) {
    return null;
  }

  return className.slice(start + 2, end);
}

function isClassWithPrefix(className, prefix) {
  const normalizedClassName = className.startsWith("-")
    ? className.slice(1)
    : className;

  return normalizedClassName.startsWith(`${prefix}-[`);
}

function isColorLikeArbitraryValue(value) {
  return /^(#|rgb\(|rgba\(|hsl\(|hsla\(|oklab\(|oklch\(|lab\(|lch\(|color\(|color-mix\(|light-dark\()/i.test(
    value ?? "",
  );
}

function isStructuralEscapeHatch(value) {
  return /(var\(|calc\(|min\(|max\(|clamp\(|env\()/i.test(value ?? "");
}
