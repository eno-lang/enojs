module.exports = {

  analysis: {
    dictionaryEntryInList: lineNumber => `Line ${lineNumber} contiene una entrada de diccionario en el medio de una lista.`,
    dictionaryEntryInField: lineNumber => `line ${lineNumber} contiene una entrada de diccionario en el medio de un campo.`,
    duplicateDictionaryEntryName: (dictionaryName, entryName) => `El diccionario "${dictionaryName}" contiene dos entradas llamadas "${entryName}".`,
    fieldAppendInDictionary: lineNumber => `line ${lineNumber} contiene una extensión de campo en el medio de un diccionario.`,
    fieldAppendInList: lineNumber => `line ${lineNumber} contiene una extensión de campo en el medio de una lista.`,
    listItemInDictionary: lineNumber => `Line ${lineNumber} contiene una entrada de lista en el medio de un diccionario.`,
    listItemInField: lineNumber => `line ${lineNumber} contiene una entrada de lista en el medio de un campo.`,
    missingNameForDictionaryEntry: lineNumber => `Line ${lineNumber} contiene una entrada de diccionario sin un nombre especificado para un diccionario antes.`,
    missingNameForFieldAppend: lineNumber => `line ${lineNumber} contiene una extensión de campo sin un nombre para un campo que se haya especificado antes.`,
    missingNameForListItem: lineNumber => `line ${lineNumber} contiene una entrada de lista sin nombre para una lista especificada antes.`,
    sectionHierarchyLayerSkip: lineNumber => `line ${lineNumber} inicia una sección que es más de un nivel más bajo que el actual.`
  },

  inspection: {
    dictionary: 'Diccionario',
    dictionaryEntry: 'Entrada de diccionario',
    document: 'Documento',
    empty: 'elemento vacío',
    field: 'campo',
    list: 'Lista',
    listItem: 'list entry',
    section: 'Sección',
    value: 'valor'
  },

  reporting: {
    contentHeader: 'Contenido',
    gutterHeader: 'Fila'
  },

  resolution: {
    copyingBlockIntoDictionary: lineNumber => `En la línea ${lineNumber}, un bloque se copia en un diccionario.`,
    copyingBlockIntoList: lineNumber => `En la línea ${lineNumber} se copia un bloque a una lista.`,
    copyingBlockIntoSection: lineNumber => `En la línea ${lineNumber}, un bloque se copia en una sección.`,
    copyingDictionaryIntoField: lineNumber => `En la línea ${lineNumber}, se copia un diccionario en un campo.`,
    copyingDictionaryIntoList: lineNumber => `En la línea ${lineNumber}, se copia un diccionario a una lista.`,
    copyingDictionaryIntoSection: lineNumber => `En la línea ${lineNumber}, se copia un diccionario en una sección.`,
    copyingFieldIntoDictionary: lineNumber => `En la línea ${lineNumber}, un campo se copia en un diccionario.`,
    copyingFieldIntoList: lineNumber => `En la línea ${lineNumber} se copia un campo a una lista.`,
    copyingFieldIntoSection: lineNumber => `En la línea ${lineNumber}, se copia un campo en una sección.`,
    copyingListIntoField: lineNumber => `En la línea ${lineNumber}, se copia una lista en un campo.`,
    copyingListIntoDictionary: lineNumber => `En la línea ${lineNumber}, se copia una lista en un diccionario.`,
    copyingListIntoSection: lineNumber => `En la línea ${lineNumber}, se copia una lista en una sección.`,
    copyingSectionIntoField: lineNumber => `En la línea ${lineNumber}, se copia una sección en un campo.`,
    copyingSectionIntoDictionary: lineNumber => `En la línea ${lineNumber}, una sección se copia en un diccionario.`,
    copyingSectionIntoList: lineNumber => `Una seccion se copia a una lista en la línea ${lineNumber}.`,
    copyingSectionIntoEmpty: lineNumber => `Una seccion se copia a un campo vacío en la línea ${lineNumber}.`,
    cyclicDependency: (lineNumber, name) => `En la línea ${lineNumber} "${name}" se copia en sí mismo.`,
    multipleTemplatesFound: (lineNumber, name) => `En la línea ${lineNumber} no está claro qué elemento con el nombre "${name}" debe copiarse.`,
    templateNotFound: (lineNumber, name) => `En la línea ${lineNumber} debe copiarse el elemento "${name}", pero no se encontró.`
  },

  tokenization: {
    escapedUnterminatedName: lineNumber => `En la línea ${lineNumber}, el nombre de un elemento se escapa con backticks, pero esta secuencia de escape no termina hasta el final de la línea.`,
    invalidLine: lineNumber => `line ${lineNumber} no sigue un patrón permitido.`,
    unterminatedBlock: (name, lineNumber) => `El bloque "${name}" que comienza en la línea ${lineNumber} no terminará hasta el final del documento.`
  },

  validation: {
    exactCountNotMet: (name, actual, expected) => `El campo "${name}"contiene ${actual} entradas, pero debe contener exactamente ${expected} entries.`,
    excessName: name => `El campo "${name}"no se proporciona, ¿es posiblemente un error tipográfico?`,
    expectedDictionaryGotDictionaries: name => `En lugar de la única colección esperada "${name}"se encontraron varias colecciones con este nombre.`,
    expectedDictionaryGotField: name => `En lugar de la colección esperada "${name}", se encontró un campo con este nombre.`,
    expectedDictionaryGotList: name => `En lugar de la colección esperada "${name}", se encontró una lista con este nombre.`,
    expectedDictionaryGotSection: name => `En lugar de la colección esperada "${name}", se encontró una sección con este nombre.`,
    expectedFieldGotDictionary: name => `En lugar del campo esperado "${name}", se encontró una colección con este nombre.`,
    expectedFieldGotList: name => `En lugar del campo esperado "${name}", se encontró una lista con el mismo nombre.`,
    expectedFieldGotMultipleFields: name => `En lugar del único campo esperado "${name}" se encontraron varios campos con este nombre.`,
    expectedFieldGotSection: name => `En lugar del campo esperado "${name}", se encontró una sección con este nombre.`,
    expectedListGotDictionary: name => ` "${name}"debe ser una colección de valores, pero incluye una colección.`,
    expectedListGotSection: name => ` "${name}"debe ser una colección de valores, pero incluye una sección.`,
    expectedSectionGotDictionary: name => `Con el nombre "${name}" se encontró un diccionario, pero hay una sección proporcionada.`,
    expectedSectionGotEmpty: name => `En lugar de la sección esperada "${name}", se encontró un campo vacío.`,
    expectedSectionGotField: name => `En lugar de la sección esperada "${name}" se encontró un campo.`,
    expectedSectionGotList: name => `El campo "${name}"contiene una lista, pero debe contener una sección.`,
    expectedSectionGotSections: name => `En lugar de la única sección esperada "${name}" se encontraron varias secciones.`,
    expectedSectionsGotDictionary: name => `Solo se esperaban secciones con el nombre "${name}", pero se encontró una colección.`,
    expectedSectionsGotEmpty: name => `En lugar de las secciones esperadas con el nombre "${name}", se encontró un campo vacío.`,
    expectedSectionsGotField: name => `En lugar de las secciones esperadas llamadas "${name}", se encontró un campo con este nombre.`,
    expectedSectionsGotList: name => `Se esperaban las secciones denominadas "${name}", pero se encontró una lista.`,
    genericError: name => `Hay un problema con el campo "${name}".`,
    maxCountNotMet: (name, actual, maximum) => `El campo "${name}"contiene ${actual} entradas, pero solo puede contener un máximo de ${maximum} entradas.`,
    minCountNotMet: (name, actual, minimum) => `El campo "${name}"contiene ${actual} entradas, pero debe contener al menos ${minimum} entries.`,
    missingDictionary: name => `La colección "${name}"- si se ha especificado - puede faltar para los errores tipográficos y también distingue entre mayúsculas y minúsculas.`,
    missingDictionaryEntry: name => `La entrada "${name}"- si se ha especificado - puede faltar para los errores tipográficos y también distingue entre mayúsculas y minúsculas .`,
    missingField: name => `Falta el campo "${name}".`,
    missingList: name => `Falta la lista "${name}"- Si se proporcionó el campo, es posible que esté buscando errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
    missingSection: name => `Falta la sección  "${name}".`
  }

};
