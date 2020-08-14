import {getSoapResponseByWSDLAndOperation} from "../../wrappers/CustomSoapDriver";
import {getClientFund} from "../../env/environmentProps";
import moment from "moment";
import {e2eLogInfo} from "../../wrappers/CustomLogger";
import {client} from "../../hooks/preHooks";
import {getCurrentDate} from "../dateUtil";



export default class SoapCall {
    /**
     * @return Member's Investment Profile as a object[]
     *
     * @param memberNumber - Member Number unique to the test scenario where
     *  the function is called
    */
    async getMemberInvestmentProfile(memberNumber: string): Promise<object[]> {
        return await getSoapResponseByWSDLAndOperation('Member',
            'getMemberInvestmentProfile00001',
            {
                endUser: 'TestAutomation',
                fundCode: `${await getClientFund(client, 'super')}`,
                memberNumber: `${memberNumber}`,
                effectiveDate: `${await getCurrentDate()}`
            },
            'investmentOption');
    }


    /**
     *  @return Member's Investment Breakdown as object[]
     *
     *  @param memberNumber - Member Number unique to the test scenario where
     *   the function is called
     */
    async getMemberInvBreakDown(memberNumber: string): Promise<object[]> {
        let invBreakDownSOAP = await getSoapResponseByWSDLAndOperation('Accounting',
            'getInvestmentBreakdown00001',
            {
                endUser: 'TestAutomation',
                fundCode: `${await getClientFund(client, 'super')}`,
                memberNumber: `${memberNumber}`,
                effectiveDate: `${await getCurrentDate()}`
            },
            'investment');

        // Formatting the SOAP elements returned to match the formatting displayed on the AOL page
        await invBreakDownSOAP.forEach((elem) => {
            elem['balance'] = `$${parseFloat(elem['balance']).toLocaleString()}`;
            elem['priceDate'] = moment(elem['priceDate']).format('DD/MM/YYYY');
            elem['unitPrice'] = `$${parseFloat(elem['unitPrice']).toFixed(4).toLocaleString()}`;
            elem['unitsHeld'] = parseFloat(elem['unitsHeld']).toLocaleString();
        });

        await e2eLogInfo(`Returned Investment BreakDown SOAP as object array : 
                             ${await JSON.stringify(invBreakDownSOAP)}`);

        return invBreakDownSOAP;
    }
}

