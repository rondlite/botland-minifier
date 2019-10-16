#!/usr/bin/env node
'use strict';
const fs = require("fs");
const Uglify = require("uglify-js");
const Terser = require("terser");
const chalk = require("chalk");
const yargs = require("yargs");
const _ = require("lodash");
const opts = yargs
 .usage(chalk.cyan("Usage: -i <input file>"))
 .example(chalk.green('$0 -i defense.js -o defense.min.js'))
 .example(chalk.green('$0 -i defense.js  -> will create defense.min.js'))
 .option("i", { alias: "input", describe: "Bot Land script to minify", type: "string", demandOption: true })
 .option("o", { alias: "output", describe: "Minified output filename", type: "string", demandOption: false })
 .option('s', { alias: "screen", describe: "Echoes the output to the screen instead of to a file", type: "boolean", demandOption: false })
 .option('v', { alias: "verbose", describe: "Shows warnings",type: "boolean", demandOption: false})
 .option('d', { alias: "debug", describe: "Do not remove debugLog (for debugging)",type: "boolean", demandOption: false})
 .epilog(chalk.yellow("made for Bot Land - Bot Land username: Ron - no copyright 2019"))
 .argv;


var inputFile = process.cwd() + `/${opts.input}`;

var outputFile = inputFile.substring(0, inputFile.indexOf('.')) + '.min.js' ;

const toplevel = JSON.parse(fs.readFileSync(__dirname+'/toplevel.json','utf-8'));

if(opts.output){outputFile = process.cwd() + `/${opts.output}`;}

var code = fs.readFileSync(inputFile,'utf-8');

var options = {
    warnings: "verbose",
    mangle: {
    toplevel: true,
    reserved: ['debugLog']
    }, 
    compress: {
    passes: 1,
    sequences: false,
    conditionals: false,
    drop_console: true,
    dead_code:true
},
    output: {
        ecma: 6,
        semicolons: false,
        beautify: false,
        preamble: "/* minified Bot Land script */"
    }
};

if(opts.debug!==true) code = code.replace(/debugLog/g,"console.log");

const result = Uglify.minify(code,

{
  parse: {
    bare_returns: true,
  },
  mangle: {},
  compress: {},
  output: {
    ast: true,
  }
}

);

const ast=result.ast;

const scriptFuncs=ast.globals.map(g=> g.name);

//console.log(scriptFuncs);
let manglable=_.difference(scriptFuncs,toplevel);
//let manglable = toplevel;
//console.log(manglable);
manglable = _.trimStart(manglable,"[");
manglable = _.trimEnd(manglable,"]");
manglable = "var "+manglable+";";
manglable = manglable + code;

//console.log(manglable);

console.log(manglable);

let finalResult = Terser.minify(manglable,options);

//console.log(finalResult);

finalResult.code=finalResult.code.substring(finalResult.code.indexOf('init')-4, finalResult.code.length);

if(!opts.screen)fs.writeFileSync(outputFile,finalResult.code);

console.log('Bot Land Minification done..');
if(finalResult.warnings&&opts.verbose)console.log('Warnings: '+finalResult.warnings);
if(finalResult.errors)console.log('Errors: '+finalResult.errors);
if(!opts.screen)console.log('Created file: '+outputFile);
if(opts.screen){console.log(' ');console.log(finalResult.code);console.log(' ');}


