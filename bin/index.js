#!/usr/bin/env node
'use strict';
const fs = require("fs");
const Terser = require("terser");

const yargs = require("yargs");

const opts = yargs
 .usage("Usage: -i <input file>")
 .example('$0 -i defense.js -o defense.min.js')
 .example('$0 -i defense.js  -> will create defense.min.js') 
 .option("i", { alias: "input", describe: "Botland script to minify", type: "string", demandOption: true })
 .option("o", { alias: "output", describe: "Minified output filename", type: "string", demandOption: false })
 .epilog("made for Botland - botland user: Ron - no copyright 2019")
 .argv;

var options = {
    compress:{
    sequences: false,
    conditionals: false
//    pure_funcs: ['debugLog']
   },
   mangle: {

},
    output: {
        beautify: false,
        preamble: "/* minified Botland script */"
    }
};

const inputFile = process.cwd() + `/${opts.input}`;

var outputFile = inputFile.substring(0, inputFile.indexOf('.')) + '.min.js' ;

if(opts.output){outputFile = process.cwd() + `/${opts.output}`;}

var code = fs.readFileSync(inputFile,'utf-8');

var result = Terser.minify(code,options);
fs.writeFileSync(outputFile,result.code);
