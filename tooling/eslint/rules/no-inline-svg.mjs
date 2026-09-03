const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow inline SVG outside generated icon components.",
    },
    schema: [],
  },
  create(context) {
    const filename = normalizePath(getFilename(context));

    if (filename.includes("/src/icons/generated/")) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        if (node.name?.type !== "JSXIdentifier" || node.name.name !== "svg") {
          return;
        }

        context.report({
          node,
          message:
            "Do not inline SVG in application code. Add SVG sources to src/icons/source and run npm run icons:generate.",
        });
      },
    };
  },
};

export default rule;

function getFilename(context) {
  return context.filename ?? context.getFilename();
}

function normalizePath(path) {
  return path.replaceAll("\\", "/");
}
