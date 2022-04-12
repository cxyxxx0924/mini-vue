import { NodeTypes } from "./ast";

export function baseParse(content) {
  const context = createParseContext(content);
  return createRoot(parseChildren(context, ""));
}

const enum TagType {
  TAG_START,
  TAG_END,
}

const endTagTrack: any[] = [];

function parseChildren(context, endTag) {
  const nodes: any[] = [];
  let node;
  while (!isEnd(context, endTag)) {
    if (context.source.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (context.source[0] === "<") {
      if (/^[a-z]/i.test(context.source[1])) {
        node = parseElement(context);
      }
    } else {
      node = parseText(context);
    }
    nodes.push(node);
  }

  return nodes;
}

function isEnd(context, tag) {
  // source有值的时候
  // 遇到结束符
  const s = context.source;
  // </div>

  if (s.indexOf("</") === 0) {
    // const endTag = endTagTrack.pop();
    // const endTag = s.slice(2, 2 + tag.length);
    return true;

    // if (s.slice(2, tag.length + 2) === tag) return true;
  }
  return !s;
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
  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function parseElement(context) {
  const element: any = parseTag(context, TagType.TAG_START);

  endTagTrack.push(element.tag);
  element.children = parseChildren(context, element.tag);

  parseTag(context, TagType.TAG_END);

  return element;
}

// 字符串处理
function parseText(context) {
  const endMark = ["{{", "<"];
  let endMarkIndex = context.source.length;

  for (let i = 0; i < endMark.length; i++) {
    const endIndex = context.source.indexOf(endMark[i]);
    if (endIndex !== -1) {
      endMarkIndex = endMarkIndex > endIndex ? endIndex : endMarkIndex;
    }
  }

  const content = parseData(context, endMarkIndex);
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
    const endTag = endTagTrack.pop();
    if (endTag !== tag) {
      console.log("endTag is ", endTag);
      console.log("endTagTrack.pop() !== tag");
      throw new Error(`缺少${endTag}的结束符`);
    }
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
