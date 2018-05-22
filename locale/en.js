module.exports = {

  analysis: {
    dictionaryEntryInList: lineNumber => `Line ${lineNumber} contains a dictionary entry in the middle of a list.`,
    dictionaryEntryInField: lineNumber => `line ${lineNumber} contains a dictionary entry in the middle of a field.`,
    duplicateDictionaryEntryName: (dictionaryName, entryName) => `The Dictionary" ${dictionaryName} "contains two entries named" ${entryName} ".`,
    fieldAppendInDictionary: lineNumber => `line ${lineNumber} contains a field extension in the middle of a dictionary.`,
    fieldAppendInList: lineNumber => `line ${lineNumber} contains a field extension in the middle of a list.`,
    listItemInDictionary: lineNumber => `Line ${lineNumber} contains a list entry in the middle of a dictionary.`,
    listItemInField: lineNumber => `line ${lineNumber} contains a list entry in the middle of a field.`,
    missingNameForDictionaryEntry: lineNumber => `Line ${lineNumber} contains a dictionary entry without a name being specified for a dictionary before.`,
    missingNameForFieldAppend: lineNumber => `line ${lineNumber} contains a field extension without a name for a field being specified before.`,
    missingNameForListItem: lineNumber => `line ${lineNumber} contains a list entry without a name for a list being specified before.`,
    sectionHierarchyLayerSkip: lineNumber => `line ${lineNumber} starts a section that is more than one level lower than the current one.`
  },

  inspection: {
    dictionary: 'Dictionary',
    dictionaryEntry: 'Dictionary Entry',
    document: 'Document',
    empty: 'Empty element',
    field: 'field',
    list: 'List',
    listItem: 'list entry',
    section: 'Section',
    value: 'value'
  },

  reporting: {
    contentHeader: 'Content',
    gutterHeader: 'Line'
  },

  resolution: {
    copyingBlockIntoDictionary: lineNumber => `In line ${lineNumber} a block is copied into a dictionary.`,
    copyingBlockIntoList: lineNumber => `In line ${lineNumber} a block is copied to a list.`,
    copyingBlockIntoSection: lineNumber => `In line ${lineNumber} a block is copied into a section.`,
    copyingDictionaryIntoField: lineNumber => `In line ${lineNumber} a dictionary is copied to a field.`,
    copyingDictionaryIntoList: lineNumber => `In line ${lineNumber} a dictionary is copied to a list.`,
    copyingDictionaryIntoSection: lineNumber => `In line ${lineNumber} a dictionary is copied into a section.`,
    copyingFieldIntoDictionary: lineNumber => `In line ${lineNumber} a field is copied into a dictionary.`,
    copyingFieldIntoList: lineNumber => `In line ${lineNumber} a field is copied to a list.`,
    copyingFieldIntoSection: lineNumber => `In line ${lineNumber} a field is copied into a section.`,
    copyingListIntoField: lineNumber => `In line ${lineNumber} a list is copied to a field.`,
    copyingListIntoDictionary: lineNumber => `In line ${lineNumber} a list is copied into a dictionary.`,
    copyingListIntoSection: lineNumber => `In line ${lineNumber} a list is copied into a section.`,
    copyingSectionIntoField: lineNumber => `In line ${lineNumber} a section is copied to a field.`,
    copyingSectionIntoDictionary: lineNumber => `In line ${lineNumber} a section is copied into a dictionary.`,
    copyingSectionIntoList: lineNumber => `A line is copied to a list in line ${lineNumber} .`,
    copyingSectionIntoEmpty: lineNumber => `In line ${lineNumber} a section is copied into an empty field.`,
    cyclicDependency: (lineNumber, name) => `In line ${lineNumber}" ${name} "is copied in itself.`,
    multipleTemplatesFound: (lineNumber, name) => `In line ${lineNumber} it is not clear what element with the name" ${name} "should be copied.`,
    templateNotFound: (lineNumber, name) => `In line ${lineNumber} the element" ${name} "should be copied, but it was not found.`
  },

  tokenization: {
    escapedUnterminatedName: lineNumber => `In line ${lineNumber} the name of an element is escaped with backticks, but this escape sequence is not terminated until the end of the line.`,
    invalidLine: lineNumber => `line ${lineNumber} does not follow a permitted pattern.`,
    unterminatedBlock: (name, lineNumber) => `The block" ${name} "starting in line ${lineNumber} will not be terminated until the end of the document.`
  },

  validation: {
    exactCountNotMet: (name, actual, expected) => `The field" ${name} "contains ${actual} entries, but must contain exactly ${expected} entries.`,
    excessName: name => `The field" ${name} "is not provided, is it possibly a typo?`,
    expectedDictionaryGotDictionaries: name => `Instead of the expected single collection" ${name} "several collections with this name were found.`,
    expectedDictionaryGotField: name => `Instead of the expected collection" ${name} ", a field with this name was found.`,
    expectedDictionaryGotList: name => `Instead of the expected collection" ${name} "a list with this name was found.`,
    expectedDictionaryGotSection: name => `Instead of the expected collection" ${name} "a section with this name was found.`,
    expectedFieldGotDictionary: name => `Instead of the expected field" ${name} "a collection with this name was found.`,
    expectedFieldGotList: name => `Instead of the expected field" ${name} "a list with the same name was found.`,
    expectedFieldGotMultipleFields: name => `Instead of the expected single field" ${name} "several fields with this name were found.`,
    expectedFieldGotSection: name => `Instead of the expected field" ${name} "a section with this name was found.`,
    expectedListGotDictionary: name => `" ${name} "must be a collection of values, but includes a collection.`,
    expectedListGotSection: name => `" ${name} "must be a collection of values, but includes a section.`,
    expectedSectionGotDictionary: name => `Under the name" ${name} "a dictionary was found, but there is a section provided.`,
    expectedSectionGotEmpty: name => `Instead of the expected section" ${name} "an empty field was found.`,
    expectedSectionGotField: name => `Instead of the expected section" ${name} "a field was found.`,
    expectedSectionGotList: name => `The field" ${name} "contains a list but must contain a section.`,
    expectedSectionGotSections: name => `Instead of the expected single section" ${name} "several sections were found.`,
    expectedSectionsGotDictionary: name => `Only sections with the name" ${name} "were expected, but a collection was found.`,
    expectedSectionsGotEmpty: name => `Instead of expected sections with the name" ${name} "an empty field was found.`,
    expectedSectionsGotField: name => `Instead of expected sections named" ${name} ", a field with this name was found.`,
    expectedSectionsGotList: name => `Sections named" ${name} "were expected, but a list was found.`,
    genericError: name => `There is a problem with the field" ${name} ".`,
    maxCountNotMet: (name, actual, maximum) => `The field" ${name} "contains ${actual} entries, but may only contain a maximum of ${maximum} entries.`,
    minCountNotMet: (name, actual, minimum) => `The field" ${name} "contains ${actual} entries, but must contain at least ${minimum} entries.`,
    missingDictionary: name => `The collection" ${name} "- if it has been specified - may be missing for typos and also case-sensitive.`,
    missingDictionaryEntry: name => `The entry" ${name} "- if it has been specified - may be missing for typos and also case-sensitive .`,
    missingField: name => `The field" ${name} "is missing.`,
    missingList: name => `The list" ${name} "is missing - If the field was given you may be looking for typos and also case sensitive.`,
    missingSection: name => `The section" ${name} "is missing.`,
  }

};
