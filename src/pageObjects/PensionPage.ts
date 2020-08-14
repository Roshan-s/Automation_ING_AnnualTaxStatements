import {BasePage} from "./BasePage";
import {e2eLogInfo} from "../wrappers/CustomLogger";



export class PensionPage extends BasePage {


    async getPensionFieldText(fieldClassName) {
        let fieldText = await this.getWebElemText(`${fieldClassName} div div`);
        return fieldText;
    }

    async enterIntoPensionFormField(dataTable){
        await e2eLogInfo(`--- Entering details in Pension Form fields ---`);
        await this.enterIntoFormField(dataTable);
    }

    async clickUpdatePensionPaymentDetails(){
        await this.clickOnWebElem('UpdatePensionPaymentDetails');
    }

    async clickUpdatePensionDetails(){
        await this.clickOnWebElem('UpdatePensionDetails');
    }

}


