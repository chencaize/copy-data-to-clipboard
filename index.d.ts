interface Options {
    debug?: boolean;
    message?: string;
}

declare function copy(text: string, options?: Options): boolean;
declare namespace copy { }
export = copy;