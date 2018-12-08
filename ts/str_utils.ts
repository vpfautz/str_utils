function pad(s: string, n: number, padding = " "): string {
  return n < 0 ? s.padEnd(-n, padding) : s.padStart(n, padding);
}

/**
 * Formats and prints a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
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
        throw "Invalid format: " + format.slice(i, i + 6);
      }

      if (param_index >= params.length) {
        throw "Too less params given!";
      }
      let currFormat = annotateFormat(form);
      let t = format_single(currFormat, params[param_index]);
      param_index++;
      i += currFormat.all.length;
      result += t;
    } else {
      result += format[i];
    }
  }
  if (param_index < params.length) {
    throw "Too much params given!";
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

function annotateFormat(format: string[]): FormatType {
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
 * Returns length of format indicator and formatted string.
 * @param format
 * @param param
 */
export function format_single(format: FormatType, param: any): string {
  if (format.type == "s") {
    return format_string(format, param);
  } else if (format.type == "j") {
    return JSON.stringify(param);
  } else if (format.type == "p") {
    return format_percent(format, param);
  } else if (format.type == "d" || format.type == "i") {
    return format_integer(format, param);
  } else if (format.type == "f") {
    return format_float(format, param);
  } else {
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
  let newFormat = JSON.parse(JSON.stringify(format));
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

function format_integer(format: FormatType, param: any): string {
  if (typeof param !== "number") {
    throw "number expected, got '" + param + "'";
  }
  let r = Math.floor(param).toString();
  if (format.second) {
    if (format.secondi < 0) {
      throw "second parameter is negativ! '" + format.all + "'";
    }
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
    if (format.secondi < 0) {
      throw "second parameter is negativ! '" + format.all + "'";
    }
    r = param.toFixed(format.secondi);
  }

  if (format.first) {
    // negativ padding is always " "
    let padding = format.first.startsWith("0") ? "0" : " ";
    r = pad(r, format.firsti, padding);
  }

  return r;
}
