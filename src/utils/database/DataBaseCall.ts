import {runSqlQueryAndReturnResult, runUpdateSqlQuery} from "../../wrappers/CustomSqlDriver";
import {e2eLogInfo} from "../../wrappers/CustomLogger";
import {getClientCategory, getClientFund} from "../../env/environmentProps";
import {client} from "../../hooks/preHooks";
import {getCurrentDate, subtractYearsFromCurrentDate} from "../dateUtil";


export default class DataBaseCall {

    /**
     * Retrieves member's detail from the sql response and logs it to the e2e log
     *
     * @param queryResult - SQL response
     * @param message - Custom message
     */
    private async logMemberDetails(queryResult,message) {
        await e2eLogInfo(`${message}
                                        Member Number: ${(queryResult['MDz_Member']).trim()} Client No: ${(queryResult['D2z_Client']).trim()} | Name: ${(queryResult['D2z_Given_Names']).trim()} ${(queryResult['D2z_Surname']).trim()}`);
    }



    async getMemberOverAge(age, fundType, categoryType) {

       let queryResult = await runSqlQueryAndReturnResult(
               `Select TOP 1 * FROM Client AS C
                      INNER JOIN Member AS M
                      ON C.D2z_Client = M.MDz_Acct_No
                      WHERE C.D2d_Birth < '${await subtractYearsFromCurrentDate(age)}' 
                      AND M.MDz_Category = '${await getClientCategory(client, categoryType)}' AND 
                      M.MDz_Fund = '${await getClientFund(client, fundType)}' AND M.MDz_Status = 'C' AND C.D2z_Status = 'C'`,
            `Could not find a client over - ${age} years of age`);

        await this.logMemberDetails(queryResult,`Retrieved Client over ${age} years of age From Database.`);

        return queryResult['MDz_Member'];
    }

    private async getMemberDetailsUnderAge(age, fundType, categoryType) {

        let queryResult = await runSqlQueryAndReturnResult(
             `Select TOP 1 * FROM Client AS C
                    INNER JOIN Member AS M
                    ON C.D2z_Client = M.MDz_Acct_No
                    WHERE C.D2d_Birth > '${await subtractYearsFromCurrentDate(age)}' AND M.MDz_Category = '${await getClientCategory(client, categoryType)}' 
                    AND MDz_Fund = '${await getClientFund(client, fundType)}' AND M.MDz_Status = 'C' 
                    AND C.D2z_Status = 'C'`,
            `Could not find a client under - ${age} years of age`);

        await this.logMemberDetails(queryResult,`Retrieved Client under ${age} years of age From Database.`);

        return queryResult;
    }


    async getMemberUnderAge(age, fundType, categoryType) {
        return (await this.getMemberDetailsUnderAge(age, fundType, categoryType))['MDz_Member'];
    }

    async getMemberWithoutAnExistingShareTradingAccount(fundType, categoryType) {

        let queryResult = await runSqlQueryAndReturnResult(`
                 Select TOP 1 * FROM Client AS C
                 INNER JOIN Member AS M
                 ON C.D2z_Client = M.MDz_Acct_No
                 INNER JOIN Mbr_Supplementry_Hst AS SB
                 ON M.MDz_Member = SBz_Member
                 WHERE M.MDz_Category = '${await getClientCategory(client, categoryType)}' AND MDz_Fund = '${await getClientFund(client, fundType)}'
                 AND M.MDz_Status = 'C' AND C.D2z_Status = 'C' AND SB.SBc_UserDefndFlags01 = ''`,
           `Could not find a client without an existing share trading account`);

        await this.logMemberDetails(queryResult,`Retrieved Client without an existing share trading account From Database.`);
        return queryResult['MDz_Member'];
    }

    async getMemberWithExistingShareTradingAccount() {

        let queryResult = await runSqlQueryAndReturnResult(
             `Select TOP 1 * FROM Client AS C
                    INNER JOIN Member AS M
                    ON C.D2z_Client = M.MDz_Acct_No
                    WHERE C.D2z_Client = (SELECT TOP 1 SBz_Client FROM Mbr_Supplementry_Hst WHERE SBc_UserDefndFlags01 = 'A')`,
            `Could not find a client with existing share trading account`);

        await this.logMemberDetails(queryResult,`Retrieved Client with an existing share trading account From Database.`);
        return queryResult['MDz_Member'];
    }


