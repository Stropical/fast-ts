export enum IRType {
    i8 = "i8",
    i8Ptr = "i8*",
    i32 = "i32",
    i32Ptr = "i32*",
    float = "float",
    triDot = "...",
}

export class IRArray {;
    type: IRType;
    length: number;
    pointer: boolean;

    constructor(public _type: IRType, public _length: number, pointer: boolean = false) {
        this.type = _type;
        this.length = _length;
        this.pointer = pointer;
    }
}

export enum TargetType {
    "LINUX",
}

export class IRGetElemPtr {
    public ptr: IRType | IRArray;
    public ptrType: IRType | IRArray;
    public reference: any
    public iNumOne: IRVariable | undefined;
    public iNumTwo: IRVariable | undefined;
    public iNumThree: IRVariable | undefined;

    constructor(
        public _ptr: IRType | IRArray,
        public _ptrType: IRType | IRArray,
        public _reference: any,
        public _iNumOne?: IRVariable,
        public _iNumTwo?: IRVariable,
        public _iNumThree?: IRVariable,
    ) {
        this.ptr = _ptr
        this.ptrType = _ptrType
        this.reference = _reference
        this.iNumOne = _iNumOne
        this.iNumTwo = _iNumTwo
        this.iNumThree = _iNumThree
    }   
}

export enum IRAttrType {
    inline = "inline",
    nocapture = "nocapture",
    readonly = "readonly",
    align = "align",
    inbounds = "inbounds",
}

export class IRAttribute {
    type: IRAttrType | IRGetElemPtr;
    data: string | number | undefined;

    constructor(public _type: IRAttrType | IRGetElemPtr, _data?: string | number) {
        this.type = _type;
        this.data = _data;
    }

    toIRString() {
        return `${this.type} ${this.data}`;
    }
}

let globalRegID = 0;
export class IRInstruction {
    public op: IROp;
    type: IRType;
    attributes: IRAttribute[];
    args: Array<any>;
    id: number;

    constructor(_op: IROp, _type: IRType, _attributes: IRAttribute[], _args?: Array<any>) {
        this.op = _op;
        this.type = _type;
        this.attributes = _attributes;
        this.args = _args || new Array<any>();
        this.id = globalRegID++;
    }
}

export class IRVariable {
    name: string;
    type: IRType;
    attributes: Array<IRAttribute>;
    isTripleDot: boolean = false;

    constructor(_name: string, _type: IRType, _attributes?: Array<IRAttribute>) {
        this.name = _name;
        this.type = _type;
        this.attributes = _attributes || [];
    }
}

export class IRDeclare {
    public type: IRType
    public name: string
    public params: Array<IRVariable> = [];

    constructor(type: IRType, name: string, params?: Array<IRVariable>) {
        this.type = type
        this.name = name
        this.params = params || []
    }
}

export enum IROp {
    add = "add",
    sub = "sub",
    mul = "mul",
    call = "call",
    alloca = "alloca",
    store = "store",
    load = "load",
    ret = "ret",
}

export class IRFunction {
    public type: IRType
    public name: string
    public params: Array<IRVariable> = [];
    public ins: Array<IRInstruction> = [];

    constructor(type: IRType, name: string, params?: Array<IRVariable>, ins?: Array<IRInstruction>) {
        this.type = type
        this.name = name
        this.params = params || []
        this.ins = ins || []
    }
}

export class IRModule {
    //Vars
    public name: string;
    public target: TargetType;

    //Internal
    private imports: Array<IRDeclare> = [];
    private functions: Array<IRFunction> = [];
    private currentRegNum: number = 1;
    private refRegPairs: Map<number, number> = new Map();

    constructor(public _name: string, public _target: TargetType) {
        this.name = _name;
        this.target = _target;
    }

    addImport(declare: IRDeclare) {
        this.imports.push(declare);
    }

    addFunction(func: IRFunction) {
        this.functions.push(func);
    }

    convertTarget(type: TargetType): string {
        switch (type) {
            case TargetType.LINUX:
                return "x86_64-pc-linux-gnu"
        }
    }

    convertReference(str: String) {
        console.log("Converting reference: " + JSON.stringify(str))
        if(str.startsWith("REF:")) {
            return "%" + this.refRegPairs.get(parseInt(str.substring(4)))
        } else {
            return str;
        }
    }

    convertToPointer(type: IRType): IRType {
        switch(type) {
            case IRType.i32: return IRType.i32Ptr; break;
            default: return IRType.i32Ptr;
        }
    }

    getNextReg() {
        this.currentRegNum++
        this.refRegPairs.set(this.currentRegNum, this.currentRegNum)
        return `%${this.currentRegNum}`;
    }

