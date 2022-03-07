//Util

export enum DepthClass {
    Global,
    Local,
}

export class DepthLevel {
    dc: DepthClass
    depth: number;

    constructor() {
        this.depth = 0;
    }
}

export function Header() {
    let header: string = "";

    header += '// ARCC Generated Code\r\n'
    header += '// Version 1.0.0 \r\n'
    header += '\r\n'
    header += '#include "arc.hpp"\r\n'
    header += '\r\n'

    return header;
}