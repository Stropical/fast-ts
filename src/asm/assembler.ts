import * as fs from "fs";
import { exec } from 'child_process'

export class Assembler {

    outPath: string

    constructor(outPath: string) {
        this.outPath = outPath;
    }

    constructObjs() {
        fs.copyFileSync('./src/asm/Makefile', this.outPath + 'Makefile');
        let make = exec('cd ' + this.outPath + ' && make main', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            console.log(stdout)
        })
    }
}