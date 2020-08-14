import {$, $$} from "protractor";
import {e2eLogInfo} from "../wrappers/CustomLogger";
import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";


export class ShareTradingPage{

    /*
         WebElement Locators
      */

    private getShareTradingAgreeCheckbox(){
        return $('input[type="checkbox"][id*="ShareTrading_shareSignUp.I"]');
    }

    private getShareTradingSubmittedMessage(){
        return $('.ShareTrading_shareSignUpPending_header');
    }

    private getBuyNewShareButton(){
        return $('.horizontalButtonBar .Buy');
    }

    private getShareListDropDownfield(){
        return $('.shareTradeListType select');
    }

    private getShareListDropDownOptions(){
        return $$('.shareTradeListType select option');
    }

    private getNumberOfSharesInputField(){
        return $('.shareNumber input');
    }

    /*
        Functions
     */

    async checkShareTradingAgreeCheckbox(){
        await new CustomBrowserDriver().click(await this.getShareTradingAgreeCheckbox());
        await e2eLogInfo(`Selected checkbox ${new CustomBrowserDriver().getElementInputText(await this.getShareTradingAgreeCheckbox())}`);
    }

    async getShareTradingSubmittedMessageText(){
        let submittedMessage = await new CustomBrowserDriver().getElementText(this.getShareTradingSubmittedMessage());
        await e2eLogInfo(`Found the following submitted share trading message on the Share Trading Page : ${submittedMessage}`);
        return submittedMessage;
    }

    async clickBuyNewShareButton(){
        await new CustomBrowserDriver().click(await this.getBuyNewShareButton());
    }

    async clickShareListDropDown(){
        await new CustomBrowserDriver().click(await this.getShareListDropDownfield());
    }

    async selectShareListOption(shareCode){
        for(let i of await this.getShareListDropDownOptions()){
            if((await i.getAttribute('value')).includes(shareCode)){
                await i.click();
                break;
            }
        }
    }

    async enterNumberOfShares(numberOfShares){
        await new CustomBrowserDriver().sendKeys(this.getNumberOfSharesInputField(),numberOfShares);
    }
}