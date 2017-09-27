/**
 * @author pzhang
 * @version v1.0.0
 * @desc 导出文件夹
 *      
 * The similar module: https://www.npmjs.com/package/require-dir-object
 * 
 */

const fs = require('fs');
const path = require('path');
const TYPE = {
    Unknown: 'Unknown',
    File: 'File',
    Directory: 'Directory'
};

/**
 * export dir
 * 
 * @param {String} dir dirpath
 * @param {Object} options 
 *      obj.exclude {String} RegExp pattern, exclude same module  
 *      obj.case    {String} The object field style. the value range {camel, snake,  kebab ,capitalized)   [default:'camel']
 *      obj.depth   {Number} limit the sub-directory search depth    [default: Number.MAX_VALUE ]

 * @example
 * 
.
├── fish.js
├── folder_with_index
│   ├── index.js
│   └── other_file.js
├── other_file.js
└── other_folder
    ├── badger.js
    └── badger_fish.js

exportDir('.',{case:'camel'})
--> 
{
    fish: require("./fish"),
    folderWithIndex: {
        index:require("./folder_with_index/index"),
        otherFile:require("./folder_with_index/other_file"),
    },
    otherFile: require("./other_file"),
    otherFolder: {
        badger: require("./other_folder/badger"),
        badgerFish: require("./other_folder/badger_fish")
    },
}

 */
module.exports = exportDir = function (dir, options = {}) {
    let result = {};
    let defaultOptions = {
        case: 'camel',
        depth: Number.MAX_VALUE
    };
    options = Object.assign({}, defaultOptions, options);
    var paths = fs.readdirSync(dir).map(function (item) {
        return path.join(dir, item);
    });
    if (options.exclude) {
        paths = paths.filter(function (item) {
            return !new RegExp(options.exclude).test(item);
        });
    }
    options.depth--;
    paths.forEach(function (item) {
        var ap = analysePath(item);
        var fieldName = convertCase(ap.name, options.case);
        try {
            if (ap.type == TYPE.File) result[fieldName] = require(item);
        } catch (error) {

        }
        if (ap.type == TYPE.Directory && options.depth >= 0) result[fieldName] = exportDir(item, options);
    });
    return result;
}

/**
 * Convert the case of a string to camel, snake,  kebab ,capitalized
 * @param {String} str   the string to convert
 * @param {String} type  the format to convert to
 * @returns {String} the converted string
 */
function convertCase(str, type) {
    switch (type) {
        case "camel":
            return str.replace(/[_-\s]([a-zA-Z1-9])/g, function (g) {
                return g[1].toUpperCase();
            });

        case "snake":
            return str.replace(/[_-\s]([a-zA-Z1-9])/g, function (g) {
                return "_" + g[1].toLowerCase();
            });

        case "kebab":
            return str.replace(/[_-\s]([a-zA-Z1-9])/g, function (g) {
                return "-" + g[1].toLowerCase();
            });

        case "capitalize":
            return str.replace(/^./, function (g) {
                return g.toUpperCase();
            }).replace(/[_-\s]([a-zA-Z1-9])/g, function (g) {
                return g[1].toUpperCase();
            });

        default:
            return str;
    }
}

/**
 * 
 * @param {String} fp  the file path
 * @return {Object}  
 *      obj.type {String}   the file type {Unknown,File,Directory}
 *      obj.ext  {String}   the file extension
 *      obj.name {String}   the file name
 *      obj.path {String}   the file path
 */
function analysePath(fp) {
    var result = {};
    result['type'] = TYPE.Unknown;
    result['path'] = fp;
    try {
        var stat = fs.statSync(fp);
        if (stat.isFile()) result['type'] = TYPE.File;
        if (stat.isDirectory()) result['type'] = TYPE.Directory;
        var ext = result['ext'] = path.extname(fp);
        result['name'] = path.basename(fp, ext);
    } catch (error) {
        // console.log(error);
    }
    return result;
}
