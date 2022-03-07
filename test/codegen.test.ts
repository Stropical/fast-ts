import { TargetType, IRModule, IRType, IRAttribute, IRVariable, IRDeclare, IRAttrType } from '../src/codegen';

/*
Module creation test
 - Test header
 - Test target

*/

function fmtTest(content: string) {
    let retVar = content.replace('\t','');
    retVar = retVar.replace(/(\r?\n)\s*\1+/g, "")
    retVar = retVar.replace(/\t+/g, "")
    return retVar;
}

test('Module creates proper formatting', () => {
    let mod1: IRModule = new IRModule("test.cpp", TargetType.LINUX);

    expect(fmtTest(mod1.renderModule())).toBe(`; ModuleID = "test.cpp"
source_filename =" test.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"        `);
});

test('Basic Import', () => {
    let mod1: IRModule = new IRModule("test.cpp", TargetType.LINUX);
    mod1.addImport(new IRDeclare(IRType.i32, "testImport"));

    expect(mod1.renderModule()).toBe(`; ModuleID = "test.cpp"
source_filename =" test.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

declare dso_local i32 @testImport()


        `);
});

test('Basic Import with simple params', () => {
        let mod2: IRModule = new IRModule("test.cpp", TargetType.LINUX);

        mod2.addImport(new IRDeclare(IRType.i32, "testImportParams", [new IRVariable("", IRType.i32)]));

    expect(mod2.renderModule()).toBe(`; ModuleID = "test.cpp"
source_filename =" test.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

declare dso_local i32 @testImportParams(i32 )


        `);
});

test('Basic Import with complex params', () => {
        let mod3: IRModule = new IRModule("test.cpp", TargetType.LINUX);

        mod3.addImport(new IRDeclare(IRType.i32, "printf", [
            new IRVariable("", IRType.i8Ptr, [
                new IRAttribute(IRAttrType.readonly), 
                new IRAttribute(IRAttrType.nocapture)
            ]),
            new IRVariable("", IRType.triDot, [])
        ]));

    expect(mod3.renderModule()).toBe(`; ModuleID = "test.cpp"
source_filename =" test.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

declare dso_local i32 @printf(i8* readonly nocapture, ... )


        `);
});