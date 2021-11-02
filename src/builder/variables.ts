//Handles anything with variables
import { DepthLevel, DepthClass } from './util'
import { BinExpHandle } from './binExp'

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
        v.type = obj.declarations[i].type.kind;

        if(obj.declarations[i].initializer.kind != "Identifier") {
            
        }
        switch (obj.declarations[i].initializer.kind) {
            case "Identifier": v.literal = obj.declarations[i].initializer.text;
            case "BinaryExpression": 
                self.iterate(obj.declarations[i].initializer, self);
                v.literal = self.currentBinExp;
                self.currentBinExp = "";
                break;
    
        }

        if(v.type == "TypeReference") {
            v.type = obj.declarations[i].type.typeName.escapedText;
        }   

        varDecList.push(v);
        CxxVarConstructor(v, self.currentLevel, self);
    }

    console.log(varDecList)
}

export function CxxVarConstructor(v: ArcVar, d: DepthLevel, self, param?: boolean) {
    let cType = "", cString = "";
    switch(v.type) {
        case "NumberKeyword": cType = "ArcNumber"; break;
        case "StringKeyword": cType = "ArcStr"; break;
        default: cType = v.type;
    }

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
        if(d.dc == DepthClass.Global) {
            self.construct.addGlobal(cString);
        } else {
            //self.construct.createLocal(cString);
        }
    }
}

export function FirstStatementHandle(obj, self) {
    self.iterate(obj.declarationList, self);
}