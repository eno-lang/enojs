const { parse } = require("../../eno.js");

const input = `
languages:
eno = eno notation
json = json object notation

copy < languages
`.trim();

describe("Resolution", () => {
  describe("Copying dictionary into name", () => {
    it("works", () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchInlineSnapshot(`
Array [
  Object {
    "languages": Array [
      Object {
        "eno": "eno notation",
      },
      Object {
        "json": "json object notation",
      },
    ],
  },
  Object {
    "copy": Array [
      Object {
        "eno": "eno notation",
      },
      Object {
        "json": "json object notation",
      },
    ],
  },
]
`);
    });
  });
});
