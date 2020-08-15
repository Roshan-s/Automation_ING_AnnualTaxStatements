/*
* Author     : Roshan S.
*
* */


import moment from "moment";
import {e2eLogError, e2eLogInfo} from "./wrappers/CustomLogger";


const downloadsFolder = require('downloads-folder');
const exceljs = require('exceljs');
const fs = require('fs-extra');
const mv = require('mv');
const pdf = require('pdf-parse');
const shell = require('shelljs');


/*Returns current date and time formatted as follows : DD.MM.YY  HH.MM.SS */
export const getformattedCurrentDateAndTime = ()=> moment().format('DD.MM.YYYY h.mm.ss a');

export const getCurrentDate = ()=> moment().format("YYYY-MM-DD");

export const subtractYearsFromCurrentDate = (years) => moment(new Date(moment().subtract(years, 'years').calendar())).format("YYYY-MM-DD");


/**
 *  Retrieve cell value from an excel file.
 */
export async function loadExcelSheet(fileName, sheetNameOrIndex){
    let workbook = await new exceljs.Workbook().xlsx.readFile(`./src/excelFile/${fileName}.xlsx`);
    let worksheet = await workbook.getWorksheet(sheetNameOrIndex);
    return worksheet;
}


export async function getValueFromExcelCell (worksheet, cellAddress){
    return worksheet.getCell(cellAddress).value;
}

/**
 *  Delete's the specified xlsx file in the system 'Downloads' folder
 */
export async function deleteXlsxFile (fileName){
    await fs.remove(`${downloadsFolder()}/${fileName}.xlsx`, err => {
        if (err) return e2eLogError(`Unable to delete excel file ${fileName}. ERROR : ${err}`);
        e2eLogInfo(`Deleted excel file ${fileName}`);
    });
}

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


export async function savePDF(fileName){
    // relative file path for the autoit exe
    const cmd = `run ./src/lib/wrappers/savePdf.exe "${fileName}"`;
    const task = await shell.exec(cmd);
    if (task.code !== 0) {
        shell.echo(`execute AutoIt script fail: ${task.stdout}`);
        shell.exit(1);
    }
}


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

/**
 *  Returns complete text from specified pdf file in the system 'Downloads' folder
 */
export const getTextFrompdf = (pdfName) => {
    let dataBuffer = fs.readFileSync(`${downloadsFolder()}/${pdfName}.pdf`);

    return new Promise((resolve, reject) => {
        pdf(dataBuffer).then((data) => {
            resolve(data.text);
        }).catch((err) => {
            reject(err);
        });
    })

}

/**
 *  Delete's the specified pdf file in the system 'Downloads' folder
 */
export const deletePdf = (pdfName) => {
    fs.remove(`${downloadsFolder()}/${pdfName}.pdf`, err => {
        if (err) return e2eLogError(`Unable to delete pdf file ${pdfName}. ERROR : ${err}`);
        e2eLogInfo(`Deleted pdf file ${pdfName}`);
    });
}


