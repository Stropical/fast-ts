import { BlockHandle } from './function'

export function IfHandle(obj, self) {
    switch(obj.expression.kind) {
        case "BinaryExpression": 
            self.iterate(obj.expression, self);
            self.construct.addIfStatement(self.currentBinExp, "");
            BlockHandle(obj.thenStatement, self, false)
            self.construct.finishIf();
        break;
        case "Identifier":
            self.construct.addIfStatement(obj.expression.escapedText + " == true", "");
            BlockHandle(obj.thenStatement, self, false)
            self.construct.finishIf();
    }
}