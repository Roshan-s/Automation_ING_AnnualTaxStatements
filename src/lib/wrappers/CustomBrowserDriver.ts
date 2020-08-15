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


    /** Sends 'Enter' Key press from the keyboard. If the @element param is provided then the
     *  @element is selected before hitting 'Enter.
     */
    async pressEnter(element?) {
        if (element) {
            await element.sendKeys(protractor.Key.ENTER);
        } else {
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        }
        await browser.sleep(500);
    }


    async sendKeyBoardShortCutEdit() {
        await browser.sleep(500);
        await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, protractor.Key.SHIFT, 'E'));

    }

    async pressTab(numberOfTimes: number){
        let counter = numberOfTimes;
        while (counter > 0){
            await browser.actions().sendKeys(protractor.Key.TAB).perform();
            counter--;
        }

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

    }

}