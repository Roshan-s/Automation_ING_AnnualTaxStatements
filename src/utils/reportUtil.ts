/*
 Author      : Roshan S.
 Description : This file contains configuration details for Test Execution Report creation.
*/


import {browser} from "protractor";
import {getformattedCurrentDateAndTime} from "./dateUtil";
import {client, host} from "../hooks/preHooks";
import {moveFile} from "./fileSystemUtil";


const report = require('multiple-cucumber-html-reporter');
export const currentDateAndTime = getformattedCurrentDateAndTime();

/**
 *  Generates an html report by reading the report.json file
 *  located under src/reports/<Current Date and Time>/ which gets created post e2e execution
 */
export const generateHtmlReport = () => {
    moveFile(`./report.json`,`./reports/${browser.params.clientName}/${browser.params.hostName}/${currentDateAndTime}/report.json`);

    let browserName, browserVersion, platform, platformVersion;
    browser.getCapabilities().then(async (caps) => {
        browserName = await caps.get('browserName');
        browserVersion = await caps.get('version');
        platform = await caps.get('platform');
        platformVersion = await caps.get('appVersion');

        /*
        MetaData key-value pair for the html report
        */

        report.generate({
            jsonDir: `./reports/${browser.params.clientName}/${browser.params.hostName}/${currentDateAndTime}/`,
            reportPath: `./reports/${browser.params.clientName}/${browser.params.hostName}/${currentDateAndTime}/`,
            openReportInBrowser: true,
            reportName: 'AOL E2E Automation report',
            pageTitle: 'Automation report',
            pageFooter: '<div><p> Custom footer test </p></div>',
            displayDuration: true,
            durationInMs:true,
            metadata: {
                browser: {
                    name: browserName,
                    version: browserVersion
                },
                device: 'Local test machine',
                platform: {
                    name: platform,
                }
            }
        });

    });
}





