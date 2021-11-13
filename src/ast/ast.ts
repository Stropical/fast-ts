/*

    Thanks to Zach Snow for most of this part, 
    best written code I could find on google.
    Converted into a typescript class by me.

    https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html

*/

import * as fs from 'fs'
import * as ts from 'typescript'
import * as process from 'process'

export class AstGenerator {
    name: string;
    source: string;
    sourceFile: ts.SourceFile;
    nextId: number = 0;
    json: string;
    cache: any = [];

    constructor(name: string, source: string) {
        this.name = name;
        this.source = source;
    }

    createSourceFile() {
        this.sourceFile = ts.createSourceFile(this.name, this.source, ts.ScriptTarget.Latest, true);
    }

    addId(node, self) {
        self.nextId++;
        node.id = self.nextId;
        ts.forEachChild(node, (node) => {
            this.addId(node, self);
        });
    }

    filterGarbage() {
        this.json = JSON.stringify(this.sourceFile, (key, value) => {
            // Discard the following.
            if (key === 'flags' || key === 'transformFlags' || key === 'modifierFlagsCache') {
                return;
            }
            
            // Replace 'kind' with the string representation.
            if (key === 'kind') {
                value = ts.SyntaxKind[value];
            }
            
            if (typeof value === 'object' && value !== null) {
                // Duplicate reference found, discard key
                if (this.cache.includes(value)) return;
            
                this.cache.push(value);
            }
            return value;
            });
    }

    generateAST() {
        this.createSourceFile();
        this.addId(this.sourceFile, this);

        delete this.sourceFile.text;
        this.filterGarbage();

        return this.json
    }
}