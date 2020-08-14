/*
* Author      : Roshan S.
* Description : This file contain configuration details for the log4js(Logging) module files used in the framework
* */

const log4js = require('log4js');


log4js.configure({
    appenders: {
        e2e: {type: 'file', filename: './logs/e2e.log'},
        browser: {type: 'file', filename: './logs/browser.log'}
    },
    categories: {
        default: {appenders: ['e2e'], level: 'All'},
        browser: {appenders: ['browser'], level: 'All'}
    }
});

const e2elogger = log4js.getLogger('e2e');
const browserLogger = log4js.getLogger('browser');


const customLogger = (logType, logFile, logs) => {
    if (logType === 'INFO') {
        if (logFile === 'e2e') {
            e2elogger.info(logs);
        } else if (logFile === 'browser') {
            browserLogger.info(logs);
        }
    } else if (logType === 'ERROR') {
        if (logFile === 'e2e') {
            e2elogger.error(logs);
        } else if (logFile === 'browser') {
            browserLogger.error(logs);
        }
    }
};

export const e2eLogInfo = async (logs) => {
    await customLogger('INFO', 'e2e', logs);
};

export const e2eLogError = (logs) => {
    customLogger('ERROR', 'e2e', logs);
    return logs;
};

export const browserLogInfo = (logs) => {
    customLogger('INFO', 'browser', logs);
};

export const browserLogError = (logs) => {
    customLogger('ERROR', 'browser', logs);
};

export const e2eConsoleBrowserLogInfo = async (logs) => {
     e2eLogInfo(logs);
     browserLogInfo(logs);
     console.log(logs);
};

export const e2eConsoleLogError = (logs) => {
    e2eLogError(logs);
    console.log(logs);
};

