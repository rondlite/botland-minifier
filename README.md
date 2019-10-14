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

