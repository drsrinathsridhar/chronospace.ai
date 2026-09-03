const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow private process.env reads in client islands.",
    },
    schema: [],
  },
  create(context) {
    const filename = getFilename(context);

    if (!filename.endsWith(".client.tsx")) {
      return {};
    }

    return {
      MemberExpression(node) {
        if (!isProcessEnvAccess(node.object)) {
          return;
        }

        const name = getPropertyName(node);

        if (name === "NODE_ENV" || name?.startsWith("NEXT_PUBLIC_")) {
          return;
        }

        context.report({
          node,
          message:
            "Client components may read only NODE_ENV or NEXT_PUBLIC_* environment variables.",
        });
      },
    };
  },
};

export default rule;

function getFilename(context) {
  return context.filename ?? context.getFilename();
}

function isProcessEnvAccess(node) {
  return (
    node?.type === "MemberExpression" &&
    node.object?.type === "Identifier" &&
    node.object.name === "process" &&
    node.property?.type === "Identifier" &&
    node.property.name === "env"
  );
}

function getPropertyName(node) {
  if (node.property?.type === "Identifier") {
    return node.property.name;
  }

  if (node.property?.type === "Literal") {
    return String(node.property.value);
  }

  return undefined;
}
