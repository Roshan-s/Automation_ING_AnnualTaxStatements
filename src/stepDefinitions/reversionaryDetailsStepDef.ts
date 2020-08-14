import {Then, When} from "cucumber";
import {browser} from "protractor";
import DataBaseCall from "../utils/database/DataBaseCall";
import {memberNumber} from "./dataBaseQueryStepDef";
import {CustomAssertion} from "../wrappers/CustomAssertion";
import {ReversionaryPage} from "../pageObjects/ReversionaryPage";
import {expect} from "chai";

let descriptionByCode = require('../utils/database/descriptionCodeInformation');

When('I enter the following Reversionary details', async (reversionaryDataTable) => {
    await new ReversionaryPage().enterIntoReversionaryFormField(reversionaryDataTable);
});

Then('I verify Reversionary details are updated correctly in the database', async (revDataTable) => {
    await browser.sleep(3000);
    let revDetails = await new DataBaseCall().getReversionaryDetailsFromMemberNumber(memberNumber);
    await new CustomAssertion().verifyValueFromDataTableAgainstDatabase(revDataTable, revDetails);

});

Then('I verify that the Member Reversionary details on the AOL page are correct', async (dataTable) => {
    // let dataTableRows = await dataTable.rows();
    // let dataTableHash = await dataTable.rowsHash();

    let revDetailsFromDB = await new DataBaseCall().getReversionaryDetailsFromMemberNumber(memberNumber);

    for (let row of await dataTable.rows()) {

        let AOL_Field_Text = await new ReversionaryPage().getReversionaryFieldText(row[0]);
     //   let DB_Column = dataTableHash[i[0]];
        let DB_Column_Data = await revDetailsFromDB[row[1]];

        if (row[0] === 'revGender') {
            let gender = await descriptionByCode.gender[DB_Column_Data];
            await expect(AOL_Field_Text,`Expected DB Column : ${row[1]} to contain code for Description : ${AOL_Field_Text}
                  however found code for Description : ${gender}`).to.equal(gender);
        } else if (row[0] === 'revRelationship') {
            let relationship = await descriptionByCode.relationship[DB_Column_Data];
            await expect(AOL_Field_Text,`Expected DB Column : ${row[1]} to contain code for Description : ${AOL_Field_Text}
                  however found code for Description : ${relationship}`).to.equal(relationship);
        } else {
            await expect(AOL_Field_Text,`Expected DB Column : ${row[1]} to contain value : ${AOL_Field_Text} however found : ${await DB_Column_Data.trim()}`).to.equal(await DB_Column_Data.trim());
        }


    }
});
