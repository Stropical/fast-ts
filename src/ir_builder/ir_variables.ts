export class IRArcVar {
    varName: string = "";
    literal: string = "";
    type: IRVarType;

    constructor(name?: string, type?: IRVarType, literal?: string) {
        this.varName = name;
        this.type = type;
        this.literal = literal;
    }
}

export enum IRVarType {
    i8,
    i32
}