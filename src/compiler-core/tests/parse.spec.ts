import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("parse", () => {
  describe("interpolation", () => {
    it("simple interpolation", () => {
      const ast = baseParse("{{message}}123");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });
  it("simple element", () => {
    const ast = baseParse("<div></div>");
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
    });
  });
});
