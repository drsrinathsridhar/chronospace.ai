const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Allow inline style props only for CSS custom properties outside Motion components.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== "style") {
          return;
        }

        if (isMotionElement(node.parent?.name)) {
          return;
        }

        if (isCssVariableObject(node.value)) {
          return;
        }

        context.report({
          node,
          message:
            "Inline styles are allowed only for CSS custom properties such as { '--card-width': width }. Use Tailwind tokens or section CSS for regular CSS properties.",
        });
      },
    };
  },
};

export default rule;

function isMotionElement(name) {
  return (
    name?.type === "JSXMemberExpression" &&
    name.object?.type === "JSXIdentifier" &&
    name.object.name === "motion"
  );
}

function isCssVariableObject(value) {
  const expression = unwrapExpression(value?.expression);

  if (expression?.type !== "ObjectExpression") {
    return false;
  }

  return expression.properties.every((property) => {
    if (property.type !== "Property") {
      return false;
    }

    return getStaticKeyName(property.key)?.startsWith("--") ?? false;
  });
}

function unwrapExpression(expression) {
  let current = expression;

  while (
    current?.type === "TSAsExpression" ||
    current?.type === "TSSatisfiesExpression" ||
    current?.type === "TSTypeAssertion" ||
    current?.type === "TSNonNullExpression"
  ) {
    current = current.expression;
  }

  return current;
}

function getStaticKeyName(key) {
  if (key.type === "Identifier") {
    return key.name;
  }

  if (key.type === "Literal" && typeof key.value === "string") {
    return key.value;
  }

  return null;
}
