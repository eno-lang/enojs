const example = {
  leer: null,
  '>empty': null,
  number: 1,
  subsection: {
    subsubsection: {
      subsubsubsection: {
        oh: 'my'
      },
      key: 'value',
      list: [
        1,
        2,
        3
      ]
    }
  },
  key: 'value',
  '> key': 'value',
  '- key': 'value',
  '-- key': 'value',
  '--- key': 'value',
  '# key': 'value',
  '## key': 'value',
  '### key': 'value',
  'k: ey': 'value',
  date: new Date(),
  list: [
    'apple',
    'banana',
    'orange'
  ],
  object: {
    key: 'value',
    number: 3.41,
  },
  text: 'we were testing things.\nthings looked good.\nmostly.\n\n-- unknown',
  nasty: 'look\nat\nthis\n--- nasty\n---- nasty\n----- nasty\nthing'
};

const arr = [ 'not', 'really', 'cool', 'with', 'eno' ];
const obj = { totally: 'not supported' };

example[arr] = 'highly';
example[obj] = 'precarious';

const renderKey = key => {
  if(key.match(/^\s*[>\-#]|[=:]/)) {
    return `:: ${key}\n`;
  } else {
    return  `${key}:\n`;
  }
};

const renderKeyValue = (key, value) => {
  if(key.match(/^\s*[>\-#]|[:=]/)) {
    return `:: ${key}\n` +
           `- ${value}\n`;
  } else {
    return  `${key}: ${value}\n`;
  }
};

const renderMultiLineKeyValue = (key, value) => {
  const keyEscaped = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  let dashes = '--';

  while(true) {
    const keyRegex = new RegExp(`(^|\\n)\\s*${dashes}\\s*${keyEscaped}\\s*?($|\\n)`);

    if(!value.match(keyRegex)) {
      break;
    }

    dashes += '-';
  }

  return `${dashes} ${key}\n` +
         `${value}\n` +
         `${dashes} ${key}\n`;
};

const renderSectionKey = (depth, key) => {
  const hashes = '#'.repeat(depth);

  return `${hashes} ${key}\n`;
};

const sanitizeKey = key => {
  if(typeof key === 'string') {
    if(key.match(/\r?\n/)) {
      console.log(`Warning: Keys can not contain newlines, replacing with blanks: ${key}`)
      key = key.replace(/\r?\n/, ' ');
    }

    return key.trim();
  } else if(Array.isArray(key)) {
    console.log(`Warning: Keys can not be arrays: ${key}`);

    return sanitizeKey(key.toString());
  } else if(typeof key === 'object') {
    console.log(`Warning: Keys can not be objects: ${key}`);

    return sanitizeKey(key.toString());
  } else {
    console.log(`Keys is of an unknown and likely not supportable type: ${key}`);

    return sanitizeKey(key.toString());
  }
};

const dump = (object, depth = 1) => {
  let sequential = [];
  let trailing = [];

  for(let rawKey of Object.keys(object)) {
    const key = sanitizeKey(rawKey);
    const value = object[key];

    if(value === null) {
      sequential.push( renderKey(key) );

      continue;
    }

    if(typeof value === 'string') {
      if(value.match(/\r?\n/)) {
        sequential.push( renderMultiLineKeyValue(key, value) );
      } else {
        sequential.push( renderKeyValue(key, value) );
      }

      continue;
    }

    if(typeof value === 'number') {
      sequential.push( renderKeyValue(key, value) );

      continue;
    }

    if(Array.isArray(value)) {
      let state = null;

      const startOrContinueList = (key, value) => {
        if(state === 'writing-values') {
          if(value) {
            sequential.push(`- ${value}\n`);
          } else {
            sequential.push('-\n');
          }
        } else {
          sequential.push( renderKey(key) );
          state = 'writing-values';
          startOrContinueList(key, value);
        }
      }

      for(let listValue of value) {

        if(listValue === null) {
          startOrContinueList(key, null)

          continue;
        }

        if(typeof listValue === 'string') {
          if(value.match(/\r?\n/)) {
            sequential.push( renderMultiLineKeyValue(key, listValue) );
          } else {
            startOrContinueList(key, listValue);
          }

          continue;
        }

        if(typeof listValue === 'number') {
          startOrContinueList(key, listValue);

          continue;
        }

        if(Array.isArray(listValue)) {
          const newListValue = {};
          newListValue[key] = listValue;
        }

        if(typeof listValue === 'object') {

        }
      }

      // TODO: array in array nono
      // sequential.push()

      sequential.push(`${key}:\n${value.map(item => `- ${item}\n`).join('')}`);

      continue;
    }

    if(typeof value === 'object') {
      if(value instanceof Date) {
        sequential.push(`${key}: ${value.toISOString()}\n`);
      } else {
        trailing.push( renderSectionKey(depth, key) );
        trailing.push(`\n${dump(value, depth + 1)}`);
      }

      continue;
    }
  }

  return [].concat(sequential, trailing).join('\n');
};


const dumped = dump(example);

console.log(dumped);
