const boolean = ({ context, name, value }) => {
  const lower = value.trim().toLowerCase();

  if(lower === 'true') return true;
  if(lower === 'false') return false;
  if(lower === 'yes') return true;
  if(lower === 'no') return false;

  throw context.messages.loaders.invalidBoolean(name);
};

const color = ({ context, name, value }) => {
  if(!value.match(/^\s*#[0-9a-f]{3}([0-9a-f]{3})?\s*$/i)) {
    throw context.messages.loaders.invalidColor(name);
  }

  return value;
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
  const match = /^\s*(\d{4})(?:-(\d\d)(?:-(\d\d)(?:T(\d\d):(\d\d)(?::(\d\d)(?:\.(\d+))?)?(?:(Z)|([+\-])(\d\d):(\d\d)))?)?)?\s*$/.exec(value);

  if(!match) {
    throw context.messages.loaders.invalidDatetime(name);
  }

  return new Date(value);
};

const email = ({ context, name, value }) => {
  if(!value.match(/^\s*[^@\s]+@[^@\s]+\.[^@\s]+\s*$/)) {
    throw context.messages.loaders.invalidEmail(name);
  }

  return value;
};

const float = ({ context, name, value }) => {
  if(!value.match(/^\s*-?\d+(\.\d+)?\s*$/)) {
    throw context.messages.loaders.invalidFloat(name);
  }

  return parseFloat(value);
};

const integer = ({ context, name, value }) => {
  if(!value.match(/^\s*-?\d+\s*$/)) {
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
  const match = /(\d+\.\d+),\s*(\d+\.\d+)/.exec(value);

  if(!match) {
    throw context.messages.loaders.invalidCoordinates(name);
  }

  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
};

const url = ({ context, name, value }) => {
  if(!value.match(/^\s*https?:\/\/[^\s.]+\.\S+\s*$/)) {
    throw context.messages.loaders.invalidUrl(name);
  }

  return value;
};

module.exports = {
  boolean,
  color,
  email,
  float,
  integer,
  json,
  latLng,
  number: integer,
  datetime,
  url
};
