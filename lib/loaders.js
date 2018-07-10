const COLOR_REGEXP = /^\s*#[0-9a-f]{3}([0-9a-f]{3})?\s*$/i;
const DATE_REGEXP = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/;
const DATETIME_REGEXP = /^\s*(\d{4})(?:-(\d\d)(?:-(\d\d)(?:T(\d\d):(\d\d)(?::(\d\d)(?:\.(\d+))?)?(?:(Z)|([+\-])(\d\d):(\d\d)))?)?)?\s*$/;
const EMAIL_REGEXP = /^\s*[^@\s]+@[^@\s]+\.[^@\s]+\s*$/;
const FLOAT_REGEXP = /^\s*-?\d+(\.\d+)?\s*$/;
const INTEGER_REGEXP = /^\s*-?\d+\s*$/;
const LAT_LNG_REGEXP = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;
const URL_REGEXP = /^\s*https?:\/\/[^\s.]+\.\S+\s*$/;

const boolean = ({ context, name, value }) => {
  const lower = value.trim().toLowerCase();

  if(lower === 'true') return true;
  if(lower === 'false') return false;
  if(lower === 'yes') return true;
  if(lower === 'no') return false;

  throw context.messages.loaders.invalidBoolean(name);
};

const color = ({ context, name, value }) => {
  if(!value.match(COLOR_REGEXP)) {
    throw context.messages.loaders.invalidColor(name);
  }

  return value;
};

const commaSeparated = ({ value }) => value.split(',').map(item => item.trim());

const date = ({ context, name, value }) => {
  const match = DATE_REGEXP.exec(value);

  if(!match) {
    throw context.messages.loaders.invalidDate(name);
  }

  const year = parseInt(match[1]);
  const month = parseInt(match[2]);
  const day = parseInt(match[3]);

  return new Date(Date.UTC(year, month - 1, day));
};

// Format specification thankfully taken from https://www.w3.org/TR/NOTE-datetime
//
// 1997
// 1997-07
// 1997-07-16
// 1997-07-16T19:20+01:00
// 1997-07-16T19:20:30+01:00
// 1997-07-16T19:20:30.45+01:00
// 1994-11-05T08:15:30-05:00
// 1994-11-05T13:15:30Z
const datetime = ({ context, name, value }) => {
  const match = DATETIME_REGEXP.exec(value);

  if(!match) {
    throw context.messages.loaders.invalidDatetime(name);
  }

  // TODO: Re-implement without depending on fragile and inconsistent dateString parsing implementation
  return new Date(value);
};

const email = ({ context, name, value }) => {
  if(!value.match(EMAIL_REGEXP)) {
    throw context.messages.loaders.invalidEmail(name);
  }

  return value;
};

const float = ({ context, name, value }) => {
  if(!value.match(FLOAT_REGEXP)) {
    throw context.messages.loaders.invalidFloat(name);
  }

  return parseFloat(value);
};

const integer = ({ context, name, value }) => {
  if(!value.match(INTEGER_REGEXP)) {
    throw context.messages.loaders.invalidInteger(name);
  }

  return parseInt(value);
};

const json = ({ context, name, value }) => {
  try {
    return JSON.parse(value);
  } catch(err) {
    throw context.messages.loaders.invalidJson(name, err.message);
  }
};

const latLng = ({ context, name, value }) => {
  const match = LAT_LNG_REGEXP.exec(value);

  if(!match) {
    throw context.messages.loaders.invalidLatLng(name);
  }

  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
};

const url = ({ context, name, value }) => {
  if(!value.match(URL_REGEXP)) {
    throw context.messages.loaders.invalidUrl(name);
  }

  return value;
};

module.exports = {
  boolean,
  color,
  commaSeparated,
  date,
  datetime,
  email,
  float,
  integer,
  json,
  latLng,
  number: integer,
  url
};
