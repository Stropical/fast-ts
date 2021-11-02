import * as fs from 'fs';
import * as path from 'path'
import { Config, CLI } from './cli'
import { NitroTheme } from './theme'
let NT = new NitroTheme();

//Parse command line args
let cliParser = new CLI(["-o"], ["-A", "-L", "-O"]) //Emit AST Tree, Emit C++ Code, Generate Obj instead of EXE
let options = cliParser.parseArgs();

//Get mainfile name
let mainFileName: string = "main", filePath: string;
let outOption: string = options.options.find(e => e = "-o")['-o'];
if(outOption) {
    let lastSlash = outOption.lastIndexOf('/');
    let lastDot = outOption.lastIndexOf('.');

    filePath = outOption.substring(0, lastSlash + 1);
    mainFileName = outOption.substring(lastSlash + 1, lastDot);
}

let AstString: string = "";

if(options.inputFiles.length == 0) {
    console.log(NT.Bold() + "nitro: " + NT.Red() + "fatal error: " + NT.Reset() + "no input files")
    process.exit(1);
} else {
    options.inputFiles.forEach((file) => {
        if(!fs.existsSync(file)) {
            console.log(NT.Bold() + "nitro: " + NT.Red() + "fatal error: " + NT.Reset() + "can't find file: " + file)
            process.exit(1);
        }
    })
}

if(!fs.existsSync(filePath)) {
    console.log(NT.Bold() + "nitro: " + NT.Red() + "fatal error: " + NT.Reset() + "can't find out dir: " + filePath)
    process.exit(1);
}

//Start code generation


//End code generation

//Write final files
if(options.options.includes('-A')) {
    fs.writeFileSync(filePath + mainFileName + '.json', AstString);
}