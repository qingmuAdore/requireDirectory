#  require directory

## function(dir,options)

- `dir`  {String}   is the directory path
- `options` {Object} 
  -  `exclude`: {String}  RegExp pattern, exclude same module  
  -  `case`:    {String}  The object field style. the value range {camel, snake,  kebab ,capitalized).   (default `camel`) 
  -  `depth`:   {Number} limit the sub-directory search depth   (default `Number.MAX_VALUE `)  

## example

> The directory structure

├── fish.js   
├── folder_with_index   
│   ├── index.js   
│   └── other_file.js   
├── other_file.js   
└── other_folder   
    ├── badger.js   
    └── badger_fish.js   

> result

```js
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
    }
}
```
