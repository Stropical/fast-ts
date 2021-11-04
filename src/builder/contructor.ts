import { DepthLevel, DepthClass } from './util'
import { ArcVar, CxxVarConstructor } from './variables'

export class CodeConstructor {
    codeStr: string = "";
    globals: Array<string> = [];
    builderRef: any;    //Self

    constructor(builderRef) {
        this.builderRef = builderRef;
    }

    initCodeFile() {
        this.codeStr += '// ARCC Generated Code\r\n'
        this.codeStr += '// Version 1.0.0 \r\n'
        this.codeStr += '\r\n'
        this.codeStr += '#include "arc.hpp"\r\n'
        this.codeStr += '\r\n'
    }

    addCallFunc(innerCode: string, eol: boolean) {
        this.codeStr += innerCode;
        if(eol) { this.codeStr += ";\r\n" }
        
    }

    addGlobal(str: string) {
        this.codeStr += str + "\r\n";
    }

    addReturn(obj, self, innerCode) {
        this.codeStr += "return ";
        this.codeStr += innerCode;
        this.codeStr += ";\r\n";
    }

    addIfStatement(condition:string, innerCode: string) {
        this.codeStr += "if (" + condition + ") { \r\n";     
    }

    finishIf() {
        this.codeStr += "} \r\n";
    }

    addFunction(name: string, innerCode: string, params?: Array<ArcVar>, returnType?: string) {
        //Assemble parameter string
        let dc = new DepthLevel()
        dc.dc = DepthClass.Global;

        let paramStrs: Array<string> = [], paramStr: string = "";

        if(params) {
            params.forEach((v) => {
                paramStrs.push(CxxVarConstructor(v, dc, this.builderRef, true));
            })
        }
        
        for(var i = 0; i < params.length; i++) {
            paramStr += paramStrs[i];
            if(i < params.length - 1) {  //Check if not last, then add comma
                paramStr += ', '
            } 
        } 
        

        //Assemble function
        let rtType: string = "";
        if(returnType) { rtType = returnType } else { rtType = "void"}
        this.codeStr += rtType + ' ' + name + ' (' + paramStr + ') {\r\n'
        this.codeStr += innerCode + '\r\n';
        this.codeStr += '}\r\n'
    }

    writeStraightCode(innerCode: string) {
        this.codeStr += innerCode
    }
    
    finalizeFile() {
        //Write globals
        this.globals.forEach((line) => {
            this.codeStr += line + "\r\n";
        })

        return this.codeStr;
    }

    finalizeBlock() {
     

        return this.codeStr;
    }
}
