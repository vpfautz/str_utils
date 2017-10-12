function pad(s: string, n: number, padding = " "): string {
  return n < 0 ? s.padEnd(-n, padding) : s.padStart(n, padding);
}

export default class Formatter {
  /**
   * Formats a string like in python.
   * @param format Format, supported types are s,d,i,f,j
   * @param params Parameters to insert in format
   */
  static fmt(format: string, ...params: any[]): string {
    let result = "";
    let param_index = 0;
    for (let i = 0; i < format.length; i++) {
      if (format[i] == "%") {
        if (i + 1 < format.length && format[i + 1] == "%") {
          result += "%";
          i++;
          continue
        }
        let form: string[] = format.slice(i + 1).match(/^(-?\d+)?(?:\.(\d+))?([sfdj])/);
        if (form === null) {
          throw "Invalid format";
        }

        if (param_index >= params.length) {
          throw "Too less params given!";
        }
        let t = Formatter.format_single(form, params[param_index]);
        param_index++;
        i += form[0].length;
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

  /**
   * Returns length of format indicator and formatted string.
   * @param format
   * @param param
   */
  static format_single(format: string[], param: any): string {
    let [x, first, second, typ] = format;
    let firsti = parseInt(first);
    let secondi = parseInt(second);
    typ = typ.toLowerCase();

    if (typ == "s") {
      let r = param.toString();
      if (first === undefined) {
        return r;
      } else {
        return pad(r, firsti);
      }
    } else if (typ == "j") {
      return JSON.stringify(param);
    } else if (typ == "d" || typ == "i") {
      if (typeof param !== "number") {
        throw "number expected!";
      }
      let r = Math.floor(param).toString();
      if (second) {
        if (secondi < 0) {
          throw "unsupported format character";
        }
        r = r.padStart(secondi, "0");
      }

      if (first) {
        // negativ padding is always " "
        let padding = first.startsWith("0") ? "0" : " ";
        r = pad(r, firsti, padding);
      }

      return r;
    } else if (typ == "f") {
      if (typeof param !== "number") {
        throw "number expected!";
      }
      let r = param.toFixed(6);
      if (second) {
        if (secondi < 0) {
          throw "unsupported format character";
        }
        r = param.toFixed(secondi);
      }

      if (first) {
        // negativ padding is always " "
        let padding = first.startsWith("0") ? "0" : " ";
        r = pad(r, firsti, padding);
      }

      return r;
    } else {
      throw "Unknown format"
    }
  }
}
