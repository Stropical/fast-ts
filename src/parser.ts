// The bulk of the logic for the compiler lives here
// Instead of opting for the Lexer --> Parser --> AST approach, 
// I opted for the Parser directly assembling a codegen object

import { IToken } from '@msnraju/lexer';
import { TargetType, IRModule, IRType, IRAttribute, IRVariable, IRDeclare, IRAttrType, IRFunction, IRInstruction, IROp } from './codegen';
import { assembleExpression, ParserExpression, ExprType } from './binexp';

//Glopal variables
let line: Array<IToken> = [];
let currentInstructions = Array<IRInstruction>();
let currentVars = Array<IRVariable>();

export function ArcParse (tokens: Array<IToken>) {
    //Create module
    let mod: IRModule = new IRModule("main", TargetType.LINUX);

    //Parse imports -- TODO: Only supports printf import
    mod.addImport(new IRDeclare(IRType.i32, "printf", [
        new IRVariable("", IRType.i8Ptr, [
            new IRAttribute(IRAttrType.readonly), 
            new IRAttribute(IRAttrType.nocapture)
        ]),
        new IRVariable("", IRType.triDot, [])
    ]));

    //Parse tokens
    let currentFunc: IRFunction = new IRFunction(IRType.i32, "");
    let currentParams: Array<IRVariable> = [];
    let currentParam: IRVariable = new IRVariable("", IRType.i32);
    
    //0: Func key word, 1: Func name, 2? (skipped) 3: LPAREN, 4: Params, 5: RPAREN
    //6: COLON 7: Return Type 8: LBRAC, 9: Instructions, 10: RBRAC
    let defFuncStage: number = 0;  

    //0: Name, 1: COLON, 2: Type
    let paramStage: number = 0;


    //Top level handler
    tokens.forEach(tok => {
        if(defFuncStage == 9) {
            let ins = renderInnerFunction(tok, currentFunc)
            if(ins) {
                currentFunc.ins = ins;
                defFuncStage = 10;
            }
        }
        switch (tok.type) {
            case "FUNCTION":
                defFuncStage = 1;
                break;
            case "VALUE":
                if(defFuncStage == 1) { //Func key word
                    currentFunc.name = tok.value;
                    defFuncStage = 3;
                } else if(defFuncStage == 4 && paramStage == 0) { //Param name
                    currentParam.name = tok.value;
                    paramStage = 1;
                } else if (defFuncStage == 7) { //Return type for func
                    currentFunc.type = IRType[tok.value];
                    defFuncStage = 8;
                }

                if(paramStage == 2 && defFuncStage == 4) {  //Param type
                    currentParam.type = IRType[tok.value];  //Set type and complete param
                    currentParams.push(currentParam);
                    currentParam = new IRVariable("", IRType.i32); //Reset
                    paramStage = 0; //Reset
                }
                break;
            case "LPAREN":
                if (defFuncStage == 3) {
                    defFuncStage = 4;  // Start looking for params
                }
                break;
            case "RPAREN":
                if (defFuncStage == 4 || defFuncStage == 5) { 
                    defFuncStage = 6; 
                }
                break;
            case "COLON":
                if(paramStage = 1) { paramStage = 2; }
                if (defFuncStage == 6) { defFuncStage = 7; }
                break;
            case "LBRAC":
                if (defFuncStage == 8) {
                    //Push params to func
                    currentFunc.params = currentParams;
                    currentParams = [];
                    defFuncStage = 9;
                 }
                break;
            case "RBRAC":
                if (defFuncStage == 10) { 
                    mod.addFunction(currentFunc)
                    currentFunc = new IRFunction(IRType.i32, ""); // Reset currentFunc
                    defFuncStage = 0; //Reset flags
                }
                break;
            default:
                break;
        }
    })

    return mod;
}

export function findVariable(name: string): IRVariable {
    return currentVars.find(v => v.name == name);
}

function renderInnerFunction(tok: IToken, currentFunc: IRFunction): Array<IRInstruction> | undefined {  //Return instructions when complete
    //Handle line by line instructions
    currentVars = currentFunc.params;
    
    if(line.length == 0) {
        line.push(tok);
    } else {
        if(tok.type == "SEMICOLON") {
            // MAIN PARSING DONE HERE
            // Check if last token is semicolon, then parse line
            
            switch(line[0].type) {
                case "LET":
                    let varName: string = line[1].value;
                    let varType: IRType = IRType[line[3].value];
    
                    let varValue: IRVariable = new IRVariable(varName, varType);
                    currentVars.push(varValue);

                    currentInstructions.push(new IRInstruction(IROp.alloca, IRType.i32, [ new IRAttribute(IRAttrType.align, 4)], []));

                    if(line[4].type == "EQUALS") {
                        //Handle literal assingment
                        currentInstructions.push(new IRInstruction(IROp.store, IRType.i32, [ new IRAttribute(IRAttrType.align, 4)], [line[5].value, varValue.name]));
                    }

                    line = [];  // Reset line
                    break;
                case "RETURN":
                    let expr: ParserExpression = assembleExpression(line.slice(1));

                    if(expr.type == ExprType.expression) {
                        expr.extraInstructions.forEach(element => {
                            currentInstructions.push(element);    
                        });
                    }

                    switch(expr.type) {
                        case ExprType.literal: currentInstructions.push(new IRInstruction(IROp.ret, IRType.i32, [], [expr.expr])); break;
                        case ExprType.variable: currentInstructions.push(new IRInstruction(IROp.ret, IRType[findVariable(expr.expr).type], [], ["%" + expr.expr])); break;
                        case ExprType.expression: currentInstructions.push(new IRInstruction(IROp.ret, IRType.i32, [], ["lastReg"])); break;
                    }
                    break;
            }

        } else {
            line.push(tok);
        }
    }
    
    if(tok.type == "RBRAC") {
        return currentInstructions;
    } else {
        return undefined;
    }
}


