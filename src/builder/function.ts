import { DepthClass } from './util'
import { Builder } from './builder'
import { ArcVar } from './variables';
import { BinExpHandle } from './binExp';
import { StringLiteral } from './string';

export function FunctionHandle(obj, self) {
    self.currentFuncName = obj.name.escapedText
    self.currentLevel = DepthClass.Local;


    let exportFlag: boolean = false;
    let modifiers = obj.modifiers

    modifiers.forEach(mod => {
        switch (mod.kind) {
            case "ExportKeyword": exportFlag = true
        }
    })

    self.currentReturnType = obj.type.kind;
    if(self.currentReturnType == "TypeReference") {
        self.currentReturnType = obj.type.typeName.escapedText;
    }   

    obj.parameters.forEach(element => {
        let type = element.type.kind;
        if(type == "TypeReference") {
            type = obj.type.typeName.escapedText;
        } 
        self.currentFuncParams.push(new ArcVar(element.name.escapedText, type, ))
    });

    if(exportFlag) {
        self.construct.addExport(self.currentFuncName, self.currentFuncParams);
    }

    self.iterate(obj.body, self);
}

export function BlockHandle(obj, self, funcType: Boolean = true) {
    //Start new builder for block
    
    let blockBuilder: Builder = new Builder(obj.statements, null, true);
    if(self.verbose) { blockBuilder.verbose = true; }

    obj.statements.forEach(element => {
        blockBuilder.iterate(element, blockBuilder);
    });

    let blockCode = blockBuilder.finish('Block1');

    if(funcType) {
        self.construct.addFunction(self.currentFuncName, blockCode, self.currentFuncParams, self.currentReturnType)
        self.currentFuncParams = []; //Reset params
    } else {
        self.construct.writeStraightCode(blockCode);
    }
}

export function ReturnHandle(obj, self) {
    switch (obj.expression.kind) {
        case "Identifier": self.construct.addReturn(obj.expression, self, obj.expression.escapedText); break;
        case "BinaryExpression": 
            self.iterate(obj.expression, self);
            self.construct.addReturn(obj.expression, self, self.currentBinExp);
            self.currentBinExp = "";
            break;
    }
}

export function CallHandle(obj, self, subCall?: boolean) {
    let funcName: string;
    let args = [];

    switch(obj.expression.kind) {
        case "Identifier": funcName = obj.expression.escapedText; break;
        case "PropertyAccessExpression": funcName = obj.expression.expression.escapedText + "::" + obj.expression.name.escapedText; break;
    }

    obj.arguments.forEach(element => {
        switch(element.kind) {
            case "Identifier": args.push(element.escapedText); break;
            case "StringLiteral": args.push(StringLiteral(element, self)); break;
            case "FirstLiteralToken": args.push(element.text); break;
            case "BinaryExpression": args.push(BinExpHandle(element, self, true)); break;
            case "CallExpression": 
                args.push(CallHandle(element, self, true))
        }
    });

    if(self.isExpression && !subCall) { 
        self.isExpression = false;
        self.construct.addCallFunc(CallHandleCxxObj(funcName, args), true);
    } else if(subCall) {
        return CallHandleCxxObj(funcName, args);;
    } else {
        self.currentBinExp = CallHandleCxxObj(funcName, args);
    }
}

export function ExpressionStatementHandle(obj, self) {
    self.isExpression = true;
    self.iterate(obj.expression, self);
}

function CallHandleCxxObj(name: string, args: Array<string>) {
    let argsStr: string = "";
    for(var i = 0; i < args.length; i++) {
        argsStr += args[i];
        if(i < args.length - 1) {  //Check if not last, then add comma
            argsStr += ', '
        } 
    }

    return name + '(' + argsStr + ')'
}
