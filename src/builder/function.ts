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
        case "Identifier": self.construct.addReturn(obj.expression, self, obj.escapedText);
        case "BinaryExpression": 
            self.iterate(obj.expression, self);
            self.construct.addReturn(obj.expression, self, self.currentBinExp);
            self.currentBinExp = "";
            break;

    }
    
}