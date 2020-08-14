/*
 Author      : Roshan S.
 Description : This class contains a wrapper for frequently used Protractor elements and browser objects.
               Best Practice is not to use them directly as this way we centralize our customized code into a single place.
 */


import {CustomWait} from "./CustomWait";
import {$, $$, browser, ElementArrayFinder, ElementFinder} from "protractor";

import {protractor} from "protractor/built/ptor";
import {e2eConsoleLogError, e2eLogInfo} from "./CustomLogger";



export class CustomBrowserDriver {

    private wait;

    constructor() {
        this.wait = new CustomWait();
    }

    /**
     * A wrapper around protractor '.click()' method. Waits for the element to be visible before performing the click.
     *
     */
    async click(element: ElementFinder) {
        await e2eLogInfo(`Attempting to perform a single click on element : ${element.locator()}`);
        await this.wait.untilElementIsVisible(element);
        await element.click().then(
            null,(err)=> e2eConsoleLogError(`Failed to perform a single click on element : ${element.locator()}`));
        await e2eLogInfo(`Successfully performed a single click on element : ${element.locator()}`);

    }

    /**
     * Closes the current window the driver is on when this function is called and switches to the only remaining window.
     * NOTE :  This function can only handle maximum two tabs.
     */
    async closeCurrentWindowAndSwitchToMain() {
        await browser.getAllWindowHandles().then(async (handles) => {
            if (handles.length === 2) {
                await this.closeCurrentWindow();
            }
        });

        // await new customBrowserDriver().closeCurrentWindow();
        await this.switchToNewWindow(0);

    }


    /**
     * A wrapper around protractor .sendKeys(). Waits for the @element to be visible before entering @text as string.
     *  Clears any text present in the input field before entering the text
     */
    async sendKeys(element: ElementFinder, text: string):Promise<void> {
        await e2eLogInfo(`Attempting to enter text : ${text} into input field : ${element.locator()}`);
        await this.wait.untilElementIsVisible(element);
        await this.clearText(element);
        await element.sendKeys(text).then(
            null,(err)=> e2eConsoleLogError(`Failed to enter text : ${text} into input field : ${element.locator()}`));
        await e2eLogInfo(`Successfully entered text : ${text} into input field : ${element.locator()}`);
    }

    /**
     *  A wrapper around protractor .sendKeys() for dropdown element. Wait for the @element to be visible before entering @text as string.
     */
    async sendKeysToDropdown(element : ElementFinder, text: string) {
        await this.wait.untilElementIsVisible(element);
        await element.sendKeys(text);
    }

    /**
     *  Clears any text/string present in an input field.
     */
    async clearText(element: ElementFinder) {
        await browser.actions().mouseMove(element).perform();
        await element.sendKeys(protractor.Key.CONTROL, "a");
        await browser.sleep(400);
        await element.sendKeys(protractor.Key.DELETE);

    }

    /**
     * Selects specified @itemName from the dropdown field. If there are multiple dropdown fields on the page with the
     * same className then pass @dropDownFieldIndex argument to select the relevant one.
     */
    async selectElementFromDropdown(elementList:ElementArrayFinder, itemName:string):Promise<void> {
      //  let dropDownList;
        // if (index) {
        //     dropDownList = await $$(cssSelector).get(index).$$(`select option`);
        // } else {
        //     dropDownList = await $$(`${cssSelector} select option`);
        // }
        for (let i of await elementList) {
            if ((await i.getAttribute('value')).includes(itemName)) {
                await this.click(i);
                await e2eLogInfo(`Selected Item : ${itemName} from Dropdown Field : ${i}`);
                break;
            }
        }


    }


    /** Sends 'Enter' Key press from the keyboard. If the @element param is provided then the
     *  @element is selected before hitting 'Enter.
     */
    async pressEnter(element?) {
        if (element) {
            await element.sendKeys(protractor.Key.ENTER);
            await e2eLogInfo(`Simulated Keyboard press: ENTER on element: ${element}`);
        } else {
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            await e2eLogInfo('Simulated Keyboard press on the browser:  ENTER ');
        }
        await browser.sleep(500);
    }


