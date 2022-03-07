import { BlockHandle } from './function'
import * as colors from 'colors'

export function IfHandle(obj, self, elseIfFlag: boolean = false) {
    console.log(colors.green('Else flag?: ' + elseIfFlag))
    switch(obj.expression.kind) {
        case "BinaryExpression": 
            self.iterate(obj.expression, self);
            self.construct.addIfStatement(self.currentBinExp, "", elseIfFlag);
            BlockHandle(obj.thenStatement, self, false)
            self.construct.finishIf();
        break;
        case "Identifier":
            self.construct.addIfStatement(obj.expression.escapedText + " == true", "", elseIfFlag);
            BlockHandle(obj.thenStatement, self, false)
            self.construct.finishIf();
    }
}


export function ElseStatementHandle(obj, self) {
    console.log(colors.green("ElseStatementHandle"), obj.kind);
    if(obj.kind == "IfStatement") {
        IfHandle(obj, self, true);
    } else if (obj.kind == "Block") {
        self.construct.addElseStatement();
        BlockHandle(obj, self, false)
        self.construct.finishIf();
    }
    
    if(obj.elseStatement) {
        ElseStatementHandle(obj.elseStatement, self);
    }
}