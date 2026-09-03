const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow dangerouslySetInnerHTML in landing pages.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== "dangerouslySetInnerHTML") {
          return;
        }

        context.report({
          node,
          message:
            "Do not use dangerouslySetInnerHTML. Model content explicitly or add a reviewed sanitizer first.",
        });
      },
    };
  },
};

export default rule;
