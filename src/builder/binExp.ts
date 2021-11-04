import { CallHandle } from './function'

export function BinExpHandle(obj, self, sub?: boolean) {
    let left = obj.left;
    let right = obj.right;
    let op = obj.operatorToken;

    let finalStr: string;
    let subRight: string, subLeft: string;

    let RFltFlag: boolean = false, LFltFlag: boolean = false;

    let leftRaw: string, rightRaw: string;

    switch(obj.left.kind) {
        case "Identifier": break;
        case "FirstLiteralToken": LFltFlag = true; break;
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

    console.log("FINAL STR: " + finalStr)
    if(sub) {
        return finalStr;
    } else {
        if(self.verbose) { console.log("BinaryEXP: " + finalStr); }
        
        self.currentBinExp = finalStr;
    }

}

function OpHandle(op) {
    switch(op) {
        case "PlusToken": return "+"; break;
        case "MinusToken": return "-"; break;
        case "LessThanEqualsToken": return "<="; break;
    }
}

function SubBinExpHandle(obj, self) {
    if(obj.kind == "ParenthesizedExpression") {
        return "(" + BinExpHandle(obj.expression, self, true) + ")";
    }   
}

/*
export function ParenExprHandle(obj, self) {
    //Don't use builder here so we can get final string after func
    switch(obj.expression.kind) {
        case "ParenthesizedExpression": ParenExprHandle(obj, self); break;
    }
}

*/