export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  codegenRoor(root);
  // const codegenNode
}

function codegenRoor(root) {
  // return root.children[0];
  root.codegenNode = root.children[0];
}

function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const element = nodeTransforms[i];
    element(node);
  }
  traverseChildren(node, context);
}

function traverseChildren(node: any, context: any) {
  const { children } = node;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      traverseNode(element, context);
    }
  }
}

function createTransformContext(root: any, options: any) {
  const nodeTransforms = options.nodeTransforms || [];
  return {
    root,
    nodeTransforms,
  };
}
