/**
 * Formats and prints a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
export declare function printf(format: string, ...params: any[]): void;
/**
 * Formats a string like in python.
 * @param format Format
 * @param params Parameters to insert in format
 */
export declare function fmt(format: string, ...params: any[]): string;
declare type FormatType = {
    all: string;
    first: string;
    firsti: number;
    second: string;
    secondi: number;
    type: string;
};
/**
 * Apply a single format to a parameter.
 * @param format
 * @param param
 */
export declare function format_single(format: FormatType, param: any): string;
export {};
