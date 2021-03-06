import {BeforeAll, setDefaultTimeout, When} from "cucumber";
import {browser} from "protractor";
import {CustomBrowserDriver} from "./wrappers/CustomBrowserDriver";
import {BaseComponents} from "./BaseComponents";
import {CustomWait} from "./wrappers/CustomWait";


import * as config from "../../src/config.json";
import {getValueFromExcelCell, loadExcelSheet, savePDF} from "./utils";
import {e2eConsoleBrowserLogInfo, e2eConsoleLogError} from "./wrappers/CustomLogger";




setDefaultTimeout(1800 * 1000000);


BeforeAll(async () => {


    await browser.waitForAngularEnabled(false);
    await browser.manage().timeouts().pageLoadTimeout(40000);
    await browser.manage().timeouts().implicitlyWait(1000);
    await browser.manage().window().maximize() ;

    // @ts-ignore
    await browser.navigate().to(config.baseURL);

    // Enter UserName
    // @ts-ignore
    await new BaseComponents().enterIntoInputField('input[id*="UserName"]',config.userName);
    // Enter Password
    // @ts-ignore
    await new BaseComponents().enterIntoInputField('input[id*="Password"]',config.password);
    // Hit Submit
    await new BaseComponents().clickOnWebElem('input[type="submit"]');


});



When('Download Tax statement using HIN number', async () => {
    let failedHin: string[] = [];
    // Go to page Document Search
    let pageName = `https://www.intermediaryonline.com/MemberPages/DocumentSearch.aspx`;
    await  browser.executeScript((( pageName) => window.location.href = (`${pageName}`)), pageName);
    await new CustomWait().untilUrlContains('DocumentSearch');

    // @ts-ignore
    const worksheet = await loadExcelSheet(config.excelFile,1);
    // @ts-ignore
    const endRow = ++config.endRow ;
    // @ts-ignore
    for (let i = config.startRow; i < endRow ; i++){
       // @ts-ignore
        let hinNumber = `00${await getValueFromExcelCell(worksheet,`${config.column}${i}`)}`;
        await new BaseComponents().enterIntoInputField('input[id*="documentSearchCriteria_hin"]',hinNumber);
        // @ts-ignore
        await new BaseComponents().enterIntoInputField('input[id*="autoComplete_Input"]',config.company);
        await browser.sleep(1000);
        await new CustomBrowserDriver().pressEnter();
        await new CustomBrowserDriver().pressTab(6);
        await new CustomBrowserDriver().pressEnter();

        try{
            await new BaseComponents().clickOnWebElem(`img[alt="Issuer Annual Tax Statement"]`);
        }catch (e){
            await failedHin.push(hinNumber);
            continue;
        }

        await new CustomBrowserDriver().switchToNewWindow(1);
        await browser.sleep(500);
        await new CustomBrowserDriver().pressTab(3);
        await new CustomBrowserDriver().pressEnter();
        await browser.sleep(2000);
        await savePDF(hinNumber);
        await browser.sleep(5000);
        await new CustomBrowserDriver().closeCurrentWindowAndSwitchToMain();
        await browser.sleep(1000);
    }
    await e2eConsoleBrowserLogInfo(`Failed to download the following HIN(s) : ${JSON.stringify(failedHin)}`);
});








