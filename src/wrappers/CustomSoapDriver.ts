import {e2eLogError} from "./CustomLogger";
import {browser} from "protractor";
import {getWebServiceURL} from "../env/environmentProps";
import {SoapMethod} from "soap";
import * as soap from 'soap';
import {client, host} from "../hooks/preHooks";







/**
 *  Create a new SOAP client from the WSDL url
 *
 * @return soapOperation - Returns a SOAP Operation as a function object
 *
 * @param serviceName - The service name of a Web Service, typically found
 * at the end of an Web Service Endpoint
 * Example:- For the following, web service - http://sup-ing-app1:9390/IngDev2WebServices/Member, 'Member' is the serviceName
 *
 * @param operationName - The SOAP operation that you wish to return
 * When the WSDL file is opened in a browser, the various operations are listed are the 'message' tag
*/
const getOperationByWSDLAndMessageName = (serviceName:string, operationName:string): Promise<SoapMethod> => {
    return new Promise((resolve, reject) => {
        soap.createClient(`http://${getWebServiceURL(client, host)}/${serviceName}?wsdl`, (err, client) => {
            if (err) {
                e2eLogError(err);
                reject(err);
            } else {
                resolve(client[operationName]);
            }
        });

    });
}

/**
 * @return array of objects. Objects are elements returned from the SOAP response.
 * Suppose for WSDL : http://sup-ing-app1:9390/IngDev2WebServices/Accounting?wsdl, we call the operation : getInvestmentBreakdown00001
 * and pass the element as 'investment' then the following SOAP Response :
 *  <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
 *  <S:Body>
 *     <ns2:getInvestmentBreakdown00001Response xmlns:ns2="http://services.acuritywebservices.finsyn.com.au/">
 *        <return total="249774.51">
 *           <investment>
 *              <balance>25420.24</balance>
 *                <fundCode>INGD</fundCode>
 *                <investmentManagerCode>02</investmentManagerCode>
 *                <investmentManagerLongCode>SUPPMBLGR</investmentManagerLongCode>
 *                <investmentManagerName>Balanced</investmentManagerName>
 *                <investmentType/>
 *                <memberNumber>000003</memberNumber>
 *                <priceDate>2020-07-02T00:00:00+10:00</priceDate>
 *                <unitPrice>1.676400</unitPrice>
 *                <unitsHeld>15163.588000</unitsHeld>
 *             </investment>
 *             <investment>
 *              <balance>115538.07</balance>
 *              <fundCode>INGD</fundCode>
 *              <investmentManagerCode>03</investmentManagerCode>
 *              <investmentManagerLongCode>SUPPMHIGR</investmentManagerLongCode>
 *              <investmentManagerName>High Growth</investmentManagerName>
 *              <investmentType/>
 *              <memberNumber>000003</memberNumber>
 *              <priceDate>2020-07-02T00:00:00+10:00</priceDate>
 *              <unitPrice>2.183500</unitPrice>
 *              <unitsHeld>52914.162000</unitsHeld>
 *           </investment>
 *        </return>
 *        <jobNumber>110351341</jobNumber>
 *     </ns2:getInvestmentBreakdown00001Response>
 *  </S:Body>
 *  </S:Envelope>

 *  is returned as a JSON array as follows :

 * [ { balance: '25420.24',
 *   fundCode: 'INGD',
 *   investmentManagerCode: '02',
 *   investmentManagerLongCode: 'SUPPMBLGR',
 *   investmentManagerName: 'Balanced',
 *   investmentType: '',
 *   memberNumber: '000003',
 *   priceDate: 2020-07-01T14:00:00.000Z,
 *   unitPrice: '1.676400',
 *   unitsHeld: '15163.588000' },
 *  { balance: '115538.07',
 *   fundCode: 'INGD',
 *   investmentManagerCode: '03',
 *   investmentManagerLongCode: 'SUPPMHIGR',
 *   investmentManagerName: 'High Growth',
 *   investmentType: '',
 *   memberNumber: '000003',
 *   priceDate: 2020-07-01T14:00:00.000Z,
 *   unitPrice: '2.183500',
 *   unitsHeld: '52914.162000' }]
 *
 *   @param soapOperation - Expects a SOAP operation as a function, as returned by function : getOperationByWSDLAndMessageName
 *
 *   @param soapRequestParameters - Expects the required SOAP parameters in the Request body
 *   For operation : getOperationByWSDLAndMessageName, a SOAP request body requires the below parameters
 *   for a successful response

 * <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.acuritywebservices.finsyn.com.au/">
 *  <soapenv:Header/>
 *  <soapenv:Body>
 *     <ser:getInvestmentBreakdown00001>
 *        <!--Optional:-->
 *        <endUser>  </endUser>
 *        <!--Optional:-->
 *        <fundCode> </fundCode>
 *        <!--Optional:-->
 *        <memberNumber> </memberNumber>
 *        <!--Optional:-->
 *        <effectiveDate> </effectiveDate>
 *     </ser:getInvestmentBreakdown00001>
 *  </soapenv:Body>
 * </soapenv:Envelope>
 *
 *  In the above example, the parameters need to passed as an object like below :
 *
 * {
 *  endUser: <endUser>,
 *  fundCode: <fundCode>,
 *  memberNumber: <memberNumber>,
 *  effectiveDate: <effectiveDate>
 * }
 *
 * @param elementName - Collection of tags that you wish to return. In the above example, 'investment'
 *
 */
const getOperationResponseBody = (soapOperation:SoapMethod ,soapRequestArgs:object,elementName:string):Promise<object[]> => {
    return new Promise((resolve, reject) => {
        soapOperation(soapRequestArgs, (err, result) => {
            if (err) {
                e2eLogError(err);
                reject(err);
            } else {
                resolve(result['return'][elementName]);
            }

        });
    });
}


export const getSoapResponseByWSDLAndOperation = async (serviceName: string,operationName:string,soapRequestArgs:object,elementName:string):Promise<object[]> =>
    getOperationResponseBody(await getOperationByWSDLAndMessageName(serviceName,operationName),soapRequestArgs,elementName);











