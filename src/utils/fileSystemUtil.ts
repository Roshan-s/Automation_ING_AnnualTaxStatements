/*
* Author     : Roshan S.
* Description: This file contains file system functions which can be used across the framework
* */

const fs = require('fs-extra');
const mv = require('mv');


/**
 * Function to move a file.
 * @currentPath - The path where the file currently resides. Can be absolute or relative to the project root dir
 * @destinationPath - The path where the file should be moved to. Can be absolute or relative to the project root dir
 */
export const moveFile = (currentPath,destinationPath)=> mv(currentPath, destinationPath, function(err) {
    if (err) {
        throw err;
    }
});


/**
 * Creates a new folder(s)/directory(s) at the specified path
 * @path - path where the folder needs to created. To create sub-folders, specify it after a '/'
 *
 * Example createNewDire('parentDir/childDir');
 */
export const createNewDir = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path,{recursive:true});
    }
}






