const { parse } = require("../../eno.js");

const input = `
languages:
eno = error notation
json = json object notation

copy < languages
eno = eno notation
`.trim();

describe("Resolution", () => {
  describe("Copying dictionary into dictionary", () => {
    it("works", () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchInlineSnapshot(`
Array [
  Object {
    "languages": Array [
      Object {
        "eno": "error notation",
      },
      Object {
        "json": "json object notation",
      },
    ],
  },
  Object {
    "copy": Array [
      Object {
        "json": "json object notation",
      },
      Object {
        "eno": "eno notation",
      },
    ],
  },
]
`);
    });
  });
});
