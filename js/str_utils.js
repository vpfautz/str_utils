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
            var currFormat = annotate_format(form);
            var t = format_single(currFormat, arguments.length <= param_index + 1 ? undefined : arguments[param_index + 1]);
            param_index++;
            i += currFormat.all.length;
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
function annotate_format(format) {
    var _format = _slicedToArray(format, 4),
        all = _format[0],
        first = _format[1],
        second = _format[2],
        type = _format[3];

    var f = {
        all: all,
        first: first,
        firsti: parseInt(first),
        second: second,
        secondi: parseInt(second),
        type: type.toLowerCase()
    };
    return f;
}
/**
 * Returns length of format indicator and formatted string.
 * @param format
 * @param param
 */
function format_single(format, param) {
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
function format_string(format, param) {
    var r = param.toString();
    if (format.first === undefined) {
        return r;
    } else {
        return pad(r, format.firsti);
    }
}
function format_percent(format, param) {
    if (typeof param !== "number") {
        throw "number expected, got '" + param + "'";
    }
    var newFormat = JSON.parse(JSON.stringify(format));
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
function format_integer(format, param) {
    if (typeof param !== "number") {
        throw "number expected, got '" + param + "'";
    }
    var r = Math.floor(param).toString();
    if (format.second) {
        if (format.secondi < 0) {
            throw "second parameter is negativ! '" + format.all + "'";
        }
        r = r.padStart(format.secondi, "0");
    }
    if (format.first) {
        // negativ padding is always " "
        var padding = format.first.startsWith("0") ? "0" : " ";
        r = pad(r, format.firsti, padding);
    }
    return r;
}
function format_float(format, param) {
    if (typeof param !== "number") {
        throw "number expected, got '" + param + "'";
    }
    var r = param.toFixed(6);
    if (format.second) {
        if (format.secondi < 0) {
            throw "second parameter is negativ! '" + format.all + "'";
        }
        r = param.toFixed(format.secondi);
    }
    if (format.first) {
        // negativ padding is always " "
        var padding = format.first.startsWith("0") ? "0" : " ";
        r = pad(r, format.firsti, padding);
    }
    return r;
}