    async getMemberBetweenAge_WithPendingWorkTest(minAge, maxAge, fundType, categoryType) {

        let queryResult = await runSqlQueryAndReturnResult(`
                 Select TOP 1 * FROM Client AS C
                 INNER JOIN Member AS M
                 ON C.D2z_Client = M.MDz_Acct_No
                 WHERE  M.MDz_Category = '${await getClientCategory(client, categoryType)}' AND MDz_Fund = '${await getClientFund(client, fundType)}'
                 AND M.MDz_Status = 'C' AND C.D2z_Status = 'C' AND C.D2d_Last_Worked < '01/01/${new Date().getFullYear() - 1}'
                 AND C.D2d_Birth BETWEEN '${await subtractYearsFromCurrentDate(maxAge)}' AND '${await subtractYearsFromCurrentDate(minAge)}'`,
            `Could not find a client between - ${minAge} and ${maxAge} years of age`);

        await this.logMemberDetails(queryResult,`Retrieved Client between - ${minAge} and ${maxAge} years of age And Work-test pending From Database.`);

        return queryResult['MDz_Member'];
    }


    async getMember_D2d_Last_Worked(memberNumber, fundType, categoryType) {

        let queryResult = await runSqlQueryAndReturnResult(
             `SELECT TOP 1 * FROM Client AS C 
                    INNER JOIN Member AS M
                    ON C.D2z_Client = M.MDz_Acct_No
                    WHERE M.MDz_Member = '${memberNumber}' AND M.MDz_Category = '${await getClientCategory(client, categoryType)}' 
                    AND MDz_Fund = '${await getClientFund(client, fundType)}' 
                    AND M.MDz_Status = 'C' AND C.D2z_Status = 'C'`,
            `Error retrieving D2d_Last_Worked for ${memberNumber}`);

        await this.logMemberDetails(queryResult,`Retrieved D2d_Last_Worked Date for member ${memberNumber} From Database.`);

        return queryResult['D2d_Last_Worked'];
    }

    // Returns a member with an active super account and no direct debit details on record
    async getMemberUnderAge_WithoutAnExistingDirectDebit(age, fundType, categoryType) {
        let memberNumber = await this.getMemberUnderAge(age, fundType, categoryType);

        await runUpdateSqlQuery(`DELETE FROM Mbr_Supplementry_Hst 
                                       WHERE SBz_Member = '${memberNumber}' AND SBz_Fund = '${await getClientFund(client, fundType)}'`,
            `Unable to Delete existing Direct Debit details for member : ${memberNumber}`);

        return memberNumber;
    }

    async getMemberWithExistingDirectDebit(fundType) {

        let queryResult = await runSqlQueryAndReturnResult(
            `SELECT TOP 1 * FROM Mbr_Supplementry_Hst 
                   WHERE SBc_UserDefndFlags02 = 'Y' AND SBz_Fund = '${await getClientFund(client, fundType)}' 
                   AND SBd_Effective = '${await getCurrentDate()}' 
                   ORDER BY SBd_Effective DESC`,
            `Unable to find a member with existing Direct Debit on file`);

        return queryResult['SBz_Member'];

    }

    async getMemberDirectDebitDetails(memberNumber, fundType) {

        let queryResult = await runSqlQueryAndReturnResult(
            `SELECT TOP 1 FORMAT(SBd_Anniversary,'dd/MM/yyyy') AS Formatted_SBd_Anniversary,
                   FORMAT(SBd_Effective,'yyyy-MM-dd') AS Formatted_SBd_Effective,
                   FORMAT(SBf_User_Def_Amt_1,'C')AS Formatted_SBf_User_Def_Amt_1,
                   FORMAT(SBf_User_Def_Amt_2,'C')AS Formatted_SBf_User_Def_Amt_2,
                   * FROM Mbr_Supplementry_Hst 
                   WHERE SBz_Member = '${memberNumber}'AND SBc_UserDefndFlags02 = 'Y' AND SBz_Fund = '${await getClientFund(client, fundType)}' 
                   ORDER BY SBd_Effective DESC`,
            `Could not find Direct Debit details for member : ${memberNumber}`);

        await e2eLogInfo(`Fetched Direct Debit details for member : ${memberNumber}`);

        return queryResult;
    }

