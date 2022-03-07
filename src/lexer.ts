// So many lexers have been written already I'm not going to bother writing my own
import { Lexer, ILexRule, RuleName, IToken } from '@msnraju/lexer';

const rules: Array<ILexRule> = [
    //Keywords
    { name: 'LET', expression: /let/ },
    { name: 'FUNCTION', expression: /func/ },
    { name: 'IMPORT', expression: /import/ },
    { name: 'RETURN', expression: /ret/ },
    { name: 'IF', expression: /if/ },
    { name: 'ELSE', expression: /else/ },
    { name: 'ELIF', expression: /else/ },
    { name: 'WHILE', expression: /while/ },
    { name: 'FOR', expression: /for/ },
    { name: 'BREAK', expression: /break/ },

    //Basic Types
    { name: 'STRING', expression: /Str/ },
    { name: 'I32', expression: /I32/ },
    { name: 'F32', expression: /F32/ },

    //Symbols
    { name: 'EQUALS', expression: /=/ },
    { name: 'PLUS', expression: /\+/ },
    { name: 'MINUS', expression: /\-/ },
    { name: 'MULT', expression: /\*/ },
    { name: 'DIV', expression: /\// },
    { name: 'SEMICOLON', expression: /;/ },
    { name: 'COLON', expression: /:/ },
    { name: 'COMMA', expression: /,/ },
    { name: 'LBRAC', expression: /{/ },
    { name: 'RBRAC', expression: /}/ },
    { name: 'LPAREN', expression: /\(/ },
    { name: 'RPAREN', expression: /\)/ },

    //General Types
    { name: 'NUMBER', expression: /[0-9]+/ },
    { name: 'VALUE', expression: /[a-zA-Z_0-9]*/ },
    { name: RuleName.SKIP, expression: /[ \t\n]/ },
    { name: RuleName.ERROR, expression: /./ },
];

export function lex(code: string): Array<IToken> {
    return Lexer.tokens(rules, code);
}