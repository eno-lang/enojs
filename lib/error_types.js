class EnoError extends Error {
  constructor(text, snippet, selection) {
    super(`${text}\n\n${snippet}`);

    this.selection = selection;
    this.snippet = snippet;
    this.text = text;

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, EnoError);
    }
  }

  get cursor() {
    return this.selection[0];
  }
}

class EnoParseError extends EnoError {
  constructor(...args) {
    super(...args);

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, EnoParseError);
    }
  }
}

class EnoValidationError extends EnoError {
  constructor(...args) {
    super(...args);

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, EnoValidationError);
    }
  }
}

module.exports = {
  EnoError,
  EnoParseError,
  EnoValidationError
};
