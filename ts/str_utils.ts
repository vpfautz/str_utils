import * as assert from "assert";
const stringWidth = require('string-width');


function pad(s: string, n: number, padding = " "): string {
  let norm = Math.abs(n) + s.length - stringWidth(s);
  return n < 0 ? s.padEnd(norm, padding) : s.padStart(norm, padding);
}

/**
 * Formats and prints a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
/* istanbul ignore next */
export function printf(format: string, ...params: any[]) {
  console.log(fmt(format, ...params));
}

/**
 * Formats a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
export function fmt(format: string, ...params: any[]): string {
  let result = "";
  let param_index = 0;
  for (let i = 0; i < format.length; i++) {
    if (format[i] == "%") {
      if (i + 1 < format.length && format[i + 1] == "%") {
        result += "%";
        i++;
        continue
      }
      let form: string[] = format.slice(i + 1).match(/^(-?\d+)?(?:\.(\d+))?([sfdijp])/i);
      if (form === null) {
        throw new FormatError(format, params, "Invalid format: " + format.slice(i, i + 6));
      }

      if (param_index >= params.length) {
        throw new FormatError(format, params, "Too less params given!");
      }
      let currFormat = annotate_format(form);
      let t;
      try {
        t = format_single(currFormat, params[param_index]);
      } catch (error) {
        throw new FormatError(format, params, error);
      }
      param_index++;
      i += currFormat.all.length;
      result += t;
    } else {
      result += format[i];
    }
  }
  if (param_index < params.length) {
    throw new FormatError(format, params, "Too many params given!");
  }
  return result;
}

type FormatType = {
  all: string,
  first: string,
  firsti: number,
  second: string,
  secondi: number,
  type: string,
};

function annotate_format(format: string[]): FormatType {
  let [all, first, second, type] = format;
  const f = {
    all,
    first,
    firsti: parseInt(first),
    second,
    secondi: parseInt(second),
    type: type.toLowerCase(),
  };
  return f;
}

/**
 * Apply a single format to a parameter.
 * @param format
 * @param param
 */
export function format_single(format: FormatType, param: any): string {
  switch (format.type) {
    case "s":
      return format_string(format, param);
    case "j":
      return JSON.stringify(param);
    case "p":
      return format_percent(format, param);
    case "d":
    case "i":
      return format_integer(format, param);
    case "f":
      return format_float(format, param);
    default:
      /* istanbul ignore next */
      throw "Unknown format, type: '" + format.type + "'";
  }
}

function format_string(format: FormatType, param: any): string {
  let r = param.toString();
  if (format.first === undefined) {
    return r;
  } else {
    return pad(r, format.firsti);
  }
}

function format_percent(format: FormatType, param: any): string {
  if (typeof param !== "number") {
    throw "number expected, got '" + param + "'";
  }
  let newFormat = clone(format);
  newFormat.type = "f";
  if (format.second === undefined) {
    newFormat.second = "1";
    newFormat.secondi = 1;
  }
  if (format.first !== undefined && format.firsti > 0) {
    newFormat.first = (format.firsti - 1).toString();
    if (format.first.startsWith("0")) {
      newFormat.first = "0" + newFormat.first;
    }
    newFormat.firsti = parseInt(newFormat.first);
  }
  return format_single(newFormat, param * 100) + "%";
}

function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

function format_integer(format: FormatType, param: any): string {
  if (typeof param !== "number") {
    throw "number expected, got '" + param + "'";
  }
  let r = Math.floor(param).toString();
  if (format.second) {
    assert.ok(format.secondi >= 0, "second value should be positiv");
    r = r.padStart(format.secondi, "0");
  }

  if (format.first) {
    // negativ padding is always " "
    let padding = format.first.startsWith("0") ? "0" : " ";
    r = pad(r, format.firsti, padding);
  }

  return r;
}

function format_float(format: FormatType, param: any): string {
  if (typeof param !== "number") {
    throw "number expected, got '" + param + "'";
  }
  let r = param.toFixed(6);
  if (format.second) {
    assert.ok(format.secondi >= 0, "second value should be positiv");
    r = param.toFixed(format.secondi);
  }

  if (format.first) {
    // negativ padding is always " "
    let padding = format.first.startsWith("0") ? "0" : " ";
    r = pad(r, format.firsti, padding);
  }

  return r;
}

class FormatError extends Error {
  format: string;
  params: any[];
  constructor(format: string, params: any[], msg: string) {
    const params_format = params.map(e => new String(e).toString()).join(", ");
    super(msg + " in '" + format + "' [" + params_format + "]");
    this.format = format;
    this.params = params;
  }
}
