import {When} from "cucumber";
import AdminMemberSearchPage from "../pageObjects/AdminMemberSearchPage";
import DataBaseCall from "../utils/database/DataBaseCall";


export let memberNumber,fundType,categoryType;

/*
  Step defs to retrieve the relevant member for the test case.
 */

When('I look up for a member over {string} years of age in super fund', async (age) => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberOverAge(age, fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look up for a member under {string} years of age in super fund', async (age) => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberUnderAge(age, fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look up for a member between {string} and {string} years of age with work-test pending in super fund', async (minimumAge, maximumAge) => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberBetweenAge_WithPendingWorkTest(minimumAge, maximumAge, fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for a member under {string} with no existing direct debit in super fund', async (age) => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberUnderAge_WithoutAnExistingDirectDebit(age, fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for a member with existing direct debit in super fund', async () => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberWithExistingDirectDebit(fundType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for a member with no share trading account in super fund', async () => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberWithoutAnExistingShareTradingAccount('super', 'super');
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, 'super');
});

When('I look for a member with share trading account in super fund', async () => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberWithExistingShareTradingAccount();
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for a member under {string} with no active beneficiary in super fund', async (age) => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberUnderAge_WithoutAnExistingBeneficiary(age, fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for a member under {string} with an active beneficiary in super fund', async (age) => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberUnderAge_WithExistingBeneficiary(age, fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for member with an active pension account', async () => {
    fundType = 'pension',categoryType = 'pension';
    memberNumber = await new DataBaseCall().getMemberWithAnActivePensionAccount();
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for member with an active pension account and no reversionary', async () => {
    fundType = 'pension',categoryType = 'pension';
    memberNumber = await new DataBaseCall().getMemberWithAnActivePensionAccountAndNoReversionary();
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I look for member with an active pension account and an existing reversionary', async () => {
    fundType = 'pension',categoryType = 'pension';
    memberNumber = await new DataBaseCall().getMemberWithAnActivePensionAccountAndAnExistingReversionary();
    await new AdminMemberSearchPage().enterIntoSearchTerms(memberNumber, fundType);
});

When('I enter an active member number in the Admin Member Search Page', async () => {
    fundType = 'super',categoryType = 'super';
    memberNumber = await new DataBaseCall().getMemberUnderAge('65', fundType, categoryType);
    await new AdminMemberSearchPage().enterIntoSearchTermsAndDoNotClickOnResult(memberNumber, fundType);
});








