//Handles anything with variables
import { DepthLevel, DepthClass } from './util'
import { BinExpHandle, UnaryHandle } from './binExp'

export class ArcVar {
    varName: string = "";
    literal: string = "";
    type: string = "";

    constructor(name?: string, type?: string, literal?: string) {
        this.varName = name;
        this.type = type;
        this.literal = literal;
    }
}

export function VariableDeclarationListHandle(obj, self) {
    let varDecList: Array<ArcVar> = [];

    for(var i = 0; i < obj.declarations.length; i++) {
        let v: ArcVar = new ArcVar();
        v.varName = obj.declarations[i].name.escapedText;
        v.literal = obj.declarations[i].initializer.text;

       /* if(!obj.declarations[i].type.kind) {      TODO: Throw error if code is not hard typed ex let x: number
            throw new Error("Type needs to be defined for FastTS to run")
        } */


        v.type = obj.declarations[i].type.kind;

        if(obj.declarations[i].initializer.kind != "Identifier") {
            
        }

        switch (obj.declarations[i].initializer.kind) {
            case "Identifier": v.literal = obj.declarations[i].initializer.text;
            case "PrefixUnaryExpression": UnaryHandle(obj.declarations[i].initializer, self); v.literal = self.currentBinExp; break;
            case "BinaryExpression": 
                self.iterate(obj.declarations[i].initializer, self);
                v.literal = self.currentBinExp;
                self.currentBinExp = "";
                break;
            case "CallExpression":
                self.iterate(obj.declarations[i].initializer, self);
                v.literal = self.currentBinExp;
                break;
            case "FalseKeyword": v.literal = "false"; break;
            case "TrueKeyword": v.literal = "true"; break;
    
        }

        if(v.type == "TypeReference") {
            v.type = obj.declarations[i].type.typeName.escapedText;
        }   

        varDecList.push(v);
        CxxVarConstructor(v, self.currentLevel, self);
    }

    if(self.verbose) { console.log(varDecList) }
}

export function CxxVarConstructor(v: ArcVar, d: DepthLevel, self, param?: boolean) {
    let cType = v.type, cString = "";


    if(v.literal) {
        cString = cType + " " + v.varName + " = " + v.literal + ";";
    } else if (param) { 
        cString = cType + " " + v.varName;
    } else {
        cString = cType + " " + v.varName + ";"
    }

    if(param) {
        return cString;
    } else {
        self.construct.addGlobal(cString);
    }
}

export function FirstStatementHandle(obj, self) {
    self.iterate(obj.declarationList, self);
}