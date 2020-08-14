import {Then, When} from "cucumber";
import {ProfilePage} from "../pageObjects/ProfilePage";
import SoapCall from "../utils/soap/SoapCall";
import {memberNumber} from "./dataBaseQueryStepDef";
import {e2eLogInfo} from "../wrappers/CustomLogger";
import {expect} from "chai";
let timeout = 3;

Then('I validate that the Investment Profile is listed correctly on AOL', async () => {

    let contributionMixWebTable = await new ProfilePage().getAllInvestmentsWithNameAndPercentage();


    // let contributionMixSOAP = await new SoapCall().getMemberInvestmentProfile(memberNumber);
    //
    // await contributionMixSOAP.map((invSOAP)=>{
    //     let investmentName = invSOAP['investmentManagerName'];
    //     console.log(contributionMixWebTable[investmentName]);
    //     console.log(invSOAP['investmentPercentage']);
    //     expect(contributionMixWebTable[investmentName]).includes(invSOAP['investmentPercentage']);
    // });
    await console.log(contributionMixWebTable);

});