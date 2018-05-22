module.exports = {

  analysis: {
    dictionaryEntryInList: lineNumber => `Zeile ${lineNumber} enthält einen Dictionary Eintrag inmitten einer Liste.`,
    dictionaryEntryInField: lineNumber => `Zeile ${lineNumber} enthält einen Dictionary Eintrag inmitten eines Felds.`,
    duplicateDictionaryEntryName: (dictionaryName, entryName) => `Das Dictionary "${dictionaryName}" enthält zwei Einträge mit dem Namen "${entryName}".`,
    fieldAppendInDictionary: lineNumber => `Zeile ${lineNumber} enthält eine Felderweiterung inmitten von einem Dictionary.`,
    fieldAppendInList: lineNumber => `Zeile ${lineNumber} enthält eine Felderweiterung inmitten einer Liste.`,
    listItemInDictionary: lineNumber => `Zeile ${lineNumber} enthält einen Listeneintrag inmitten von einem Dictionary.`,
    listItemInField: lineNumber => `Zeile ${lineNumber} enthält einen Listeneintrag inmitten eines Felds.`,
    missingNameForDictionaryEntry: lineNumber => `Zeile ${lineNumber} enthält einen Dictionary Eintrag ohne dass davor ein Name für ein Dictionary angegeben wurde.`,
    missingNameForFieldAppend: lineNumber => `Zeile ${lineNumber} enthält einen Felderweiterung ohne dass davor ein Name für ein Feld angegeben wurde.`,
    missingNameForListItem: lineNumber => `Zeile ${lineNumber} enthält einen Listeneintrag ohne dass davor ein Name für eine Liste angegeben wurde.`,
    sectionHierarchyLayerSkip: lineNumber => `Zeile ${lineNumber} beginnt eine Sektion die mehr als eine Ebene tiefer liegt als die aktuelle.`
  },

  inspection: {
    dictionary: 'Dictionary',
    dictionaryEntry: 'Dictionary Eintrag',
    document: 'Dokument',
    empty: 'Leeres Element',
    field: 'Feld',
    list: 'Liste',
    listItem: 'Listeneintrag',
    section: 'Sektion',
    value: 'Wert'
  },

  reporting: {
    contentHeader: 'Inhalt',
    gutterHeader: 'Zeile'
  },

  resolution: {
    copyingBlockIntoDictionary: lineNumber => `In Zeile ${lineNumber} wird ein Block in ein Dictionary kopiert.`,
    copyingBlockIntoList: lineNumber => `In Zeile ${lineNumber} wird ein Block in eine Liste kopiert.`,
    copyingBlockIntoSection: lineNumber => `In Zeile ${lineNumber} wird ein Block in eine Sektion kopiert.`,
    copyingDictionaryIntoField: lineNumber => `In Zeile ${lineNumber} wird ein Dictionary in ein Feld kopiert.`,
    copyingDictionaryIntoList: lineNumber => `In Zeile ${lineNumber} wird ein Dictionary in eine Liste kopiert.`,
    copyingDictionaryIntoSection: lineNumber => `In Zeile ${lineNumber} wird ein Dictionary in eine Sektion kopiert.`,
    copyingFieldIntoDictionary: lineNumber => `In Zeile ${lineNumber} wird ein Feld in ein Dictionary kopiert.`,
    copyingFieldIntoList: lineNumber => `In Zeile ${lineNumber} wird ein Feld in eine Liste kopiert.`,
    copyingFieldIntoSection: lineNumber => `In Zeile ${lineNumber} wird ein Feld in eine Sektion kopiert.`,
    copyingListIntoField: lineNumber => `In Zeile ${lineNumber} wird eine Liste in ein Feld kopiert.`,
    copyingListIntoDictionary: lineNumber => `In Zeile ${lineNumber} wird eine Liste in ein Dictionary kopiert.`,
    copyingListIntoSection: lineNumber => `In Zeile ${lineNumber} wird eine Liste in eine Sektion kopiert.`,
    copyingSectionIntoField: lineNumber => `In Zeile ${lineNumber} wird eine Sektion in ein Feld kopiert.`,
    copyingSectionIntoDictionary: lineNumber => `In Zeile ${lineNumber} wird eine Sektion in ein Dictionary kopiert.`,
    copyingSectionIntoList: lineNumber => `In Zeile ${lineNumber} wird eine Sektion in eine Liste kopiert.`,
    copyingSectionIntoEmpty: lineNumber => `In Zeile ${lineNumber} wird eine Sektion in ein leeres Feld kopiert.`,
    cyclicDependency: (lineNumber, name) => `In Zeile ${lineNumber} wird "${name}" in sich selbst kopiert.`,
    multipleTemplatesFound: (lineNumber, name) => `In Zeile ${lineNumber} ist nicht klar welches Element mit dem Namen "${name}" kopiert werden soll.`,
    templateNotFound: (lineNumber, name) => `In Zeile ${lineNumber} soll das Element "${name}" kopiert werden, es wurde aber nicht gefunden.`
  },

  tokenization: {
    escapedUnterminatedName: lineNumber => `In Zeile ${lineNumber} wird der Name eines Elements mit Backticks escaped, jedoch wird diese Escape Sequenz bis zum Ende der Zeile nicht mehr beendet.`,
    invalidLine: lineNumber => `Zeile ${lineNumber} folgt keinem erlaubten Muster.`,
    unterminatedBlock: (name, lineNumber) => `Der Block "${name}" der in Zeile ${lineNumber} beginnt wird bis zum Ende des Dokuments nicht beendet.`
  },

  validation: {
    exactCountNotMet: (name, actual, expected) => `Das Feld "${name}" enthält ${actual} Einträge, muss aber genau ${expected} Einträge enthalten.`,
    excessName: name => `Das Feld "${name}" ist nicht vorgesehen, handelt es sich eventuell um einen Tippfehler?`,
    expectedDictionaryGotDictionaries: name => `Statt der erwarteten einzelnen Kollektion "${name}" wurden mehrere Kollektionen mit diesem Namen vorgefunden.`,
    expectedDictionaryGotField: name => `Statt der erwarteten Kollektion "${name}" wurden ein Feld mit diesem Namen vorgefunden.`,
    expectedDictionaryGotList: name => `Statt der erwarteten Kollektion "${name}" wurde eine Liste mit diesem Namen vorgefunden.`,
    expectedDictionaryGotSection: name => `Statt der erwarteten Kollektion "${name}" wurden eine Sektion mit diesem Namen vorgefunden.`,
    expectedFieldGotDictionary: name => `Statt dem erwarteten Feld "${name}" wurde eine Kollektion mit diesem Namen vorgefunden.`,
    expectedFieldGotList: name => `Statt dem erwarteten Feld "${name}" wurde eine Liste mit dem selben Namen vorgefunden.`,
    expectedFieldGotMultipleFields: name => `Statt dem erwarteten einzelnen Feld "${name}" wurden mehrere Felder mit diesem Namen vorgefunden.`,
    expectedFieldGotSection: name => `Statt dem erwarteten Feld "${name}" wurde eine Sektion mit diesem Namen vorgefunden.`,
    expectedListGotDictionary: name => `"${name}" muss eine Auflistung von Werten sein, enhält jedoch eine Kollektion.`,
    expectedListGotSection: name => `"${name}" muss eine Auflistung von Werten sein, enhält jedoch eine Sektion.`,
    expectedSectionGotDictionary: name => `Unter dem Namen "${name}" wurde ein Dictionary vorgefunden, es ist aber eine Sektion vorgesehen.`,
    expectedSectionGotEmpty: name => `Statt der erwarteten Sektion "${name}" wurde ein leeres Feld vorgefunden.`,
    expectedSectionGotField: name => `Statt der erwarteten Sektion "${name}" wurde ein Feld vorgefunden.`,
    expectedSectionGotList: name => `Das Feld "${name}" enthält eine Liste, muss aber eine Sektion enthalten.`,
    expectedSectionGotSections: name => `Statt der erwarteten einzelnen Sektion "${name}" wurden mehrere Sektionen vorgefunden.`,
    expectedSectionsGotDictionary: name => `Es wurden nur Sektionen mit dem Namen "${name}" erwartet, jedoch eine Kollektion vorgefunden.`,
    expectedSectionsGotEmpty: name => `Statt erwarteten Sektionen mit dem Namen "${name}" wurde ein leeres Feld vorgefunden.`,
    expectedSectionsGotField: name => `Statt erwarteten Sektionen mit dem Namen "${name}" wurde ein Feld mit diesem Namen vorgefunden.`,
    expectedSectionsGotList: name => `Es wurden Sektionen mit dem Namen "${name}" erwartet, aber eine Liste vorgefunden.`,
    genericError: name => `Es besteht ein Problem mit dem Feld "${name}".`,
    maxCountNotMet: (name, actual, maximum) => `Das Feld "${name}" enthält ${actual} Einträge, darf aber nur maximal ${maximum} Einträge enthalten.`,
    minCountNotMet: (name, actual, minimum) => `Das Feld "${name}" enthält ${actual} Einträge, muss aber mindestens ${minimum} Einträge enthalten.`,
    missingDictionary: name => `Die Kollektion "${name}" fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
    missingDictionaryEntry: name => `Der Eintrag "${name}" fehlt - falls er angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
    missingField: name => `Das Feld "${name}" fehlt.`,
    missingList: name => `Die Liste "${name}" fehlt - Falls das Feld angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
    missingSection: name => `Die Sektion "${name}" fehlt.`
  }

};
