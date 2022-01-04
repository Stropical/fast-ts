import { SourceFileHandle } from '../builder/containers';
import { IRArcVar, IRVarType } from './ir_variables'

class Declaration {

}



class IRInstruction {
    opcode: string;
    args: IRArcVar[];

    constructor(opcode: string, args: IRArcVar[]) {
        this.opcode = opcode;
        this.args = args;
    }

    
}

class IRFunction {
    name: string;
    returnType: IRVarType;
    params: Array<IRArcVar> = [];
    blocks: Array<IRBlock> = [new IRBlock()];
    localDefines: Array<IRArcVar> = [];

    constructor() {

    }

    findDef(name: string): IRArcVar | boolean {
        this.localDefines.forEach(def => {
            if (def.varName == name) {
                return def;
            }
        });

        return false;
    }
}

class IRBlock {
    instructions: Array<IRInstruction> = [];
}

class CodeGen {
    builderRef: any;

    //Header vars
    headerStr: String;
    moduleID: string;
    target: string;

    //Declares
    declareStr: string
    declaredSymbols: Array<Declaration>

    //Functions
    funcs: Array<IRFunction>

    constructor(builderRef) {
        this.builderRef = builderRef
    }

    createHeader() {
        switch(this.target) {
            case "linux": this.target = "x86_64-pc-linux-gnu"
        }

        this.headerStr += "; ModuleID = '" + this.moduleID + "'"
        this.headerStr += 'target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"'
        this.headerStr += 'source_filename = "' + this.moduleID + '"'
        this.headerStr += 'target triple = "' + this.target + '"' 
    }

    renderInstruction(ins: IRInstruction): string {
        return ""
    }

    renderParams(params: Array<IRArcVar>): string {
        let paramStr = "";
        params.forEach((param, i) => {
            if(i == params.length - 1) {  //If last param
                paramStr += IRVarType[param.type] + " %" + i; 
            } else {
                paramStr += IRVarType[param.type] + " %" + i + ", "; 
            }
            
        })

        return paramStr;
    }

    renderFunc(func: IRFunction) {
        let funcStr: string = "";
        let paramStr: string = this.renderParams(func.params);

        funcStr += "define dso_local " + IRVarType[func.returnType] + " @" + func.name + "(" + paramStr + ") {"
        
        func.blocks[0].instructions.forEach(instruction => {
            funcStr += this.renderInstruction(instruction) + "\r\n"
        })

        funcStr += "}"
        return funcStr;
    }
}

function IRSourceFileHandle(obj, self) {
    self.codeGen.moduleID = self.name;
    self.codeGen.target = "linux";
    self.codeGen.createHeader();

    obj.statements.forEach((stm) => {
        self.iterate(stm, self);
    });
}

function convertType(tsType: string): IRVarType {
    switch(tsType) {
        case "NumberKeyword": return IRVarType.i32; break;
        case "Identifier": return IRVarType.Identifier; break;
    }
}

function IRFuncHandle(obj, self) {
    let func: IRFunction = new IRFunction();
    func.name = obj.name.escapedText;
    func.returnType = convertType(obj.type.kind);
    obj.parameters.forEach((param) => {
        let paramVar: IRArcVar = new IRArcVar(param.name.escapedText, convertType(param.type.kind));
        func.params.push(paramVar);
    });

    self.currentFunc = func;

    self.iterate(obj.body, self);
    console.log(self.codeGen.renderFunc(func))
}

function IRBlockHandle(obj, self) {
    let block: IRBlock = new IRBlock();
    obj.statements.forEach((stm) => {
        self.iterate(stm, self);
    });
}

function IRReturnStatementHandle(obj, self) {
    let returnType: IRVarType = convertType(obj.expression.type.kind);

    switch (returnType) {
        case IRVarType.Identifier:  self.currentFunc.findDef(obj.expression.type.escapedText); break; //Find identifier
    }

    let returnVar: IRArcVar = new IRArcVar(obj.expression.escapedText, );

    if(self.currentFunc.returnType == returnVar.type) {
        self.currentFunc.instructions.push(new IRInstruction("ret", [returnVar]));
    } else {
        throw (new Error("Invalid return type"));
    }
}

export class IRBuilder {
    //Main sources
    rawCode: String;
    codeObj: Object;
    outPath: string;
    name: string;

    //Temps
    currentFunc: IRFunction;

    //Classes
    codeGen: CodeGen = new CodeGen(this);

    //Flags
    isBlock: boolean;
    verbose: boolean = true;

    constructor(codeObj: Object, outPath?: string, isBlock?: boolean) {
        this.codeObj = codeObj;
        this.outPath = outPath;
        this.isBlock = isBlock;
    }

    iterate(obj, self) {
        if(this.verbose) { console.log(obj.kind) }
        switch(obj.kind) {
            case "SourceFile": IRSourceFileHandle(obj, self); break;
            case "FunctionDeclaration": IRFuncHandle(obj, self); break;
            case "Block": IRBlockHandle(obj, self); break;
            case "VariableDeclarationList": IRReturnStatementHandle(obj, self); break;
            case "ReturnStatement": IRReturnStatementHandle(obj, self); break;
        }
    }

    start(mainFileName: string) {
        this.name = mainFileName;
        this.iterate(this.codeObj, this);
    }
}