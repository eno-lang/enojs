// Note: Study this file from the bottom up

const OPTIONAL = '([^\\n]+?)?';
const REQUIRED = '(\\S[^\\n]*?)';

//
const EMPTY = '()';
exports.EMPTY_LINE_INDEX = 1;

// | Newline continuation
const NEWLINE_CONTINUATION = `(\\|)[^\\S\\n]*${OPTIONAL}`;
exports.NEWLINE_CONTINUATION_OPERATOR_INDEX = 2;
exports.NEWLINE_CONTINUATION_VALUE_INDEX = 3;

// \ Line continuation
const LINE_CONTINUATION = `(\\\\)[^\\S\\n]*${OPTIONAL}`;
exports.LINE_CONTINUATION_OPERATOR_INDEX = 4;
exports.LINE_CONTINUATION_VALUE_INDEX = 5;

const CONTINUATION = `${NEWLINE_CONTINUATION}|${LINE_CONTINUATION}`;

// > Comment
const COMMENT = `(>)[^\\S\\n]*${OPTIONAL}`;
exports.COMMENT_OPERATOR_INDEX = 6;
exports.COMMENT_TEXT_INDEX = 7;

// - List item value
const LIST_ITEM = `(-)(?!-)[^\\S\\n]*${OPTIONAL}`;
exports.LIST_ITEM_INDEX = 8;
exports.LIST_ITEM_VALUE_INDEX = 9;

// -- Block name
const BLOCK = `(-{2,})[^\\S\\n]*${REQUIRED}`;
exports.BLOCK_DASHES_INDEX = 10;
exports.BLOCK_NAME_INDEX = 11;

// #
const SECTION_HASHES = '(#+)(?!#)';
exports.SECTION_HASHES_INDEX = 12;

// # Section name
const SECTION_NAME_UNESCAPED = '(?!`)([^\\s<][^<\\n]*?)';
exports.SECTION_NAME_UNESCAPED_INDEX = 13;

// # `Escaped section name`
const SECTION_NAME_ESCAPE_BEGIN_OPERATOR_INDEX = 14
const SECTION_NAME_ESCAPED = `(\`+)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${SECTION_NAME_ESCAPE_BEGIN_OPERATOR_INDEX}`; // TODO: Should this exclude the backreference inside the quotes? (as in ((?:(?!\\1).)+) ) here and elsewhere (probably not because it's not greedy.?)
exports.SECTION_NAME_ESCAPE_BEGIN_OPERATOR_INDEX = SECTION_NAME_ESCAPE_BEGIN_OPERATOR_INDEX;
exports.SECTION_NAME_ESCAPED_INDEX = 15;

// # Section name < Template name
// # `Escaped section name` < Template name
const SECTION_NAME = `(?:${SECTION_NAME_UNESCAPED}|${SECTION_NAME_ESCAPED})`;
const SECTION_TEMPLATE = `(?:(<(?!<)|<<)[^\\S\\n]*${REQUIRED})?`;
const SECTION = `${SECTION_HASHES}\\s*${SECTION_NAME}[^\\S\\n]*${SECTION_TEMPLATE}`;
exports.SECTION_COPY_OPERATOR_INDEX = 16;
exports.SECTION_TEMPLATE_INDEX = 17;

const EARLY_DETERMINED = `${CONTINUATION}|${COMMENT}|${LIST_ITEM}|${BLOCK}|${SECTION}`;

// Name:
// Name: Value
const NAME_UNESCAPED = '(?![>#\\-`\\\\|])([^\\s:=<][^:=<]*?)';
exports.NAME_UNESCAPED_INDEX = 18;

// Name:
// `Name`: Value
const NAME_ESCAPE_BEGIN_OPERATOR_INDEX = 19
const NAME_ESCAPED = `(\`+)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${NAME_ESCAPE_BEGIN_OPERATOR_INDEX}`;
exports.NAME_ESCAPE_BEGIN_OPERATOR_INDEX = NAME_ESCAPE_BEGIN_OPERATOR_INDEX;
exports.NAME_ESCAPED_INDEX = 20;

const NAME = `(?:${NAME_UNESCAPED}|${NAME_ESCAPED})`;

const FIELD_OR_NAME = `(:)[^\\S\\n]*${OPTIONAL}`;
exports.NAME_OPERATOR_INDEX = 21;
exports.FIELD_VALUE_INDEX = 22;

// Name of fieldset entry =
// `Name of fieldset entry` = Value
const FIELDSET_ENTRY = `(=)[^\\S\\n]*${OPTIONAL}`;
exports.FIELDSET_ENTRY_OPERATOR_INDEX = 23;
exports.FIELDSET_ENTRY_VALUE_INDEX = 24;

// Name < Template name
// `Name` < Template name
const COPY = `<\\s*${REQUIRED}`;
exports.TEMPLATE_INDEX = 25;

const LATE_DETERMINED = `${NAME}\\s*(?:${FIELD_OR_NAME}|${FIELDSET_ENTRY}|${COPY})`;

const NOT_EMPTY = `(?:${EARLY_DETERMINED}|${LATE_DETERMINED})`;

exports.GRAMMAR_REGEXP = new RegExp(`[^\\S\\n]*(?:${EMPTY}|${NOT_EMPTY})[^\\S\\n]*(?=\\n|$)`, 'y');
