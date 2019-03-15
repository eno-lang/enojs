# Changelog

## 0.18.0 / `2019-03-15`

#### End of life Announcement

The eno notation language is en route to its final version and **enojs will reach end of life by 2020.**   
enojs is superseded by the [enolib](https://www.npmjs.com/package/enolib) (core library) and [enotype](https://www.npmjs.com/package/enotype) (type library) packages.

Please visit https://eno-lang.org to read up on all changes.

## 0.17.2 / `2018-12-23`

#### Fixed

- Fix faulty block syntax edge case behavior, harden escape patterns `b0ca7a8`

## 0.17.1 / `2018-12-22`

#### Fixed

- Fix critical line boundary crossing in unescaped name regex pattern `ebe1348`

## 0.17.0 / `2018-12-22`

#### Changed

- **[BREAKING]** Switch to dependency-injection based reporter architecture `8660a5e`

  Necessary changes: Any calls to `eno.parse` that supply a custom reporter, e.g. ...
  ```js
  const eno = require('enojs');

  eno.parse(input, { reporter: 'html' })
  ```

  ... now need to supply the reporter class instead of a string:
  ```js
  const eno = require('enojs');
  const { HtmlReporter } = require('enojs');  // Alternatively: TerminalReporter, TextReporter

  eno.parse(input, { reporter: HtmlReporter })
  ```

#### Fixed

- Add missing encoding to readFileSync call in README example (Ken Bellows) `c17edb4`

#### Performance

- Optimize reporter line classification `ea42b9f`

#### Maintenance

- Move user-facing document explanation approach out of library `a251ce1`
- Replace legacy appendices terminology in specs `6977331`
- Correct fieldset spec implementation not following description `650978d`
- Refactor empty element spec setup `607cb4f`
- Correct cyclic dependency spec label for the selection assertions `81031e9`
- Remove unused dependency in analyzer specs `7057416`
- Update jest `47acc3d`, `5779527`
- Simplify locale check in parse entry point `f5e6dbd`
- Correct mislabeled analysis spec`cfc04a9`
- Simplify superfluous snapshot tests for error selection ranges `aa8f352`

## 0.16.1 / `2018-08-09`

#### Added

- Early exit optimizations in section accessor structural validation `d6b7bc1`

#### Fixed

- Associate block subinstructions with the related Field element `f45b4cd`

## 0.16.0 / `2018-07-22`

#### Added

- Support for noop deep-copy on non-section elements `b3974f8`

#### Changed

- Dropped `Eno` prefixes for all classes except `EnoError` `c381928`
- Renamed `Value` to `Field`, resolving `value.value()` ambiguities `c381928`

#### Removed

- Dropped development dependency on `prettier` and jest inline snapshots `7437e23`

## 0.15.0 / `2018-07-21`

#### Added

- enojs now maintains a changelog `dac3e45`

#### Changed

- New `Fieldset` terminology replaces all `Dictionary` wordings `a988163`

## <= 0.14.1

See git history
