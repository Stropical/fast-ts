import { DepthLevel, DepthClass } from './util'
import { ArcVar, CxxVarConstructor } from './variables'

export class CodeConstructor {
    codeStr: string = "";   //Main C++ file
    exportStr: string = " //Export file \r\n"; //Main Header file
    globals: Array<string> = [];
    includes: Array<string> = [];
    builderRef: any;    //Self (Reference to builder)

    constructor(builderRef) {
        this.builderRef = builderRef;
    }

    //Functions for generating C++ files
    initCodeFile() {
        this.codeStr += '// ARCC Generated Code\r\n'
        this.codeStr += '// Version 1.0.0 \r\n'
        this.codeStr += '\r\n'
        this.codeStr += '#include "arc.hpp"\r\n'
        this.codeStr += '\r\n'
    }

    include(file: string) {
        this.includes.push('#include "' + file + '"\r\n')
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

    addIfStatement(condition: string, innerCode: string, elseIfFlag: boolean) {
        if(elseIfFlag) {
            this.codeStr += "else if (" + condition + ") { \r\n";    
        } else {
            this.codeStr += "if (" + condition + ") { \r\n";    
        }
        
    }

    addElseStatement(condition: string, innerCode: string) {
        this.codeStr += "else { \r\n";     
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

    //Header creation files
    addExport(name, params?: Array<ArcVar>, returnType?: string) {
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
        this.exportStr += rtType + ' ' + name + ' (' + paramStr + ');'
    }

    //Finalizing functions
    finalizeFile() {
        //Write globals
        this.globals.forEach((line) => {
            this.codeStr += line + "\r\n";
        })

        //Insert Includes
        let includeStr: string = "";
        this.includes.forEach((line) => {
            includeStr += line;
        })

        //66 is length of initCodeFile func output - 1
        this.codeStr = this.codeStr.slice(0, 65) + includeStr + this.codeStr.slice(65);

        return this.codeStr;
    }

    finalizeHeader() {
        return this.exportStr;
    }

    finalizeBlock() {
        return this.codeStr;
    }
}
