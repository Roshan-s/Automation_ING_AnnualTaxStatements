import {Given, Then, When} from "cucumber";
import {expect} from "chai";
import {ShareTradingPage} from "../pageObjects/ShareTradingPage";
import {browser} from "protractor";
import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";
import DataBaseCall from "../utils/database/DataBaseCall";
import {memberNumber} from "./dataBaseQueryStepDef";


Then('I see the following share trade request submitted message', async (expectedMessage) => {
    let currentMessage = await new ShareTradingPage().getShareTradingSubmittedMessageText();
    expect(await currentMessage.trim(), `Expected text on the page to equal : ${expectedMessage} however found ${currentMessage}`).to.include(expectedMessage.trim());
});

Given('I buy {string} new share of {string} at market price', async (totalShare, stockCode)=> {
    await new ShareTradingPage().clickBuyNewShareButton();
    await new ShareTradingPage().clickShareListDropDown();
    await new ShareTradingPage().selectShareListOption(stockCode);
    await browser.sleep(1000);
    await new CustomBrowserDriver().pressEnter();
    await new ShareTradingPage().enterNumberOfShares(totalShare);
    await browser.sleep(3000);
});

Then('Application status is submitted in Acurity Database', async () => {

    let shareApplicationStatus = await new DataBaseCall().getShareTradingApplicationStatus(memberNumber,'super');
    await expect(shareApplicationStatus).to.equal('S');
});

When('I check Share Trading checkbox', async () => {
    await new ShareTradingPage().checkShareTradingAgreeCheckbox();
    await browser.sleep(3000);
});
