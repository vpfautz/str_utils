"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.printf = printf;
exports.fmt = fmt;
exports.format_single = format_single;
function pad(s, n) {
    var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";

    return n < 0 ? s.padEnd(-n, padding) : s.padStart(n, padding);
}
/**
 * Formats and prints a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
function printf(format) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
    }

    console.log(fmt.apply(undefined, [format].concat(params)));
}
/**
 * Formats a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
function fmt(format) {
    var result = "";
    var param_index = 0;
    for (var i = 0; i < format.length; i++) {
        if (format[i] == "%") {
            if (i + 1 < format.length && format[i + 1] == "%") {
                result += "%";
                i++;
                continue;
            }
            var form = format.slice(i + 1).match(/^(-?\d+)?(?:\.(\d+))?([sfdijp])/i);
            if (form === null) {
                throw "Invalid format: " + format.slice(i, i + 6);
            }
            if (param_index >= (arguments.length <= 1 ? 0 : arguments.length - 1)) {
                throw "Too less params given!";
            }
            var t = format_single(form, arguments.length <= param_index + 1 ? undefined : arguments[param_index + 1]);
            param_index++;
            i += form[0].length;
            result += t;
        } else {
            result += format[i];
        }
    }
    if (param_index < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
        throw "Too much params given!";
    }
    return result;
}
/**
 * Returns length of format indicator and formatted string.
 * @param format
 * @param param
 */
function format_single(format, param) {
    var _format = _slicedToArray(format, 4),
        x = _format[0],
        first = _format[1],
        second = _format[2],
        typ = _format[3];

    var firsti = parseInt(first);
    var secondi = parseInt(second);
    typ = typ.toLowerCase();
    if (typ == "s") {
        var r = param.toString();
        if (first === undefined) {
            return r;
        } else {
            return pad(r, firsti);
        }
    } else if (typ == "j") {
        return JSON.stringify(param);
    } else if (typ == "p") {
        if (typeof param !== "number") {
            throw "number expected, got '" + param + "'";
        }
        format[3] = "f";
        if (second === undefined) {
            format[2] = "1";
        }
        if (first !== undefined && firsti > 0) {
            format[1] = (firsti - 1).toString();
            if (first.startsWith("0")) {
                format[1] = "0" + format[1];
            }
        }
        return format_single(format, param * 100) + "%";
    } else if (typ == "d" || typ == "i") {
        if (typeof param !== "number") {
            throw "number expected, got '" + param + "'";
        }
        var _r = Math.floor(param).toString();
        if (second) {
            if (secondi < 0) {
                throw "second parameter is negativ! '" + x + "'";
            }
            _r = _r.padStart(secondi, "0");
        }
        if (first) {
            // negativ padding is always " "
            var padding = first.startsWith("0") ? "0" : " ";
            _r = pad(_r, firsti, padding);
        }
        return _r;
    } else if (typ == "f") {
        if (typeof param !== "number") {
            throw "number expected, got '" + param + "'";
        }
        var _r2 = param.toFixed(6);
        if (second) {
            if (secondi < 0) {
                throw "second parameter is negativ! '" + x + "'";
            }
            _r2 = param.toFixed(secondi);
        }
        if (first) {
            // negativ padding is always " "
            var _padding = first.startsWith("0") ? "0" : " ";
            _r2 = pad(_r2, firsti, _padding);
        }
        return _r2;
    } else {
        throw "Unknown format, type: '" + typ + "'";
    }
}