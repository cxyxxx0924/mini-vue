import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("parse", () => {
  describe("interpolation", () => {
    it("simple interpolation", () => {
      const ast = baseParse("{{message}}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });
  describe("element", () => {
    it("simple element", () => {
      const ast = baseParse("<div></div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("text", () => {
    it("simple text", () => {
      const ast = baseParse("hi message");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "hi message",
      });
    });
  });

  describe("Mix apply", () => {
    it("base test", () => {
      const ast = baseParse("<div>hi,{{message}}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hi,",
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });
    it("multi element mix version", () => {
      const ast = baseParse("<div><p>hi,</p>{{message}}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: "p",
            children: [
              {
                type: NodeTypes.TEXT,
                content: "hi,",
              },
            ],
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });
    it("miss end tag throw error", () => {
      expect(() => {
        const ast = baseParse("<div><p></div>");
      }).toThrowError("缺少p的结束符");
    });
  });
});
