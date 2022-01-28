import { IToken } from '@msnraju/lexer';
import { lex } from './lexer';
import { ArcParse } from './parser';
import { IRModule } from './codegen'

let tokens: Array<IToken> = lex(`
    func sum(x: i32, y: i32): i32 {
        ret x + 1 * 12 + 5;
    }
`);

let mod: IRModule = ArcParse(tokens);

console.log(mod.renderModule());