import {BasePage} from "./BasePage";
import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";
import {e2eLogInfo} from "../wrappers/CustomLogger";
import {browser} from "protractor";


export class ValuationPage extends BasePage {


    async getInvBreakDownWebTable(){
      let invBreakDownTable =  await new CustomBrowserDriver().getWebTable();
      await e2eLogInfo(`Returned Investment BreakDown Web table on the Valuation Page as JSON array : 
                             ${await JSON.stringify(invBreakDownTable)}`);
      return invBreakDownTable;
    }

    async exportInvValuationDetailsToExcel(){
        await this.selectItemFromDropdown('valuationExportBar','xlsx');
        await this.clickOnWebElem('exportBar div a');
        await browser.sleep(5000);
    }

    async exportInvValuationDetailsToPDF(){
        await this.selectItemFromDropdown('valuationExportBar','pdf');
        await this.clickOnWebElem('exportBar div a');
        await browser.sleep(5000);
    }

}