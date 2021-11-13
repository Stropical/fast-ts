import * as fs from 'fs';
import * as path from 'path'
import { Config, CLI } from './cli'
import { NitroTheme } from './theme'
import { setupErrorCode } from './error/error';
import { AstGenerator } from './ast/ast'
import { Builder } from './builder/builder'
import { Assembler } from './asm/assembler'

let NT = new NitroTheme();

//Parse command line args
let cliParser = new CLI(["-o"], ["-A", "-L", "-O", "-V"]) //Emit AST Tree, Emit C++ Code, Generate Obj instead of EXE, verbose
let options = cliParser.parseArgs();

//Check if verbose
let verbose: boolean = false;
if(options.options.includes('-V')) {
    verbose = true;
}

//Setup Error Codes
setupErrorCode(verbose);


//Get mainfile name
let mainFileName: string = "main", filePath: string;
let outOption: string, outObj: Object = options.options.find(e => e = "-o");
if(outObj) { outOption = outObj['-o'] }

if(outOption) {
    let lastSlash = outOption.lastIndexOf('/');
    let lastDot = outOption.lastIndexOf('.');

    filePath = outOption.substring(0, lastSlash + 1);
    mainFileName = outOption.substring(lastSlash + 1, lastDot);
}

if(options.inputFiles.length == 0) {
    console.log(NT.Bold() + "FTSC: " + NT.Red() + "fatal error: " + NT.Reset() + "no input files")
    process.exit(1);
} else {
    options.inputFiles.forEach((file) => {
        if(!fs.existsSync(file)) {
            console.log(NT.Bold() + "FTSC: " + NT.Red() + "fatal error: " + NT.Reset() + "can't find file: " + file)
            process.exit(1);
        }
    })
}

if(!fs.existsSync(filePath)) {
    console.log(NT.Bold() + "FTSC: " + NT.Red() + "fatal error: " + NT.Reset() + "can't find out dir: " + filePath)
    process.exit(1);
}

// ##### Start code generation #####
//AST GEN
let rawCode = fs.readFileSync(options.inputFiles[0], 'utf-8')
let ASTGen = new AstGenerator(mainFileName + '.ts', rawCode);
let AST = JSON.parse(ASTGen.generateAST());
let AstOut = JSON.stringify(AST, null, 2);

if(options.options.includes('-A')) {
    fs.writeFileSync(filePath + mainFileName + '.json', AstOut);
}

//Build code
let builder = new Builder(AST, filePath + mainFileName, false);
builder.verbose = verbose;
builder.rawCode = rawCode;
builder.start(mainFileName);

let asmGen = new Assembler(filePath);
asmGen.constructObjs();

//End code generation

//Write final files
