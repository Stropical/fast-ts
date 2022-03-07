enum IRType {
    i8 = "i8",
    i8Ptr = "i8*",
    i32 = "i32",
    triDot = "...",
}

enum TargetType {
    "LINUX",
}

enum IRAttrType {
    inline = "inline",
    nocapture = "nocapture",
    readonly = "readonly",
    align = "align",
}

class IRAttribute {
    type: IRAttrType;
    data: string | number | undefined;

    constructor(public _type: IRAttrType, _data?: string | number) {
        this.type = _type;
        this.data = _data;
    }

    toIRString() {
        return `${this.type} ${this.data}`;
    }
}

class IRInstruction {
    public op: IROp;
    type: IRType;
    attributes: IRAttribute[];
    args: Array<any> = [];
    operands: string[];

    irOps: Array<Object> = [
        {"op": "add", "type": "i32", "operands": ["i32", "i32"]},
    ];

    constructor(public _op: IROp, public _type: IRType, public _attributes: IRAttribute[], _args?: Array<any>) {
        this.op = _op;
        this.type = _type;
        this.attributes = _attributes;
        this.args = _args;
    }
}

class IRVariable {
    name: string;
    type: IRType;
    attributes: Array<IRAttribute>;
    isTripleDot: boolean = false;

    constructor(_name: string, _type: IRType, _attributes?: Array<IRAttribute>) {
        this.name = _name;
        this.type = _type;
        this.attributes = _attributes;
    }
}

class IRDeclare {
    public type: IRType
    public name: string
    public params: Array<IRVariable> = [];

    constructor(type: IRType, name: string, params?: Array<IRVariable>) {
        this.type = type
        this.name = name
        this.params = params
    }
}

enum IROp {
    add = "add",
    call = "call",
    alloca = "alloca",
    ret = "ret",
}

class IRFunction {
    public type: IRType
    public name: string
    public params: Array<IRVariable> = [];
    public ins: Array<IRInstruction> = [];

    constructor(op: IROp, type: IRType, name: string, params?: Array<IRVariable>, ins?: Array<IRInstruction>) {
        this.type = type
        this.name = name
        this.params = params
        this.ins = ins
    }
}

class IRModule {
    //Vars
    public name: string;
    public target: TargetType;

    //Internal
    private header: string = "";
    private imports: Array<IRDeclare> = [];
    private functions: Array<IRFunction> = [];
    private currentRegNum: number = 1;

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

    //Render the module
    renderHeader() {
        return `; ModuleID = "${this.name}"
source_filename =" ${this.name}"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "${this.convertTarget(this.target)}"`
    }

    renderParameters(params: Array<IRVariable>) {
        return params.map(importDeclare => importDeclare.type.toString() + " " + importDeclare.attributes.map(atr => atr.type.toString()).join(" ")).join(", ");
    }

    renderImports() {
        let tempString: string = "";

        this.imports.forEach(importDeclare => {
            tempString += `declare dso_local ${IRType[importDeclare.type]} @${importDeclare.name}(${this.renderParameters(importDeclare.params)})`
        });

        return tempString;
    }

    renderInstruction(instruction: IRInstruction) {
        let regNum = this.currentRegNum;

        switch (instruction.op) {
            case IROp.alloca:
                let attrs: string = instruction.attributes.map(atr => atr.toIRString()).join(", ");
                if(attrs.length > 0) { attrs = ", " + attrs; }
                this.currentRegNum++;
                return `\t%${this.currentRegNum - 1} = alloca ${instruction.type}${attrs}`;
                break;
            case IROp.ret:
                return `\tret ${instruction.type} ${instruction.args[0]}`;
        }
    }

    renderFunctions() {
        let tempString: string = "";

        this.functions.forEach(func => { 
            tempString += `define dso_local ${IRType[func.type]} @${func.name}(${this.renderParameters(func.params)}) { \r\n`
            tempString += func.ins.map(ins => this.renderInstruction(ins)).join("\n");
            tempString += "\r\n}"
        });

        return tempString;
    }

    renderModule() {
        return `${this.renderHeader()}

${this.renderImports()}

${this.renderFunctions()}
        `
    }
}

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
    new IRInstruction(IROp.ret, IRType.i32, [], ['0']),
]));

console.log(mod.renderModule());