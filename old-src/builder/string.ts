export function StringLiteral(obj, self): string {
    console.log("StringLiteral")
    return 'std::string("' + obj.text + '")'
}