    async getMemberDetailsFromMemberNumber(memberNumber, fundType, categoryType) {

        let queryResult = await runSqlQueryAndReturnResult(`
                 Select TOP 1 *,FORMAT(D2d_Birth,'dd/MM/yyyy') AS Formatted_D2d_Birth,
                 CONCAT(RTRIM(D2z_Given_Names), ' ',D2z_Surname) As Full_Name,
                 FORMAT(GETDATE(),'dd/MM/yyyy') AS CurrentDate
                 FROM Client AS C
                 INNER JOIN Member AS M
                 ON C.D2z_Client = M.MDz_Acct_No
                 WHERE M.MDz_Category = '${await getClientCategory(client, categoryType)}' 
                 AND M.MDz_Fund = '${await getClientFund(client, fundType)}' AND M.MDz_Member = '${memberNumber}'`
    , `Could not find details for member : ${memberNumber}`);

        await e2eLogInfo(`Fetched details for member : ${memberNumber}`);

        return queryResult;
    }

    async getShareTradingApplicationStatus(memberNumber, fundType) {

        let queryResult = await runSqlQueryAndReturnResult(`
                 SELECT TOP 1 * FROM Mbr_Supplementry_Hst AS SB
                 INNER JOIN Client as C
                 ON C.D2z_Client = SB.SBz_Client
                 WHERE SB.SBd_Effective = '${await getCurrentDate()}' AND 
                 C.D2z_Client = (SELECT MDz_Acct_No from Member 
                 WHERE MDz_Fund = '${await getClientFund(client, fundType)}' AND MDz_Member = '${memberNumber}')`,
            `Could not find Share Trading application status details for member : ${memberNumber}`);

        await e2eLogInfo(`Fetched Share Trading Application status for member : ${memberNumber}`);

        return queryResult['SBc_UserDefndFlags01'];
    }

    async getMemberUnderAge_WithoutAnExistingBeneficiary(age, fundType, categoryType) {
        let queryResult = await this.getMemberDetailsUnderAge(age, fundType, categoryType);

        await runUpdateSqlQuery(`DELETE FROM Mbr_Dependants WHERE DXz_Client like '%${queryResult['D2z_Client']}%'`,
            `Unable to delete beneficiary details for member ${queryResult['MDz_Member']}`);

        return queryResult['MDz_Member'];
    }

    async getMemberUnderAge_WithExistingBeneficiary(age, fundType, categoryType) {

        let queryResult = await runSqlQueryAndReturnResult(
            `Select TOP 1 * FROM Client AS C
                   INNER JOIN Member AS M
                   ON C.D2z_Client = M.MDz_Acct_No
                   INNER JOIN Mbr_Dependants AS MB
                   ON C.D2z_Client = MB.DXz_Client
                   WHERE C.D2d_Birth > '${await subtractYearsFromCurrentDate(age)}' AND M.MDz_Category = '${await getClientCategory(client, categoryType)}'
                   AND MDz_Fund = '${await getClientFund(client, fundType)}' AND M.MDz_Status = 'C' AND C.D2z_Status = 'C' 
                   AND MB.DXf_Dependant_Pcnt = '100' AND MB.DXz_Deleted = '' AND MB.DXc_Bind_Nomination != 'L'`,
            `Unable to find a member with existing beneficiary`);

        await this.logMemberDetails(queryResult,`Retrieved member with existing beneficiary from Database.`);

        return queryResult['MDz_Member'];
    }


    async getMemberBeneficiaryDetails(memberNumber, DXz_Dependant_No, fundType) {

        let queryResult =  runSqlQueryAndReturnResult(`
                 SELECT *,FORMAT(DXd_Date_Of_Birth,'dd/MM/yyyy') as Formatted_DXd_Date_Of_Birth 
                 FROM Mbr_Dependants
                 INNER JOIN Member
                 ON Member.MDz_Acct_No = Mbr_Dependants.DXz_Client
                 WHERE Member.MDz_Member = '${memberNumber}' AND Member.MDz_Fund = '${await getClientFund(client, fundType)}'
                 AND Mbr_Dependants.DXz_Dependant_No = '0${DXz_Dependant_No}'`,
            `Unable to find beneficiary details for member ${memberNumber}`);

        await e2eLogInfo(`Retrieved Beneficiary details for member : ${memberNumber} from Database.`);

        return queryResult;
    }

