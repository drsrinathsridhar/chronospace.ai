const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require section index files to be re-export-only.",
    },
    schema: [],
  },
  create(context) {
    const filename = normalizePath(getFilename(context));
    const match = filename.match(
      /\/src\/app\/(?:.*\/)?sections\/([^/]+)\/index\.ts$/,
    );

    if (!match) {
      return {};
    }

    const sectionName = match[1];
    const expectedSource = `./${sectionName}`;

    return {
      Program(node) {
        if (node.body.length === 0) {
          context.report({
            node,
            message: `Section index files must re-export from ${expectedSource}.`,
          });
          return;
        }

        for (const statement of node.body) {
          const isValidExport =
            statement.type === "ExportNamedDeclaration" &&
            statement.source?.value === expectedSource &&
            statement.declaration === null;

          if (isValidExport) {
            continue;
          }

          context.report({
            node: statement,
            message: `Section index files must only re-export from ${expectedSource}.`,
          });
        }
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
