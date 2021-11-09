import { CallHandle } from './function'

export function BinExpHandle(obj, self, sub?: boolean) {
    let left = obj.left;
    let right = obj.right;
    let op = obj.operatorToken;

    let finalStr: string;
    let subRight: string, subLeft: string;
    let RFltFlag: boolean = false, LFltFlag: boolean = false, singleFlag: boolean = false;
    let leftRaw: string, rightRaw: string;

    //Catch single variable binary expressions
    if(!obj.left && obj.kind) {
        singleFlag = true;
    }

    if(!singleFlag) {
        switch(obj.left.kind) {
            case "Identifier": break;
            case "FirstLiteralToken": LFltFlag = true; break;
            case "PrefixUnaryExpression": UnaryHandle(obj.left, self); subLeft = self.currentBinExp; break;
            case "CallExpression": 
                self.isCallExpression = true;
                CallHandle(obj.left, self);
                subLeft = self.currentBinExp;
            break;
            default: 
                if(self.verbose) { console.log("Sub-expresison") }
                subLeft = SubBinExpHandle(obj.right, self);
                break;
        }
    
        //Reset flags
    
        switch(obj.right.kind) {
            case "Identifier": break;
            case "FirstLiteralToken": RFltFlag = true; break;
            case "PrefixUnaryExpression": UnaryHandle(obj.left, self); subRight = self.currentBinExp; break;
            case "CallExpression": 
                self.isCallExpression = true;
                CallHandle(obj.right, self);
                subRight = self.currentBinExp;
                self.isCallExpression = false;
            break;
            default: 
                if(self.verbose) { console.log("Sub-expresison") }
                subRight = SubBinExpHandle(obj.right, self);
                break;
        }
    
        //Check if value is stored in .text or .escapedText
        if(LFltFlag) { leftRaw = left.text } else { leftRaw = left.escapedText }
        if(RFltFlag) { rightRaw = right.text } else { rightRaw = right.escapedText }
        
    
        if(subLeft && !subRight) {
            finalStr = subLeft + " " + OpHandle(op.kind) + " " + rightRaw;
        } else if (subRight && !subLeft) {
            finalStr = leftRaw + " " + OpHandle(op.kind) + " " + subRight;
        } else if (subLeft && subRight) {
            finalStr = subLeft + " " + OpHandle(op.kind) + " " + subRight;
        } else {
            finalStr = leftRaw + " " + OpHandle(op.kind) + " " + rightRaw;
        }
    
        if(sub) {
            return finalStr;
        } else {
            if(self.verbose) { console.log("BinaryEXP: " + finalStr); }
            
            self.currentBinExp = finalStr;
        }
    } else {
        //Is single arg (just uses left vars for simplicity)
        switch(obj.kind) {
            case "Identifier": break;
            case "FirstLiteralToken": LFltFlag = true; break;
            case "PrefixUnaryExpression": UnaryHandle(obj, self); subLeft = self.currentBinExp; break;
            case "CallExpression": 
                self.isCallExpression = true;
                CallHandle(obj.left, self);
                subLeft = self.currentBinExp;
            break;
            /*default:      TODO : Sub Sub parantheses bin exprs: 10 + (-10((10))
                if(self.verbose) { console.log("Sub-expresison") }
                subLeft = SubBinExpHandle(obj.right, self);
                break; */
        }

        finalStr = subLeft;

        if(sub) {
            return finalStr;
        } else {
            if(self.verbose) { console.log("BinaryEXP: " + finalStr); }
            
            self.currentBinExp = finalStr;
        }
    }
    

}

function OpHandle(op) {
    switch(op) {
        case "PlusToken": return "+"; break;
        case "MinusToken": return "-"; break;
        case "GreaterThanToken": return ">"; break;
        case "LessThanToken": return "<"; break;
        case "LessThanEqualsToken": return "<="; break;
        case "GreaterThanEqualsToken": return "<="; break;
    }
}

function SubBinExpHandle(obj, self) {
    if(obj.kind == "ParenthesizedExpression") {
        return "(" + BinExpHandle(obj.expression, self, true) + ")";
    }   
}

export function UnaryHandle(obj, self) {
    let unaryExpr: string = "";
    if(obj.operator == 40) {
        
        unaryExpr += "-"
    }

    switch(obj.operand.kind) {
        case "Identifier": break;
        case "FirstLiteralToken": unaryExpr += obj.operand.text; break;
    }

    self.currentBinExp = unaryExpr;
}

/*
export function ParenExprHandle(obj, self) {
    //Don't use builder here so we can get final string after func
    switch(obj.expression.kind) {
        case "ParenthesizedExpression": ParenExprHandle(obj, self); break;
    }
}

*/