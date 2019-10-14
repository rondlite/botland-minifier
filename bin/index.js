#!/usr/bin/env node
'use strict';
const fs = require("fs");
const Terser = require("terser");
const chalk = require("chalk");
const yargs = require("yargs");

const opts = yargs
 .usage(chalk.cyan("Usage: -i <input file>"))
 .example(chalk.green('$0 -i defense.js -o defense.min.js'))
 .example(chalk.green('$0 -i defense.js  -> will create defense.min.js'))
 .option("i", { alias: "input", describe: "Botland script to minify", type: "string", demandOption: true })
 .option("o", { alias: "output", describe: "Minified output filename", type: "string", demandOption: false })
 .option('s', { alias: "screen", describe: "Echoes the output to the screen instead of to a file", type: "boolean", demandOption: false })
 .option('v', { alias: "verbose", describe: "Shows warnings",type: "boolean", demandOption: false})
 .option('d', { alias: "debug", describe: "Do not remove debugLog (for debugging)",type: "boolean", demandOption: false})
 .epilog(chalk.yellow("made for Botland - botland user: Ron - no copyright 2019"))
 .argv;

var options = {
    warnings: "verbose",
    mangle: true, 
    compress: {
    passes: 5,
    global_defs: {
       DEBUG: false
    },
    toplevel: false,
    sequences: false,
    conditionals: false,
    drop_console: true

},
    output: {
        ecma: 6,
        beautify: false,
        preamble: "/* minified Botland script */"
    }
};

var inputFile = process.cwd() + `/${opts.input}`;

var outputFile = inputFile.substring(0, inputFile.indexOf('.')) + '.min.js' ;


if(opts.output){outputFile = process.cwd() + `/${opts.output}`;}

var code = fs.readFileSync(inputFile,'utf-8');

if(opts.debug!==true) code = code.replace(/debugLog/g,"console.log");

var result = Terser.minify(code,options);

if(!opts.screen)fs.writeFileSync(outputFile,result.code);

console.log('Botland Minification done..');
if(result.warnings&&opts.verbose)console.log('Warnings: '+result.warnings);
if(result.errors)console.log('Errors: '+result.errors);
if(!opts.screen)console.log('Created file: '+outputFile);
if(opts.screen){console.log(' ');console.log(result.code);console.log(' ');}
