import {BasePage} from "./BasePage";
import {browser} from "protractor";

export class CentrelinkSchedulePage extends BasePage{



    async exportCentrelinkScheduleToExcel(){
        await browser.sleep(3000);
        await this.selectItemFromDropdown('centrelinkExportBar','xlsx');
        await this.clickOnWebElem('right');
        await browser.sleep(5000);
    }

    async clickRequestNewSchedule(){
        await this.clickOnWebElem('RequestNewSchedule');
    }

    async getLatestCentrelinkScheduleDate(){
        await browser.sleep(2000);
       return await this.clickOnWebElem('correspondenceDate',0);
    }

}