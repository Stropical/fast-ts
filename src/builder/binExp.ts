export function BinExpHandle(obj, self, sub?: boolean) {
    let left = obj.left;
    let right = obj.right;
    let op = obj.operatorToken;

    let finalStr: string;
    let subRight: string, subLeft: string;

    let RFltFlag: boolean = false, LFltFlag: boolean = false;

    

    switch(obj.left.kind) {
        case "Identifier": break;
        case "FirstLiteralToken": LFltFlag = true; break;
        default: 
            console.log("Sub-expresison")
            subRight = SubBinExpHandle(obj.right, self);
            break;
    }

    switch(obj.right.kind) {
        case "Identifier": break;
        case "FirstLiteralToken": RFltFlag = true; break;
        default: 
            console.log("Sub-expresison")
            subRight = SubBinExpHandle(obj.right, self);
            break;
    }

    let leftRaw: string;
    if(LFltFlag) { leftRaw = left.text } else { leftRaw = left.escapedText }

    let rightRaw: string;
    if(RFltFlag) { rightRaw = right.text } else { rightRaw = right.escapedText }
    

    if(subLeft) {
        finalStr = subLeft + " " + OpHandle(op.kind) + " " + rightRaw;
    } else if (subRight) {
        finalStr = leftRaw + " " + OpHandle(op.kind) + " " + subRight;
    } else if (subLeft && subRight) {
        finalStr = subLeft + " " + OpHandle(op.kind) + " " + subRight;
    } else {
        
        finalStr = leftRaw + " " + OpHandle(op.kind) + " " + rightRaw;
    }

    
    if(sub) {
        return finalStr;
    } else {
        console.log("BinaryEXP: " + finalStr);
        self.currentBinExp = finalStr;
    }

}

function OpHandle(op) {
    switch(op) {
        case "PlusToken": return "+"; break;
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