    async sendKeyBoardShortCutEdit() {
        await browser.sleep(500);
        await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, protractor.Key.SHIFT, 'E'));
        await e2eLogInfo('Simulated Keyboard press on the browser:  CTRL+SHIFT+E ');
    }

    /**
     *  Returns the text contained in an input field. Use this for retrieving text from input field elements only.
     */
    async getElementInputText(element: ElementFinder): Promise<string> {
        await this.wait.untilElementIsVisible(element);
        let text = await element.getAttribute('value').then(
            null,(err)=> e2eConsoleLogError(`Failed to retrieve text : ${text} from input field : ${element.locator()}`));
        await e2eLogInfo(`Retrieved text : ${text} from input field : ${element.locator()}`);
        return text;

    }

    /**
     *  Returns the text of an element. Use this for retrieving visible text of a web element (except input field).
     */
    async getElementText(element: ElementFinder):Promise<string> {
        await this.wait.untilElementIsVisible(element);
        let text = await element.getText().then(
            null,(err)=> e2eConsoleLogError(`Failed to retrieve visible text : ${text} of WebElement : ${element.locator()}`));
        await e2eLogInfo(`Retrieved text : ${text} from WebElement : ${element.locator()}`);
        return text;

    }

    /**
     *  Switches to the browser window specified by index : @windowIndex
     */
    async switchToNewWindow(windowIndex):Promise<void> {
        await browser.getAllWindowHandles().then(async (handles) => {
            await browser.switchTo().window(handles[windowIndex]);
            await e2eLogInfo(`Navigated to URL : ${await browser.getCurrentUrl()} `);
        });
    }

    /**
     *  Closes current window
     */
    async closeCurrentWindow() {
        await browser.driver.close();
    }

    /**
     * Navigate to the specified page without reloading the browser. The page name is the value after '#' and before ':' on the url
     * The function first looks up the current url and appends the pageName to the end of the URL
     */
    async setLocation(pageName:string):Promise<void> {
        await browser.sleep(1000);
        let currentUrlWithLoginToken = browser.getCurrentUrl().then((currentUrl) => (currentUrl.split('#', 1)).toString());
        await browser.sleep(1000);
        await browser.executeScript(((currentUrlWithLoginToken, pageName) => window.location.href = (`${currentUrlWithLoginToken}#${pageName}`)), currentUrlWithLoginToken, pageName);
        await e2eLogInfo(`Navigated to URL : ${await browser.getCurrentUrl()} `);
    }

    /**
     *   Returns Web Table on the current page (contained within tag <table>) as an array of objects.
     *   Each row of the table is part of the webTable array
     *   All the table data (contained within tag <td>) is stored as a key : value pair within the webTable array.
     *   The key is the last className of the <td> tag and the value is the data displayed on the webpage.
     *
     *   @return : Returns the webTable as an array of object
     */

    async getWebTable() {
        await browser.sleep(2000);
        const webTableLocator = $$('.tableCell');
        await new CustomWait().untilElementIsVisible(webTableLocator.first());
        let webElementsList = await webTableLocator;
        let webTable: object = {"webTable": []};
        let webTableRow = {};
        for (let i of webElementsList) {

            let lastClassName = await i.getAttribute('class').then((classText) => classText.split(" ")).then((x) => x[x.length - 1]);
            let allClassNames = await i.getAttribute('class');

            if (allClassNames.toLowerCase().includes('lastcolumn')) {

                webTableRow[lastClassName] = await new CustomBrowserDriver().getElementText(i);
                await webTable["webTable"].push(webTableRow);
                 webTableRow = {};
            } else {
                webTableRow[lastClassName] = await new CustomBrowserDriver().getElementText(i);
            }
        }

        return webTable["webTable"];
    }

    /**
     *   Reads the web Table on the page that the driver is currently on.
     *   @key - last className of the first column in the table
     *   @row - the visible text on the AOL page, of the first column in the table
     *   @column - last className of the column you wish to return the value
     */

    async getWebTableData(key, row, column) {
        let webTable = await new CustomBrowserDriver().getWebTable();
        let webRow = webTable.filter((x) => (x[key].toLowerCase() === row))[0];

        return webRow[column];

    }

}