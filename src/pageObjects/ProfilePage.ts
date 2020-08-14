import {BasePage} from "./BasePage";
import {$, $$, browser, by, element, ElementArrayFinder, ElementFinder} from "protractor";
import {e2eConsoleLogError, e2eLogInfo} from "../wrappers/CustomLogger";
import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";



export class ProfilePage extends BasePage {

    /*
        Reads the whole investment table on the Profile page and returns the Investment Name and it's Allocation Percentage as a Key : Value Pair
        Example :  {'Cash Hub' : '10.20%'}
     */
    async getAllInvestmentsWithNameAndPercentage(timeout:number = 3) : Promise<object> {


       let investmentList : string[] = await this.getAllWebElementsText(`investmentProfileDetailsList td `);


        await browser.sleep(2000);

        // Try to retrieve the list 3 more times if the first attempt fails
        while((investmentList.length === 0 ) && (timeout > 0)){
            timeout--;
            await this.getAllInvestmentsWithNameAndPercentage();
        }

        let investmentListAsObject = {};
        await investmentList.forEach((item,index)=>{
            if(index % 2 === 0) {
                investmentListAsObject[item] = investmentList[index + 1];
            }
        });
        return investmentListAsObject;



    }
}


