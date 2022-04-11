import { NodeTypes } from "./ast";

export function baseParse(content) {
  const context = createParseContext(content);
  return createRoot(parseChildren(context));
}

const enum TagType {
  TAG_START,
  TAG_END,
}

function parseChildren(context) {
  const nodes: any[] = [];
  let node;

  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
  } else if (context.source[0] === "<") {
    if (/[a-z]/i.test(context.source[1])) {
      node = parseElement(context);
    }
  } else {
    node = parseText(context);
  }
  nodes.push(node);
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
  advanceBy(context, openDelimiter.length);
  const contentLength = closeIndex - openDelimiter.length;
  // const rawContent = context.source.slice(0, contentLength);
  // advanceBy(context, closeIndex);
  const rawContent = parseData(context, contentLength);
  const content = rawContent.trim();
  advanceBy(context, closeIndex);

  console.log("context", context.source);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function parseElement(context) {
  const element = parseTag(context, TagType.TAG_START);
  parseTag(context, TagType.TAG_END);
  return element;
}

function parseText(context) {
  const content = parseData(context, context.source.length);
  return {
    type: NodeTypes.TEXT,
    content: content,
  };
}

function parseData(context: any, length) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}

function parseTag(context: any, type: TagType) {
  const match = /^<\/?([a-z]*)/i;
  const ret: any = match.exec(context.source);
  const tag = ret[1];
  advanceBy(context, ret[0].length);
  advanceBy(context, 1);
  if (type === TagType.TAG_END) {
    return;
  }
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

function advanceBy(context, length) {
  context.source = context.source.slice(length);
}
