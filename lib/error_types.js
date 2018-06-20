const nodeEnviroment = () => {
  try {
    return this === global;
  } catch(e) {
    return false;
  }
};

class EnoError extends Error {
  constructor(text, snippet, selection) {
    super(`${text}\n\n${snippet}`);

    this.selection = selection;
    this.snippet = snippet;
    this.text = text;

    if(nodeEnviroment()) {
      Error.captureStackTrace(this, EnoError);
    }
  }

  get cursor() {
    return this.selection ? this.selection[0] : null;
  }
}

class EnoParseError extends EnoError {
  constructor(...args) {
    super(...args);

    if(nodeEnviroment()) {
      Error.captureStackTrace(this, EnoParseError);
    }
  }
}

class EnoValidationError extends EnoError {
  constructor(...args) {
    super(...args);

    if(nodeEnviroment()) {
      Error.captureStackTrace(this, EnoValidationError);
    }
  }
}

module.exports = {
  EnoError,
  EnoParseError,
  EnoValidationError
};
