import { Builder } from '../../../src/builder/builder'
import { AstGenerator } from '../../../src/ast/ast'
import { Header } from '../../../src/builder/util';
import exp from 'constants';

function compile(rawCode: string) {
    let ASTGen = new AstGenerator('test' + '.ts', rawCode);
    let AST = JSON.parse(ASTGen.generateAST());
    let builder = new Builder(AST, '');
    builder.start('test');
    return builder.finish('test');
}

test('Number definition', () => {
    let CxxCode = compile('let x: int')
    expect(CxxCode).toEqual(Header() + 'int x;\r\n')
})

test('Number definition with literal', () => {
    let CxxCode = compile('let x: int = 1')
    expect(CxxCode).toEqual(Header() + 'int x = 1;\r\n')
})

test('Number definition with no literal initializer', () => {
    let CxxCode = compile('let x: int = ')
    expect(CxxCode).toThrow('No literal stated after equals: line 1')
})

test('Number definition with no type', () => {
    let CxxCode = compile('let x = 1;')
    expect(CxxCode).toThrow('Type required: line 1')
})