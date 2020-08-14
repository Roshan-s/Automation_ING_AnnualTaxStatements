import {Then, When} from "cucumber";
import {MoneyInPage} from "../pageObjects/MoneyInPage";
import {expect} from "chai";
import {browser} from "protractor";
import {
    getCurrentDate
} from "../utils/dateUtil";
import DataBaseCall from "../utils/database/DataBaseCall";
import {memberNumber} from "./dataBaseQueryStepDef";

/*
Verify the expected message equals the actual message on screen.
 */

Then('I see the following ineligibility message', async (expectedMessage) => {
    let currentMessage = await new MoneyInPage().getWorkTestIneligibleMessage();
    await expect(await currentMessage.trim(), `Expected text on the page to equal : ${expectedMessage} however found ${currentMessage}`).to.include(expectedMessage.trim());
});

Then('I see the following work test ineligible message', async (expectedMessage) => {
    let currentMessage = await new MoneyInPage().getDoNotPassTheWorkTestErrorMessage();
    await expect(await currentMessage.trim(), `Expected text on the page to equal : ${expectedMessage} however found ${currentMessage}`).to.include(expectedMessage.trim());
});

Then('I see the following work test pass message', async (expectedMessage) => {
    let currentMessage = await new MoneyInPage().getTopUpAccountPaymentOptionsText();
    await expect(await currentMessage.trim(), `Expected text on the page to equal : ${expectedMessage} however found ${currentMessage}`).to.include(expectedMessage.trim());
});

When('I select I do not pass the work test', async () => {
    // Selecting 'I do not pass the work test' radio option
    await new MoneyInPage().selectWorkTestEligibilityRadioOption(1);
});

When('I select I pass the work test', async () => {
    // Selecting 'I pass the work test' radio option, followed by clicking submit button
    await new MoneyInPage().selectWorkTestEligibilityRadioOption(0);
});


When('I click Register Direct Debit', async () => {
    await new MoneyInPage().clickNewDirectDebit();
});

When('I click Update Direct Debit', async () => {
    await new MoneyInPage().clickUpdateDirectDebit();
});

When('I click Print Employer Contribution Form', async () => {
    await new MoneyInPage().clickPrintEmployerContributionForm();
});

When('I click Print Check Form', async () => {
    await new MoneyInPage().clickPrintCheckForm();
});

When('I check Direct Debit Terms and Conditions checkbox', async () => {
    await new MoneyInPage().clickDirectDebitTermsAndConditionsForm();
});

When('I enter the following Direct Debit details', async (directDebitTable) => {
    await new MoneyInPage().enterIntoDirectDebitFormField(directDebitTable);
});


Then('I verify Direct Debit details are updated correctly in Database', async (dataTable) => {
    await browser.sleep(4000);
    let directDebitDetails = await new DataBaseCall().getMemberDirectDebitDetails(memberNumber, 'super');

    for (let row of await dataTable.rows()) {
        if (row[0] === 'Formatted_SBd_Effective') {
            await expect((directDebitDetails[row[0]]), `Expected Direct Debit Effective date to equal :
             ${(directDebitDetails[row[0]])} however found : ${await getCurrentDate()}`).to.equal(await getCurrentDate());
        } else {
            let expectedValue = await directDebitDetails[row[0]];
            let actualValue = await row[1];
            await expect((expectedValue.toString()).trim(), `Expected Direct Debit Column ${row[0]} to equal ${(expectedValue.toString()).trim()}
            however found ${actualValue.toString()}`).to.equal(actualValue.toString());
        }
    }
});

// Verifies the member's D2d_Last_Worked date with the current date post update from AOL
Then('I verify Member last working date is updated to current date in Database', async () => {
    // Waiting for table to get updated post change
    await browser.sleep(3000);
    let date = await new DataBaseCall().getMember_D2d_Last_Worked(memberNumber, 'super', 'super');

    await expect(await getCurrentDate(), `Was expecting D2d_Last_Worked value for the Member: ${memberNumber} to be : ${await getCurrentDate()}
     however found : ${(date.toISOString()).substring(0, 10)}`).to.equal(await (date.toISOString()).substring(0, 10));
});

Then('I verify Member Direct Debit details on the AOL page are correct', async (dataTable) => {
    await browser.sleep(2000);
    let directDebitDetailsFromDB = await new DataBaseCall().getMemberDirectDebitDetails(memberNumber, 'super');

    for (let row of dataTable.rows()) {
        let AOL_Field = await new MoneyInPage().getDirectDebitFieldText(row[0]);
        let DB_Column_Data = await directDebitDetailsFromDB[row[1]];

        await expect(AOL_Field, `Expected ${row[1]} to contain value : ${AOL_Field} 
                    however found value : ${DB_Column_Data.trim()}`).to.equal(DB_Column_Data.trim());

    }
});


