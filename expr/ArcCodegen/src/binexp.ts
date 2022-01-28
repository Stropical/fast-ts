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
        console.log(addHandle(exprStr));
        /*
        let extraIns: Array<IRInstruction> = BinExpHandle(exprStr);
        console.log(binExp);

        let pExp = new ParserExpression("", ExprType.expression);
        pExp.extraInstructions = extraIns;
        
        return pExp;
        */
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

function nodeTreeToIR(baseNode: Node) {

}