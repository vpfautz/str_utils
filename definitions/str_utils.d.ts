export default class Formatter {
    static fmt(format: string, ...params: any[]): string;
    /**
     * Returns length of format indicator and formatted string.
     * @param format
     * @param param
     */
    static format_single(format: string[], param: any): string;
}
