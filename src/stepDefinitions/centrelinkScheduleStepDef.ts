import {Then, When} from "cucumber";
import {expect} from "chai";
import {
    getCurrentDate
} from "../utils/dateUtil";
import {CentrelinkSchedulePage} from "../pageObjects/CentrelinkSchedulePage";
import {deleteXlsxFile} from "../utils/excelUtil";



When('I click Request New Schedule', async () => {
    await new CentrelinkSchedulePage().clickRequestNewSchedule();
});

When('I export Centrelink Details to Excel', async () => {
    await new CentrelinkSchedulePage().exportCentrelinkScheduleToExcel();
});

Then('I verify the latest Centrelink Schedule appears within the list', async () => {
    let latestDownloadedScheduleDate = await new CentrelinkSchedulePage().getLatestCentrelinkScheduleDate();

    await expect(latestDownloadedScheduleDate,`Expected latest Centrelink Schedule date to be : ${await getCurrentDate()} however found
                                                  : ${await getCurrentDate()}`).to.equal(await getCurrentDate());
    await deleteXlsxFile('CentrelinkSchedule');
});

