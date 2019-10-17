## Bot Land Minifier

Install:  npm install -g botland-minifier

Binary install: Download the binary for your platform and rename it to _blify_ for ease of use.

Usage: blify -i <input file>


Options:
-  --help        Show help                                              [boolean]

-  --version     Show version number                                    [boolean]

-  -i, --input   Bot Land script to minify                     [string] [required]

-  -o, --output  Minified output filename                                [string]

There are more options, will update README soon, the script will show them properly

Examples:
-  blify -i defense.js -o defense.min.js
-  blify -i defense.js  -> will create defense.min.js



Comments will be removed by default (unless they contain copyright format statements)


