const fs = require('fs');
var shell = require('shelljs');
var forEach = require('async-foreach').forEach;
test('Real World Folder', () => {
    fs.readdir('./test/realworld', (err, files) => {
        forEach(files,  function (file) {
            // Do whatever you want to do with the file
            let rawName = file.substring(0, file.lastIndexOf('.'))
            let extension = file.substring(file.lastIndexOf('.'), file.length)

            if(extension === '.ts') {
                let progOut = fs.readFileSync('./test/realworld/' + file + '.out.txt', 'utf8')
                let expectOut = fs.readFileSync('./test/realworld/' + rawName + '.expect', 'utf8')
                progOut = progOut.replace(/[\r]+/g, '');
                progOut = progOut.replace(/[\n]+/g, '\r\n');
                
                expect(progOut).toEqual(expectOut)
            }        
        });
    });
})