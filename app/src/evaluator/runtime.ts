import { CustomConsole } from '../utils/console';

export class RuntimeFactory {
    constructor(private customConsole: CustomConsole) {}

    private print = () => {};
    private flush = () => {};
    private getchar = () => {};
    private ord = () => {};
    private chr = () => {};
    private size = () => {};
    private substring = () => {};
    private concat = () => {};
    private not = () => {};
    private exit = () => {};
    private alloc_array = () => {};
    private alloc_record = () => {};
    private check_index_array = () => {};
    private check_nil = () => {};
    private str_equals = () => {};
    private str_not_equals = () => {};
    private str_less = () => {};
    private str_less_or_equals = () => {};
    private str_greater = () => {};
    private str_greater_or_equals = () => {};

    build = (): Record<string, WebAssembly.ImportValue> => ({
        print: this.print,
        flush: this.flush,
        getchar: this.getchar,
        ord: this.ord,
        chr: this.chr,
        size: this.size,
        substring: this.substring,
        concat: this.concat,
        not: this.not,
        exit: this.exit,
        alloc_array: this.alloc_array,
        alloc_record: this.alloc_record,
        check_index_array: this.check_index_array,
        check_nil: this.check_nil,
        str_equals: this.str_equals,
        str_not_equals: this.str_not_equals,
        str_less: this.str_less,
        str_less_or_equals: this.str_less_or_equals,
        str_greater: this.str_greater,
        str_greater_or_equals: this.str_greater_or_equals,
    });
}