    async getMemberWithAnActivePensionAccount() {

        let queryResult = await runSqlQueryAndReturnResult(`
                 Select TOP 1 * FROM Client AS C
                 INNER JOIN Member AS M
                 ON C.D2z_Client = M.MDz_Acct_No
                 WHERE M.MDz_Category = '${getClientCategory(client, 'pension')}' AND M.MDz_Status = 'A'`,
            `Unable to find a member with an active pension account`);

        await this.logMemberDetails(queryResult,`Retrieved member with an active Pension Account from Database.`);

        return queryResult['MDz_Member'];
    }

    async getMemberWithAnActivePensionAccountAndNoReversionary() {

        let queryResult = await runSqlQueryAndReturnResult(`
                 Select TOP 1 * FROM Client AS C
                 INNER JOIN Member AS M
                 ON C.D2z_Client = M.MDz_Acct_No
                 WHERE M.MDz_Category = '${getClientCategory(client, 'pension')}' 
                 AND M.MDz_Status = 'A' AND M.MDz_Reversion_Client = ''`,
            `Unable to find a member with an active pension account and No Reversionary`);

        await this.logMemberDetails(queryResult,`Retrieved member with an active Pension Account and no existing Reversionary from Database.`);

        return queryResult['MDz_Member'];
    }

    async getMemberWithAnActivePensionAccountAndAnExistingReversionary() {

        let queryResult = await runSqlQueryAndReturnResult(`
                 Select TOP 1 * FROM Client AS C
                 INNER JOIN Member AS M
                 ON C.D2z_Client = M.MDz_Acct_No
                 WHERE M.MDz_Category = '${getClientCategory(client, 'pension')}' 
                 AND M.MDz_Status = 'A' AND M.MDz_Reversion_Client != ''`,
            `Unable to find a member with an active pension account and an existing reversionary`);

        await this.logMemberDetails(queryResult,`Retrieved member with an active Pension Account and an existing Reversionary from Database.`);

        return queryResult['MDz_Member'];
    }

    async getReversionaryDetailsFromMemberNumber(memberNumber) {

        let queryResult = runSqlQueryAndReturnResult(`
                 SELECT FORMAT(D2d_Birth,'dd/MM/yyyy') as Formatted_D2d_Birth,
                 CONCAT(RTRIM(D2z_Address_Line_2),CHAR(10),RTRIM(D2z_Address_Line_3),CHAR(10),RTRIM(D2z_Suburb),' ',RTRIM(D2z_State),' ',RTRIM(D2z_Post_Code)) As Formatted_Full_Address,* 
                 FROM Client WHERE D2z_Client = 
                 (SELECT MDz_Reversion_Client FROM Member WHERE MDz_Category = '${await getClientCategory(client, 'pension')}' 
                 AND MDz_Status = 'A' AND MDz_Member = '${memberNumber}')`,
             `Unable to retrieve reversionary details for member : ${memberNumber}`);

        await e2eLogInfo(`Retrieved reversionary details for member : ${memberNumber} from Database`);

        return queryResult;
    }

    async getPensionDetailsByMemberNumber(memberNumber) {

        let queryResult = await runSqlQueryAndReturnResult(`
                 SELECT TOP 1 *,FORMAT(MDd_Pension_Start,'dd/MM/yyyy') AS Formatted_MDd_Pension_Start,
                 FORMAT(MDd_Next_Payment,'dd/MM/yyyy') AS Formatted_MDd_Next_Payment,
                 FORMAT(PEf_Net_Pension_Amt,'C')AS Formatted_PEf_Net_Pension_Amt,
                 FORMAT(PEf_Min_Pens_Yr,'C') AS Formatted_PEf_Min_Pens_Yr 
                 FROM Member AS M
                 INNER JOIN Mbr_Pension_History AS P
                 ON M.MDz_Member = P.PEz_Member
                 WHERE P.PEz_Member = '${memberNumber}' AND P.PEz_Fund= '${getClientFund(client, 'pension')}' 
                 ORDER BY PEd_Mod_Date DESC`,
            `Unable to retrieve pension details for ${memberNumber}`);

        await e2eLogInfo(`Retrieved pension details for ${memberNumber} from Database`);

        return queryResult;
    }

}