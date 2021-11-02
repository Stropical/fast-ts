//Handles the main flow of code blocks

import * as fs from 'fs'
import { SourceFileHandle, FirstStatementHandle } from './containers'
import { VariableDeclarationListHandle, ArcVar } from './variables'
import { FunctionHandle, BlockHandle, ReturnHandle } from './function'
import { CodeConstructor } from './contructor'
import { DepthLevel, DepthClass } from './util'
import { BinExpHandle } from './binExp'

export class Builder {
    //Main sources
    codeObj: Object;

    //Temps
    currentLevel: DepthLevel = new DepthLevel();
    currentFuncName: string;
    currentFuncParams: Array<ArcVar> = [];
    currentBinExp: string = "";

    //Classes
    construct: CodeConstructor = new CodeConstructor(this);

    //Flags
    isBlock: boolean = false;
    outPath: string;

    constructor(codeObj: Object, outPath?: string, isBlock?: boolean) {
        this.codeObj = codeObj;
        this.currentLevel.dc = DepthClass.Global;
        this.isBlock = isBlock;
        this.outPath = outPath;
        
        if(!this.isBlock) {
            this.construct.initCodeFile();
        }
    }

    iterate(obj, self) {
        console.log(obj.kind)
        switch(obj.kind) {
            case "SourceFile": SourceFileHandle(obj, self); break;
            case "FirstStatement": FirstStatementHandle(obj, self); break;
            case "VariableDeclarationList": VariableDeclarationListHandle(obj, self); break;
            case "FunctionDeclaration": FunctionHandle(obj, self); break;
            case "Block": BlockHandle(obj, self); break;
            case "ReturnStatement": ReturnHandle(obj, self); break;
            case "BinaryExpression": BinExpHandle(obj, self); break;
            default: "Type unknown: " + obj.kind;
        }
    }

    start(name: string) {
        this.iterate(this.codeObj, this);

        let CxxFile: string;
        if(this.isBlock) {
            CxxFile = this.construct.finalizeBlock();
        } else {
            CxxFile = this.construct.finalizeFile();
        }
        
        if(this.outPath) {
            fs.writeFileSync(this.outPath + '.cpp', CxxFile);
        }
    }

    finish(name: string) {
        let CxxFile: string;
        if(this.isBlock) {
            CxxFile = this.construct.finalizeBlock();
        } else {
            CxxFile = this.construct.finalizeFile();
        }

        if(this.outPath) {
            fs.writeFileSync(this.outPath + '.cpp', CxxFile);
        }
        
        return CxxFile;
    }
}