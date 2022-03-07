

export class Config {
    inputFiles: Array<string>;
    options: Array<Object>;
}

export class CLI {
    inputFileFlag: Boolean = true;
    switchOptions: Array<string>;
    options: Array<string>;
    config: Config = new Config();

    constructor(options: Array<string>, switchOptions: Array<string>) {
        this.options = options;
        this.switchOptions = switchOptions;

        this.config.inputFiles = []
        this.config.options = []
    }

    parseArgs() {
        for(var i = 0; i < process.argv.length; i++) {
            if(i > 1) {
                var element = process.argv[i];
                if(this.switchOptions.includes(element)) {
                    this.inputFileFlag = false;
                    this.config.options.push(element)
                }
        
                if(this.options.includes(element)) {
                    this.inputFileFlag = false;
                    this.config.options.push({[element]: process.argv[i + 1]})
                    i++;
                }
            
                if(this.inputFileFlag) {
                    this.config.inputFiles.push(element)
                }
            }
        }
        
        return this.config;
    }
}