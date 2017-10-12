export default class Formatter {
    /**
     * Formats and prints a string like in python.
     * @param format Format, supported types are s,d,i,f,j
     * @param params Parameters to insert in format
     */
    static printf(format: string, ...params: any[]): void;
    /**
     * Formats a string like in python.
     * @param format Format, supported types are s,d,i,f,j
     * @param params Parameters to insert in format
     */
    static fmt(format: string, ...params: any[]): string;
    /**
     * Returns length of format indicator and formatted string.
     * @param format
     * @param param
     */
    static format_single(format: string[], param: any): string;
}
