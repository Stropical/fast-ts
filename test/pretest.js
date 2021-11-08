const fs = require('fs');
var shell = require('shelljs');
var forEach = require('async-foreach').forEach;

fs.readdir('./test/realworld', (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    forEach(files,  function (file) {
        // Do whatever you want to do with the file
        let rawName = file.substring(0, file.lastIndexOf('.'))
        let extension = file.substring(file.lastIndexOf('.'), file.length)

        if(extension === '.ts') {
            console.log("Fast TS Compile: " + rawName)
            let fastts_cmd = 'node dist/main.js test/realworld/' + file + ' -o test/realworld/' + file;
        
            shell.exec(fastts_cmd);
        }        
    });

    forEach(files,  function (file) {
        // Do whatever you want to do with the file
        let rawName = file.substring(0, file.lastIndexOf('.'))
        let extension = file.substring(file.lastIndexOf('.'), file.length)

        if(extension === '.ts') {
            console.log("Clang Compile: " + rawName)
            let clang_cmd = 'clang++ test/realworld/' + rawName + '.cpp lib/lib.o -o test/realworld/' + rawName + '.exe -I lib/include'
            shell.exec(clang_cmd);
        }        
    });

    forEach(files,  function (file) {
        // Do whatever you want to do with the file
        let rawName = file.substring(0, file.lastIndexOf('.'))
        let extension = file.substring(file.lastIndexOf('.'), file.length)

        if(extension === '.ts') {
            console.log("Running: " + rawName)
            let exec_cmd = '"test/realworld/' + rawName + '.exe" > test/realworld/' + file + '.out.txt'
            shell.exec(exec_cmd);
        }        
    });
})

