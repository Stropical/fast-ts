//General terms that contain other code chunks

export function SourceFileHandle(obj, self) {
    obj.statements.forEach(element => {
        self.iterate(element, self);
    });
}

export function FirstStatementHandle(obj, self) {
    self.iterate(obj.declarationList, self);
}

export function ImportDeclarationHandle(obj, self) {
    let file = obj.moduleSpecifier.text.substring(2, obj.moduleSpecifier.text.length) + ".hpp";

    self.construct.include(file);
}