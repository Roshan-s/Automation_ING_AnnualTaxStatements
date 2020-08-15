/*
* Author      : Roshan S.
* Description : This class contains wrapper functions for frequently used Protractor 'wait' methods.
*
* */

import {browser, ElementFinder, ExpectedConditions} from "protractor";


export class CustomWait {

    private readonly waitTimeout;

    constructor() {
        this.waitTimeout = 60000;
    }

    async untilPageTitleIs(title: string) :Promise<void> {
        await browser.wait(await ExpectedConditions.titleIs(title), this.waitTimeout, `Form title should be equivalent to : ${title} however 
        found : ${await browser.getTitle()}`);
    }

    async untilElementIsVisible(element: ElementFinder):Promise<void> {
        await browser.wait(await ExpectedConditions.visibilityOf(element), this.waitTimeout,`Timed out waiting for element : ${element.locator()}`);
    }

    async untilUrlContains(urlText: string):Promise<void>{
        await browser.wait(await ExpectedConditions.urlContains(urlText),this.waitTimeout,`Expected url to contain the following: ${urlText}`);
    }




}