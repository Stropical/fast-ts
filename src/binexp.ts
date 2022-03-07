import { IToken } from '@msnraju/lexer';
import { IRInstruction, IROp, IRType } from './codegen';

// Class Setup
export enum ExprType {
    literal,
    variable,
    expression
}

export class ParserExpression {
    expr: string;
    extraInstructions: Array<IRInstruction> = [];
    type: ExprType;

    constructor(public _expr: string, public _type: ExprType) {
        this.expr = _expr;
        this.type = _type;
    }
}

export class Node {
    left: any;
    right: any;
    op: string;

    constructor(_left, _right, _op) {
        this.left = _left;
        this.right = _right;
        this.op = _op;
    }
    
}

// Final function, mainly use this one
export function assembleExpression(tokArr: Array<IToken>): ParserExpression {
    // Handle literal or variable references
    if(tokArr.length == 1) {
        if(tokArr[0].type == "NUMBER") {
            return new ParserExpression(tokArr[0].value, ExprType.literal);
        } else {
            return new ParserExpression(tokArr[0].value, ExprType.variable);
        }
    } else {
        // Handle binary expressions
        let exprStr = tokArr.map(t => t.value).join("");
        
        let bnode = addHandle(exprStr);
        nodeTreeToIR(bnode);
        console.log(bnode, ins);

        let pExp = new ParserExpression("", ExprType.expression);
        pExp.extraInstructions = ins;
        ins = [];
        
        return pExp;
        
    }
}

// This system is layered in tiers
//   Each tier calls the next layer deep
//      1. Addition
//      2. Subtraction
//      3. Multiplication
//   Once put into a node tree use the func nodeTreeToIR get the IR instructions

function mulHandle(expr: any) {
    let baseNode: any;
    let prev: any = 0;
    let numStr = expr.split("*")
    
    numStr.forEach(num => {
        var curNode = new Node(prev, num, "*"); // Create new node with prev and current

        // Garbage cleaning
        if (curNode.left == 0) {
            curNode = curNode.right;
        }

        prev = curNode;
        baseNode = curNode;
    });

    if(baseNode.left == 0) {
        return baseNode.right;
    } else {
        return baseNode;
    }
}

function subHandle(expr: any) {
    let baseNode: any;
    let prev: any = 0;
    let numStr = expr.split("-")

    numStr = numStr.map(num => mulHandle(num)); // Next tier down
    
    numStr.forEach(num => {
        var curNode = new Node(prev, num, "-"); // Create new node with prev and current

        // Garbage cleaning
        if (curNode.left == 0) {
            curNode = curNode.right;
        }

        prev = curNode;
        baseNode = curNode;
    });

    if(baseNode.left == 0) {
        return baseNode.right;
    } else {
        return baseNode;
    }
}

function addHandle(expr: any) {
    let baseNode: any;
    let prev: any = 0;
    let numStr = expr.split("+")

    numStr = numStr.map(num => subHandle(num)); // Next tier down
    
    numStr.forEach(num => {
        var curNode = new Node(prev, num, "+"); // Create new node with prev and current

        // Garbage cleaning
        if (curNode.left == 0) {
            curNode = curNode.right;
        }

        prev = curNode;
        baseNode = curNode;
    });

    if(baseNode.left == 0) {
        return baseNode.right;
    } else {
        return baseNode;
    }
}

var ins: Array<IRInstruction> = [];
function nodeTreeToIR(baseNode: Node): IRInstruction {
    var op: IROp
    
    switch(baseNode.op) {
        case "+": op = IROp.add; break;
        case "-": op = IROp.sub; break;
        case "*": op = IROp.mul; break;
    }
    
    if(typeof baseNode.left == "string" && typeof baseNode.right == "string") {
        var retIns = new IRInstruction(op, IRType.i32, [], [baseNode.left, baseNode.right]);
        ins.push(retIns);
        return retIns;
    } else {
        if(typeof baseNode.right == "object" && typeof baseNode.left == "object") {
            var rNode = nodeTreeToIR(baseNode.right);
            var lNode = nodeTreeToIR(baseNode.left);

            var retIns = new IRInstruction(op, IRType.i32, [], ["REF:" + lNode.id, "REF:" + rNode.id]);
            ins.push(retIns);
            return retIns;
        }

        if(typeof baseNode.right == "object") {
            var rNode = nodeTreeToIR(baseNode.right);

            var retIns = new IRInstruction(op, IRType.i32, [], [baseNode.left, "REF:" + rNode.id]);
            ins.push(retIns);
            return retIns;
        }

        if(typeof baseNode.left == "object") {
            var lNode = nodeTreeToIR(baseNode.left);

            var retIns = new IRInstruction(op, IRType.i32, [], ["REF:" + lNode.id, baseNode.right]);
            ins.push(retIns);
            return retIns;
        }
    }
}