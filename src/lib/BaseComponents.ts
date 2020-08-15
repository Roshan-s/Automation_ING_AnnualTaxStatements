import {CustomBrowserDriver} from "./wrappers/CustomBrowserDriver";
import {$, $$, browser, ElementArrayFinder, ElementFinder, ElementHelper, Locator} from "protractor";


export class BaseComponents {

    driver: CustomBrowserDriver;


    constructor() {
        this.driver = new CustomBrowserDriver();
    }



    /* Locators
    */

    protected getWebElem(cssSelector:string,index?:number): ElementFinder{
        return index ? $$(cssSelector).get(index) : $(cssSelector);
    }

    protected getAllWebElem(cssSelector:string): ElementArrayFinder{
        return $$(`.${cssSelector}`);
    }

    protected getInputField(cssSelector:string,index?:number): ElementFinder{
        return index ? $$(cssSelector).get(index) : $(cssSelector);
    }

    protected getAllDropDownElem(cssSelector:string,index?:number): ElementArrayFinder{
        return index ? $$(`.${cssSelector}`).get(index).$$(`select option`) : $$(`.${cssSelector}`).$$(`select option`);
    }



    /*  Web Element Functions - These list of functions lets you interact with a Web Element.
     */


     async clickOnWebElem(cssSelector: string, index?: number): Promise<void> {
        return this.driver.click(index ?  this.getWebElem(cssSelector, index) : await this.getWebElem(cssSelector));
    }

     async clickOnInputField(cssSelector: string, index?: number): Promise<void> {
        return this.driver.click(index ? this.getInputField(cssSelector,index) : this.getInputField(cssSelector));
    }


    async enterIntoInputField (cssSelector: string, inputText: string, index?: number): Promise<void> {
        return this.driver.sendKeys(index ? this.getInputField(cssSelector,index) : this.getInputField(cssSelector),
            inputText);
    }


}