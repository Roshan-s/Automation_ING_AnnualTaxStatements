import {Then, When} from "cucumber";
import {BeneficiariesPage} from "../pageObjects/BeneficiariesPage";
import {expect} from "chai";
import DataBaseCall from "../utils/database/DataBaseCall";
import {memberNumber} from "./dataBaseQueryStepDef";
import {CustomAssertion} from "../wrappers/CustomAssertion";
import {browser} from "protractor";
import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";

When('I click Create', async () => {
    await new BeneficiariesPage().clickCreate();
});

When('I click Add Beneficiary', async () => {
    await new BeneficiariesPage().clickAddBeneficiary();
});

When('I click Update Beneficiary', async () => {
    await new BeneficiariesPage().clickUpdate();
});

When('I click Binding Nomination Form', async () => {
    await new BeneficiariesPage().clickBindingNominationForm();
});

When('I delete Beneficiary {string}', async (beneficiaryNumber) => {
    await new BeneficiariesPage().deleteBeneficiary(beneficiaryNumber);
});

When('I enter the following details for Beneficiary {string}', async (beneficiaryNumber, beneficiaryDataTable) => {
    await new BeneficiariesPage().enterIntoBeneficiaryFormField(beneficiaryDataTable,beneficiaryNumber);
});

Then('I verify Beneficiary {string} details are updated correctly in the database', async (benNumber, databaseDataTable) => {
    await browser.sleep(3000);
    let beneficiaryDetails = await new DataBaseCall().getMemberBeneficiaryDetails(memberNumber, benNumber, 'super');
    await new CustomAssertion().verifyValueFromDataTableAgainstDatabase(databaseDataTable, beneficiaryDetails);
});

Then('I verify Beneficiary details on the AOL page are correct', async () => {


    let beneficiaryDetails = await new DataBaseCall().getMemberBeneficiaryDetails(memberNumber, '1', 'super');

    expect(await new BeneficiariesPage().getBeneficiaryFieldText('fullName.tableFirstColumn', '01')).to.equal(`${(beneficiaryDetails['DXz_Given_Names']).trim().toUpperCase()} ${(beneficiaryDetails['DXz_Surname']).trim().toUpperCase()}`);
    expect(await new BeneficiariesPage().getBeneficiaryFieldText('benBirthDate', '01')).to.equal(beneficiaryDetails['Formatted_DXd_Date_Of_Birth']);
    expect(await new BeneficiariesPage().getBeneficiaryFieldText('benRelationship', '01')).to.equal((beneficiaryDetails['DXz_Dep_Relationship']).trim());
    expect(await new BeneficiariesPage().getBeneficiaryFieldText('benPercentage', '01')).includes(beneficiaryDetails['DXf_Dependant_Pcnt']);
});