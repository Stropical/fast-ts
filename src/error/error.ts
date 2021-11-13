import { NitroTheme } from '../theme'

let NT = new NitroTheme();

function posToLine(source: string, pos: number) {
    let charArray = source.split('')
    let newLineCount: number = 0;
    let final: number;

    charArray.forEach((char, i) => {
        if(char == "\n") { newLineCount++; }
        if(i == pos) { final = newLineCount }
    })

    if(final) { return final} else { return false }
}

export function TypeDefNotDefined(self, message: string, pos: number) {
    let out: string = ""
    out += NT.Bold() + NT.Red() + "type error: " + NT.Reset();
    out += NT.Bold() + "at line " + posToLine(self.rawCode, pos) + ": " +  NT.Reset()
    out += message + "\r\n\r\n"

    return out;
}


export class FastTSErr extends Error {
    pos: number = 0

    constructor(message?: string, pos?: number) {
        super(message);
        this.pos = pos;
    }
}

export function setupErrorCode(verbose: boolean = false) {
    process.on('uncaughtException', err => {
        if(!verbose) { console.error(err.message) } else {
            console.error(err)
        }
        //process.exit(1) //mandatory (as per the Node.js docs)
    })
}