    //Render the module
    renderHeader() {
        return `; ModuleID = "${this.name}"
source_filename =" ${this.name}"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "${this.convertTarget(this.target)}"`
    }

    renderParameters(params: Array<IRVariable>) {
        return params.map((importDeclare) => importDeclare.type.toString() + " " + this.getNextReg() + " " +importDeclare.attributes.map(atr => atr.type.toString()).join(" ")).join(", ");
        
    }

    renderImports() {
        let tempString: string = "";

        this.imports.forEach(importDeclare => {
            tempString += `declare dso_local ${importDeclare.type.toString()} @${importDeclare.name}(${this.renderParameters(importDeclare.params)})`
        });

        return tempString;
    }

    renderInstruction(instruction: IRInstruction): Object {
        let regNum = this.currentRegNum++;
        console.log(this.refRegPairs);

        switch (instruction.op) {
            case IROp.alloca:
                let attrs: string = instruction.attributes.map(atr => atr.toIRString()).join(", ");
                if(attrs.length > 0) { attrs = ", " + attrs; }
                return `\t%${this.currentRegNum - 1} = alloca ${instruction.type}${attrs}`;
                break;
            case IROp.store:
                let sAttrs: string = instruction.attributes.map(atr => atr.toIRString()).join(", ");
                if(sAttrs.length > 0) { sAttrs = ", " + sAttrs; }
                return `\t%${this.currentRegNum - 1} = store ${instruction.type} ${instruction.args[0]}, ${this.convertToPointer(instruction.type)} %${this.currentRegNum - 2}${sAttrs}`;
                break;   
            case IROp.ret:
                if (instruction.args[0] == "lastReg") { instruction.args[0] = "%" + (regNum - 1); }
                return `\tret ${instruction.type} ${instruction.args[0]}`;
                break;
            case IROp.call:
                console.log(instruction)
                
                let callArgs: string = "";
                instruction.args[1].forEach(arg => {
                    if(arg.constructor.name == "IRGetElemPtr") {}
                    if(arg.constructor.name == "IRAttribute") {
                        callArgs += arg.type.toString()
                    }
                })

                return `\t%${regNum} = call ${instruction.type} @${instruction.args[0]}(${callArgs})`;
                break;
            case IROp.add:
                this.refRegPairs.set(instruction.id, regNum);
                return `\t%${regNum} = add ${instruction.type} ${this.convertReference(instruction.args[0])} ${this.convertReference(instruction.args[1])}`;
                break;
            case IROp.sub:
                this.refRegPairs.set(instruction.id, regNum);
                return `\t%${regNum} = sub ${instruction.type} ${this.convertReference(instruction.args[0])} ${this.convertReference(instruction.args[1])}`;
                break;
            case IROp.mul:
                this.refRegPairs.set(instruction.id, regNum);
                return `\t%${regNum} = mul ${instruction.type} ${this.convertReference(instruction.args[0])} ${this.convertReference(instruction.args[1])}`;
                break;
            default: return ""; break;
        }
    }

    renderFunctions() {
        let tempString: string = "";

        this.functions.forEach(func => { 
            this.currentRegNum = -1;
            tempString += `define dso_local ${func.type.toString()} @${func.name}(${this.renderParameters(func.params)}) { \r\n`
            this.currentRegNum += 2;
            tempString += func.ins.map(ins => this.renderInstruction(ins)).join("\n");
            tempString += "\r\n}\r\n\r\n"
        });

        return tempString;
    }

    renderModule() {
        return `${this.renderHeader()}

${this.renderImports()}

${this.renderFunctions()}`
    }
}


/*
let mod: IRModule = new IRModule("test.cpp", TargetType.LINUX);

mod.addImport(new IRDeclare(IRType.i32, "printf", [
    new IRVariable("", IRType.i8Ptr, [
        new IRAttribute(IRAttrType.readonly), 
        new IRAttribute(IRAttrType.nocapture)
    ]),
    new IRVariable("", IRType.triDot, [])
]));

mod.addFunction(new IRFunction(IROp.call, IRType.i32, "main", [], [
    new IRInstruction(IROp.alloca, IRType.i32, [new IRAttribute(IRAttrType.align, 4)]),
    new IRInstruction(IROp.alloca, IRType.i32, [new IRAttribute(IRAttrType.align, 4)]),
    new IRInstruction(IROp.call, IRType.i32, [], 
        ["printf", 
            [IRType.i8Ptr, 
            new IRGetElemPtr(
                new IRArray(IRType.i8, 4), 
                new IRArray(IRType.i8, 4, true), 
                "@.str", 
                new IRVariable("", IRType.i8)), 
            new IRAttribute(IRAttrType.inbounds), 
            ]]),
    new IRInstruction(IROp.ret, IRType.i32, [], ['0']),
]));

console.log(mod.renderModule());

*/