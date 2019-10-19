#!/usr/bin/env node
'use strict';
const fs = require("fs");
const Uglify = require("uglify-js");
const Terser = require("terser");
const chalk = require("chalk");
const yargs = require("yargs");
const clip = require("copy-paste");
const _ = require("lodash");
const opts = yargs
.usage(chalk.cyan("Usage: -i <input file>"))
.example(chalk.green('$0 -i defense.js -o defense.min.js'))
.example(chalk.green('$0 -i defense.js  -> will create defense.min.js'))
.option("i", { alias: "input", describe: chalk.greenBright("Bot Land script to minify"), type: "string", demandOption: true })
.option("o", { alias: "output", describe: chalk.greenBright("Minified output filename"), type: "string", demandOption: false })
.option('s', { alias: "screen", describe: chalk.greenBright("Echoes the output to the screen/clipboard, no file output"), type: "boolean", demandOption: false })
.option('v', { alias: "verbose", describe: chalk.greenBright("Shows warnings"),type: "boolean", demandOption: false})
.option('c', { alias: "compress", describe: chalk.greenBright("Add semicolons and compress script to one line"),type:"boolean",demandOption: false})
.option('d', { alias: "debug", describe: chalk.greenBright("Do not remove debugLog (for debugging)"),type: "boolean", demandOption: false})
.epilog(chalk.yellow("made for Bot Land https://bot.land - Bot Land username: Ron - no copyright 2019"))
.argv;

  var inputFile = process.cwd() + `/${opts.input}`;
  var outputFile = inputFile.substring(0, inputFile.indexOf('.')) + '.min.js' ;

const toplevel = JSON.parse(fs.readFileSync(__dirname+'/toplevel.json','utf-8'));

if(opts.output){outputFile = process.cwd() + `/${opts.output}`;}

if(opts.input){
  try{
    var code = fs.readFileSync(inputFile,'utf-8');
  }catch (err){
    console.log(chalk.redBright("[Bot Land minifier error]"));
    if(err.code === "ENOENT"){
      console.log(chalk.red("File "+inputFile+" not found!"));
      return false;
    }else if (err.code === "EACESS"){
      console.log(chalk.red("Permission error"));
    }else{
     throw err;
   }
 }
}
try{
  if(inputFile.length<10){
    console.log(chalk.red("Script size error"));
    return false;
  }}catch(err){
    console.log(chalk.red("Script error"));
    return false;
  }


  let options = {
    warnings: "verbose",
    mangle: {
      toplevel: true,
      reserved: ['debugLog','console']
    },
    compress: {
      passes: 1,
      sequences: false,
      conditionals: false,
      drop_console: true,
      dead_code:true,
      loops: false
    },
    output: {
      ecma: 6,
      semicolons: opts.compress,
      beautify: false,
      braces: true
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

//pass to get rid of console output
code = Terser.minify(code,options);
code=code.code;

let manglable=_.difference(scriptFuncs,toplevel);

manglable = _.trimStart(manglable,"[");
manglable = _.trimEnd(manglable,"]");
manglable = "var "+manglable+";";
manglable = manglable + code;


let finalResult = Terser.minify(manglable,options);

finalResult.code=finalResult.code.substring(finalResult.code.indexOf('*/')+1, finalResult.code.length);

finalResult.code="/* Bot Land minified script */\n"+finalResult.code;

  if(opts.screen){
	console.log(' ');
	console.log(finalResult.code);
	console.log(' ');
	clip.copy(finalResult.code);
	console.log(chalk.green("Copied to clipboard"));
	}
    	else{
          fs.writeFileSync(outputFile,finalResult.code);
          console.log('Created file: '+outputFile);
        	}

console.log(chalk.green('Bot Land Minification done..'));
if(finalResult.warnings&&opts.verbose)console.log(chalk.yellow('Warnings: '+finalResult.warnings));
if(finalResult.errors)console.log('Errors: '+finalResult.errors);



