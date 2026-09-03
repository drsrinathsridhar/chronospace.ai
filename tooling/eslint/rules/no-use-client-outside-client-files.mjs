const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require client components to live in *.client.tsx files.",
    },
    schema: [],
  },
  create(context) {
    const filename = getFilename(context);

    return {
      Program(node) {
        const hasUseClient = node.body.some(
          (statement) =>
            statement.type === "ExpressionStatement" &&
            statement.directive === "use client",
        );

        if (!hasUseClient || filename.endsWith(".client.tsx")) {
          return;
        }

        context.report({
          node,
          message:
            "Use client components only in files named *.client.tsx. Keep pages, layouts, and section roots server-rendered.",
        });
      },
    };
  },
};

export default rule;

function getFilename(context) {
  return context.filename ?? context.getFilename();
}
