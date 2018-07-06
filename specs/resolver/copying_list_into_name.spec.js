const { parse } = require("../../eno.js");

const input = `
languages:
- eno
- json

copy < languages
`.trim();

describe("Resolution", () => {
  describe("Copying list into name", () => {
    it("works", () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchInlineSnapshot(`
Array [
  Object {
    "languages": Array [
      "eno",
      "json",
    ],
  },
  Object {
    "copy": Array [
      "eno",
      "json",
    ],
  },
]
`);
    });
  });
});
