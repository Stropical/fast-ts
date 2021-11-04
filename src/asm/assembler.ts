import * as fs from "fs";
import { exec } from 'child_process'

export class Assembler {

    outPath: string

    constructor(outPath: string) {
        this.outPath = outPath;
    }

    constructObjs() {
        fs.copyFileSync('./src/asm/common.mk', this.outPath + 'common.mk');
        let formatter = exec('make ' + this.outPath + 'common.mk', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            console.log(stdout)
        })
    }
}