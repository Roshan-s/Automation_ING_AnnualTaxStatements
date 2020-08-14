import {e2eLogError, e2eLogInfo} from "../wrappers/CustomLogger";

const fs = require('fs-extra');
const pdf = require('pdf-parse');
const downloadsFolder = require('downloads-folder');


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