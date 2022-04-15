export function generate(ast) {
  const context = createContext();
  const { push } = context;
  push("export ");
  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(", ");
  push(`function ${functionName} (${signature}) {`);
  push("return ");
  push(genNode(ast));
  push("}");

  return {
    code: context.code,
  };
}

function genNode(ast) {
  const node = ast.codegenNode;
  return `"${node.content}"`;
}

function createContext() {
  const context = {
    code: "",
    push: (value) => {
      context.code += value;
    },
  };
  return context;
}
