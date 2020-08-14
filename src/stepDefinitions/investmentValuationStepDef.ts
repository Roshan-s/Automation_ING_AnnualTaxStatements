import {Then, When} from "cucumber";
import {ValuationPage} from "../pageObjects/ValuationPage";
import {expect} from "chai";
import SoapCall from "../utils/soap/SoapCall";
import {memberNumber} from "./dataBaseQueryStepDef";
import {browser} from "protractor";
import {deleteXlsxFile} from "../utils/excelUtil";
import {deletePdf} from "../utils/pdfUtil";




When('I export Investment Valuation details to Excel', async () => {
    await new ValuationPage().exportInvValuationDetailsToExcel();
});

When('I export Investment Valuation details to PDF', async () => {
    await new ValuationPage().exportInvValuationDetailsToPDF();
});


Then('I validate that the Investment Valuation is listed correctly on AOL', async () => {
    await browser.sleep(3000);
    // Fetch Investment details from the Valuation Page
    let invBreakdownWebTable = await new ValuationPage().getInvBreakDownWebTable();

    // Fetch Investment details from the Web Service
    let invBreakdownSOAP = await new SoapCall().getMemberInvBreakDown(memberNumber);


    // SOAP element vs Corresponding AOL Field ClassNames
    let SOAP_To_AOL_element = {
        "balance" : "marketValue",
        "priceDate" : "effectiveDate",
        "unitPrice" : "currentPrice",
        "unitsHeld" : "units"
    }

    /*
       Go through the SOAP element and verify the data
       in the corresponding AOL field
     */
    await invBreakdownSOAP.map(async (invSOAP)=>{
        let investmentName = invSOAP['investmentManagerName'];
        let invBreakDownWebTableRow = invBreakdownWebTable.filter(  (row) => (row["investment"].includes(investmentName)))[0];

        for(let SOAP_TagName in SOAP_To_AOL_element){
            /*
               For elements without any data, the 'NaN' is added as the value in the SOAP object[]
            */
            if(invSOAP[SOAP_TagName].includes('NaN')){
                 await expect(invBreakDownWebTableRow[SOAP_To_AOL_element[SOAP_TagName]]).to.equal('');
            }else{
                 await expect(invSOAP[SOAP_TagName],
                    `Found Investment Valuation : ${investmentName} SOAP tag : ${SOAP_TagName} value to be : ${invSOAP[SOAP_TagName]} however
                      on the AOL page Found Investment Valuation : ${investmentName} Web Table cell : ${SOAP_To_AOL_element[SOAP_TagName]} value to be : ${invBreakDownWebTableRow[SOAP_To_AOL_element[SOAP_TagName]]}`
                ).to.equal(invBreakDownWebTableRow[SOAP_To_AOL_element[SOAP_TagName]]);
            }
        }

    });
});

Then('I verify {string} xlsx file is saved and contains Investment Valuation details', async (xlsxFileName) => {
    await deleteXlsxFile('InvestmentValuation');
});

Then('I verify {string} pdf file is saved and contains Investment Valuation details', async (xlsxFileName) => {

    await deletePdf('InvestmentValuation');
});
