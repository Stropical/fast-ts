import { SourceFileHandle } from '../builder/containers';
import { IRArcVar, IRVarType } from './ir_variables'

class Declaration {

}

class IRFunction {
    name: string;
    returnType: IRVarType;
    params: Array<IRArcVar> = [];
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
        this.headerStr += 'source_filename = "' + this.moduleID + '"'
        this.headerStr += 'target triple = "' + this.target + '"' 
    }

    renderFunction(func: IRFunction) {
        let funcStr: string = "";
        funcStr += "define dso_local " + IRVarType[func.returnType] + " " + func.name

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
    }
}

function IRFuncHandle(obj, self) {
    let func: IRFunction = new IRFunction();
    func.name = obj.name.escapedText;
    func.returnType = convertType(obj.type.kind);

    console.log(self.codeGen.renderFunc(func))
}

export class IRBuilder {
    //Main sources
    rawCode: String;
    codeObj: Object;
    outPath: string;
    name: string;

    //Temps
    currentFuncName: string;
    currentFuncParams: Array<IRArcVar> = [];

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
        }
    }

    start(mainFileName: string) {
        this.name = mainFileName;
        this.iterate(this.codeObj, this);
    }
}