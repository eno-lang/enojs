const { parse } = require("../../eno.js");

const input = `
languages:

eno = error notation

json = json object notation

copy < languages

yaml = yaml ain't markup language
`.trim();

describe("Resolution", () => {
  describe("Copying fieldset with empty lines", () => {
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
        "eno": "error notation",
      },
      Object {
        "json": "json object notation",
      },
      Object {
        "yaml": "yaml ain't markup language",
      },
    ],
  },
]
`);
    });
  });
});
