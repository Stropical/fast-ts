import * as fs from "fs";
import { exec } from 'child_process'

const compileCommand = "clang++ "

export class Assembler {

    outPath: string

    constructor(outPath: string) {
        this.outPath = outPath;
    }

    constructObjs() {
        /*
        let make = exec('cd ' + this.outPath + ' && make main', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            console.log(stdout)
        })
        */
    }
}