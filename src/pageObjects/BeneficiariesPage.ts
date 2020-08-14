import {BasePage} from "./BasePage";
import {browser} from "protractor";
import {e2eLogInfo} from "../wrappers/CustomLogger";


export class BeneficiariesPage extends BasePage {

    async getBeneficiaryFieldText(fieldClassName, beneficiaryIndex) {
        beneficiaryIndex--;
        return this.getWebElemText(fieldClassName, beneficiaryIndex);
    }

    async clickCreate(){
        await this.clickOnWebElem('Create');
    }

    async clickAddBeneficiary(){
        await this.clickOnWebElem('AddBeneficiary');
    }

    async clickUpdate(){
        await this.clickOnWebElem('Update');
    }

    async clickBindingNominationForm(){
        await browser.sleep(3000);
        await this.clickOnWebElem('Beneficiaries_bindingNominationButtonBar_header a');
        await browser.sleep(5000);


    }

    async deleteBeneficiary(beneficiaryNumber){
        await this.clickOnWebElem(`RemoveBeneficiary${beneficiaryNumber}`);
        await this.clickOnWebElem('Next');
        await this.clickOnWebElem('Submit');
        await browser.sleep(2000);
    }

    async enterIntoBeneficiaryFormField(beneficiaryDataTable,beneficiaryNumber){
        await e2eLogInfo(`--- Entering details in Beneficiary Form fields ---`);
        let beneficiaryElementindex =  beneficiaryNumber - 1;
        await this.enterIntoFormField(beneficiaryDataTable, beneficiaryElementindex);
    }
}