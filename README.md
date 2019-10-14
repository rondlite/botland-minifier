## Botland Minifier

Install:  npm install -g botland-minifier

Binary install: Download the binary for your platform and rename it to _blify_ for ease of use.

Usage: blify -i <input file>


Options:
-  --help        Show help                                              [boolean]

-  --version     Show version number                                    [boolean]

-  -i, --input   Botland script to minify                     [string] [required]

-  -o, --output  Minified output filename                                [string]

Examples:
-  blify -i defense.js -o defense.min.js
-  blify -i defense.js  -> will create defense.min.js


In your code: 

Wrap any statement like debugLog that you don't want in your minified code in a DEBUG block like this:

```
if(DEBUG){
/* code to be executed */
  }

```

this will remove that block from the minified code.
Comments will be removed by default (unless they contain copyright format statements)


