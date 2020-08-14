import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";
import {$, $$, browser, ElementArrayFinder, ElementFinder, ElementHelper, Locator} from "protractor";
import {e2eLogInfo} from "../wrappers/CustomLogger";
import {TableDefinition} from "cucumber";

let AOL_DropdownFieldClassName = ['benTitle', 'benGender', 'benRelationship', 'country', 'state',
    'state', 'paymentType', 'paymentFrequency', 'revTitle', 'revGender', 'revRelationship'];

export class BasePage {

    driver: CustomBrowserDriver;


    constructor() {
        this.driver = new CustomBrowserDriver();
    }



    /* Locators
    */

    protected getWebElem(cssSelector:string,index?:number): ElementFinder{
        return index ? $$(`.${cssSelector}`).get(index) : $(`.${cssSelector}`);
    }

    protected getAllWebElem(cssSelector:string): ElementArrayFinder{
        return $$(`.${cssSelector}`);
    }

    protected getInputField(cssSelector:string,index?:number): ElementFinder{
        return index ? $$(`.${cssSelector} input`).get(index) : $(`.${cssSelector} input`);
    }

    protected getAllDropDownElem(cssSelector:string,index?:number): ElementArrayFinder{
        return index ? $$(`.${cssSelector}`).get(index).$$(`select option`) : $$(`.${cssSelector}`).$$(`select option`);
    }



    /*  Web Element Functions - These list of functions lets you interact with a Web Element.
     */


    protected async clickOnWebElem(cssSelector: string, index?: number): Promise<void> {
        return this.driver.click(index ?  this.getWebElem(cssSelector, index) : await this.getWebElem(cssSelector));
    }

    protected async clickOnInputField(cssSelector: string, index?: number): Promise<void> {
        return this.driver.click(index ? this.getInputField(cssSelector,index) : this.getInputField(cssSelector));
    }

    protected async getWebElemText(cssSelector: string, index?: number): Promise<string> {
        return this.driver.getElementText(index ? this.getWebElem(cssSelector, index) : this.getWebElem(cssSelector));
    }

    protected async getAllWebElementsText(cssSelector: string): Promise<string[]> {
        // @ts-ignore
        return (this.getAllWebElem(cssSelector)).getText();
    }

    protected async enterIntoInputField (cssSelector: string, inputText: string, index?: number): Promise<void> {
        return this.driver.sendKeys(index ? this.getInputField(cssSelector,index) : this.getInputField(cssSelector),
            inputText);
    }

    protected async selectItemFromDropdown(cssSelector:string, item:string, index?:number):Promise<void> {
        await this.driver.selectElementFromDropdown(index ? this.getAllDropDownElem(cssSelector,index) : this.getAllDropDownElem(cssSelector)
            ,item);
    }

    protected async enterIntoFormField(dataTable: TableDefinition,index?:number):Promise<void> {
        for (let row of await dataTable.rows()) {
            if(AOL_DropdownFieldClassName.includes(row[0])){
                (index ? await this.selectItemFromDropdown(row[0], row[1], index) : await this.selectItemFromDropdown(row[0],row[1],index));
          }  else {
                (index ? await this.enterIntoInputField(row[0], row[1], index) : await this.enterIntoInputField(row[0],row[1],index));
          }
        }
    }

    /*  Navigates to the passed page name. @pageName is the key with the corresponding value
    */

    async goToPage(pageName:string) {
        await this.driver.click($('a[href="#' + pageName + '"]'));
        await e2eLogInfo(`Navigated to page : ${pageName}`);
    }


    async clickSaveAsPDFButton() {
        await this.driver.click(await this.getSaveAsPDFButton());
        await e2eLogInfo(`Clicked Save As PDF Button`);
        await browser.sleep(5000);
    }

    async clickSubmit() {
        await this.clickOnWebElem('Submit');
    }

    async clickNext() {
        await this.clickOnWebElem('Next');
    }

    async clickDone() {
        await this.clickOnWebElem('Done');
    }

    async clickCancel() {
        await this.clickOnWebElem('cancel');
    }

    async clickDownload() {
        await this.clickOnWebElem('download');
        await browser.sleep(5000);
    }

    protected getSaveAsPDFButton() {
        return $('div[class*="print"] a');
    }

    async clickEdit() {
        await this.clickOnWebElem('Edit');
    }
}