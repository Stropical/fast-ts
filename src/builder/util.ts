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