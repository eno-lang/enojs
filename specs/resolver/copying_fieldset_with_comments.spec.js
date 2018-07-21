const { parse } = require("../../eno.js");

const input = `
languages:
> eno-lang.org
eno = error notation
> json.org
json = json object notation

copy < languages
> yaml.org
yaml = yaml ain't markup language
`.trim();

describe("Resolution", () => {
  describe("Copying fieldset with comments", () => {
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
