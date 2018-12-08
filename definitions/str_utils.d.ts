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
/**
 * Returns length of format indicator and formatted string.
 * @param format
 * @param param
 */
export declare function format_single(format: string[], param: any): string;
