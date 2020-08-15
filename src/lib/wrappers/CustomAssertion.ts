/*
 Author      : Roshan S.
 Description : This class contains custom assertion functions which are not not natively available under 'chai' assertion module
*/

import {expect} from 'chai';
import {browser} from "protractor";
import {CustomWait} from "./CustomWait";
import {e2eConsoleLogError} from "./CustomLogger";



export class CustomAssertion {

    async verifyPageTitleEquals(title: string) {
        await new CustomWait().untilPageTitleIs(title);
        await expect(await browser.getTitle()).to.equal(title);
    }

    /**
     *  Returns true if the current total of windows in the browser equals the expected value.
     *  Returns false if the the current total of windows in the browser does not equal the expected value after a timeout.
     */
    async verifyTotalWindowHandlesEquals(expectedWindowHandles, timeOut) {
        let flag = false;

        for (let i = 0; i < timeOut; i++) {
            let totalWindowHandles = await browser.getAllWindowHandles();
            if (totalWindowHandles.length === expectedWindowHandles) {
                flag = true;
                return flag;
            }
            i+= 1000;
            await browser.sleep(1000);
        }
        return flag;
    }

    /**
     *  This function can be used compare the expected value in a dataTable form a .feature file vs the actual value contained in the DB column
     *
     *  Needs two arguments : @dataBaseDataTable & @dataFromDataBase
     *
     * @dataBaseDataTable - Only a datatable with two columns would work. The first column would be the DB column and the second it's expected value.
     *  @dataFromDatabase - This is an array of queryResult returned from the database. Only the first row of the query result is relevant and is considered for comparison.
    */
    async verifyValueFromDataTableAgainstDatabase(dataTable,dataFromDataBase){

        for (let row of await dataTable.rows()) {
            // Value retrieved by passing the DB Column name. This is passed from the First column of the datTable
            let actualValue = await dataFromDataBase[row[0]];

            // The Second column consisting of expected value in the DB column
            let expectedValue = await row[1];

            await expect((expectedValue.toString()).trim(), `Expected DB Column : ${row[0]} to contain value : ${(expectedValue.toString()).trim()}
            however found ${actualValue.toString()}`).to.equal((actualValue.toString()).trim());
        }
    }
}