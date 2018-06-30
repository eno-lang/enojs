// Note: Study this file from the bottom up

const OPTIONAL = '([^\\n]+?)?';
const REQUIRED = '(\\S[^\\n]*?)';

//
const EMPTY = '()';
exports.EMPTY_LINE_INDEX = 1;

// | [Value to append to Field]
const NEWLINE_CONTINUATION = `(\\|)[^\\S\\n]*${OPTIONAL}`;
exports.NEWLINE_CONTINUATION_OPERATOR_INDEX = 2;
exports.NEWLINE_CONTINUATION_VALUE_INDEX = 3;

// \ [Value to append to Field]
const LINE_CONTINUATION = `(\\\\)[^\\S\\n]*${OPTIONAL}`;
exports.LINE_CONTINUATION_OPERATOR_INDEX = 4;
exports.LINE_CONTINUATION_VALUE_INDEX = 5;

const CONTINUATION = `${NEWLINE_CONTINUATION}|${LINE_CONTINUATION}`;

// > [Text of Comment]
const COMMENT = `(>)[^\\S\\n]*${OPTIONAL}`;
exports.COMMENT_ANGLE_INDEX = 6;
exports.COMMENT_TEXT_INDEX = 7;

// - [Value of Item]
const LIST_ITEM = `(-)(?!-)[^\\S\\n]*${OPTIONAL}`;
exports.LIST_ITEM_INDEX = 8;
exports.LIST_ITEM_VALUE_INDEX = 9;

// -- [Name of Block]
const BLOCK = `(-{2,})[^\\S\\n]*${REQUIRED}`;
exports.BLOCK_DASHES_INDEX = 10;
exports.BLOCK_NAME_INDEX = 11;

// #
const SECTION_HASHES = '(#+)(?!#)';
exports.SECTION_HASHES_INDEX = 12;

// # [Name of Section]
const SECTION_NAME_UNESCAPED = '(?!`)([^\\s<][^<\\n]*?)';
exports.SECTION_NAME_UNESCAPED_INDEX = 13;

// # [Name of Section]
const SECTION_NAME_ESCAPED = '(`+)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\14'; // TODO: Should this exclude the backreference inside the quotes? (as in ((?:(?!\\1).)+) ) here and elsewhere
exports.SECTION_NAME_ESCAPED_QUOTES_INDEX = 14;
exports.SECTION_NAME_ESCAPED_INDEX = 15;

// # [Name of Section] < [Name of Inheritance]
const SECTION_NAME = `(?:${SECTION_NAME_UNESCAPED}|${SECTION_NAME_ESCAPED})`;
const SECTION_TEMPLATE = `(?:(<(?!<)|<<)[^\\S\\n]*${REQUIRED})?`;
const SECTION = `${SECTION_HASHES}\\s*${SECTION_NAME}[^\\S\\n]*${SECTION_TEMPLATE}`;
exports.SECTION_COPY_OPERATOR_INDEX = 16;
exports.SECTION_TEMPLATE_INDEX = 17;

const EARLY_DETERMINED = `${CONTINUATION}|${COMMENT}|${LIST_ITEM}|${BLOCK}|${SECTION}`;

// [Name of Dictionary/List/Field]:
// [Name of Field]: [Value of Field]
const NAME_UNESCAPED = '(?![>#\\-`\\\\|])([^\\s:=<][^:=<]*?)';
exports.NAME_UNESCAPED_INDEX = 18;

// '[Name of Dictionary/List/Field]':
// "[Name of Dictionary/List/Field]":
// '[Name of Field]': [Value of Field]
// "[Name of Field]": [Value of Field]
const NAME_ESCAPED = '(`+)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\19';
exports.NAME_ESCAPED_QUOTES_INDEX = 19;
exports.NAME_ESCAPED_INDEX = 20;

const NAME = `(?:${NAME_UNESCAPED}|${NAME_ESCAPED})`;

const FIELD_OR_NAME = `(:)[^\\S\\n]*${OPTIONAL}`;
exports.NAME_OPERATOR_INDEX = 21;
exports.FIELD_VALUE_INDEX = 22;

// [Name of Entry] = [Value of Entry]
// '[Name of Entry]' = [Value of Entry]
// "[Name of Entry]" = [Value of Entry]
const DICTIONARY_ENTRY = `(=)[^\\S\\n]*${OPTIONAL}`;
exports.DICTIONARY_ENTRY_OPERATOR_INDEX = 23;
exports.DICTIONARY_ENTRY_VALUE_INDEX = 24;

// [Name of Inheriting] < [Name of Inheritance]
// '[Name of Inheriting]' < [Name of Inheritance]
// "[Name of Inheriting]" < [Name of Inheritance]
const COPY = `<\\s*${REQUIRED}`;
exports.TEMPLATE_INDEX = 25;

const LATE_DETERMINED = `${NAME}\\s*(?:${FIELD_OR_NAME}|${DICTIONARY_ENTRY}|${COPY})`;

const NOT_EMPTY = `(?:${EARLY_DETERMINED}|${LATE_DETERMINED})`;

exports.GRAMMAR_REGEXP = new RegExp(`[^\\S\\n]*(?:${EMPTY}|${NOT_EMPTY})[^\\S\\n]*(?=\\n|$)`, 'y');
