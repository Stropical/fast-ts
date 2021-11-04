import { DepthClass } from './util'
import { Builder } from './builder'
import { ArcVar } from './variables';
import { BinExpHandle } from './binExp';

export function FunctionHandle(obj, self) {
    self.currentFuncName = obj.name.escapedText
    self.currentLevel = DepthClass.Local;

    self.currentReturnType = obj.type.kind;
    if(self.currentReturnType == "TypeReference") {
        self.currentReturnType = obj.type.typeName.escapedText;
    }   

    obj.parameters.forEach(element => {
        let type = element.type.kind;
        if(type == "TypeReference") {
            type = obj.type.typeName.escapedText;
        } 
        self.currentFuncParams.push(new ArcVar(element.name.escapedText, type))
    });
    self.iterate(obj.body, self);
}

export function BlockHandle(obj, self) {
    //Start new builder for block
    let blockBuilder: Builder = new Builder(obj.statements, null, true);
    if(self.verbose) { blockBuilder.verbose = true; }

    obj.statements.forEach(element => {
        blockBuilder.iterate(element, blockBuilder);
    });

    let blockCode = blockBuilder.finish('Block1');

    self.construct.addFunction(self.currentFuncName, blockCode, self.currentFuncParams, self.currentReturnType)
    self.currentFuncParams = []; //Reset params
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

export function CallHandle(obj, self) {
    console.log("Call Handle")
    let funcName = obj.expression.escapedText;
    let args = [];
    obj.arguments.forEach(element => {
        switch(element.kind) {
            case "Identifier": break;
            case "FirstLiteralToken": args.push(element.text); break;
        }
    });

    if(self.isExpression) { 
        self.isExpression = false;
        self.construct.addCallFunc(CallHandleCxxObj(funcName, args), true);
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
