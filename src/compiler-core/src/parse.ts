import { NodeTypes } from "./ast";

export function baseParse(content) {
  const context = createParseContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const nodes: any[] = [];
  let node;

  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
    nodes.push(node);
  }
  return nodes;
}

function createParseContext(context: string) {
  return {
    source: context,
  };
}

function createRoot(children) {
  return { children };
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );
  // context.source = context.source.slice(openDelimiter.length);
  advanceBy(context, openDelimiter.length);
  const contentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, contentLength);
  const content = rawContent.trim();
  advanceBy(context, closeIndex);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context, length) {
  context.source = context.source.slice(length);
}
