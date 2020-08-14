import {BasePage} from "./BasePage";
import {e2eLogInfo} from "../wrappers/CustomLogger";

export class ReversionaryPage extends BasePage{

    async enterIntoReversionaryFormField(dataTable){
        await e2eLogInfo(`--- Entering details in Reversionary Form fields ---`);
        await this.enterIntoFormField(dataTable);
    }

    async getReversionaryFieldText(className){
        return await this.getWebElemText(`${className} div div`);
    }
}