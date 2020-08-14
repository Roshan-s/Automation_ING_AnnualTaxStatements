
Feature: Contribute to Your Super - ING

  Background:
    Given I am on "AdminMemberSearch" page


  Scenario:  Member over 75 years of age should not eligible to contribute

    When  I look up for a member over "75" years of age in super fund
    And   I navigate to "MoneyIn"
    Then  I see the following ineligibility message
          """
          You are not eligible to contribute to your superannuation.
          As you are more than 75 years of age you do not meet the criteria currently required under superannuation legislation to be eligible to contribute to your superannuation account.
          """

  Scenario:  Member between 65 - 75 years with 'Work Test' pending, are not eligible to contribute if they do not pass the 'Work Test'

    When  I look up for a member between "65" and "75" years of age with work-test pending in super fund
    And   I navigate to "MoneyIn"
    And   I select I do not pass the work test
    Then  I see the following work test ineligible message
          """
          You are not eligible to contribute to your superannuation.
          """

  Scenario:  Member between 65 - 75 years with 'Work Test' pending, are eligible to contribute if they do pass the 'Work Test'

    When  I look up for a member between "65" and "75" years of age with work-test pending in super fund
    And   I navigate to "MoneyIn"
    And   I select I pass the work test
    And   I click Submit
    Then  I verify Member last working date is updated to current date in Database
    *     I see the following work test pass message
            """
            Top up your accounts using any of the payment options below.
            """


  Scenario: Member under 65 years of age and no Direct Debit on file, is able to set up Direct Debit

    When  I look for a member under "65" with no existing direct debit in super fund
    And   I navigate to "MoneyIn"
    And   I click Register Direct Debit
    And   I enter the following Direct Debit details
      | Field          | Value       |
      | bsbNumber      | 033-152     |
      | accountNumber  | 456789      |
      | accountName    | AOLAUTOTEST |
      | personalAmount | 10          |
      | spouseAmount   | 20          |
    And  I check Direct Debit Terms and Conditions checkbox
    And  I click Submit
    And  I save as PDF
    Then I verify "EmployerPersonalContributions" PDF is saved and contains the below listed text
      | Value       |
      | 033-152     |
      | 456789      |
      | AOLAUTOTEST |
      | 10          |
      | 20          |
    Then I verify Direct Debit details are updated correctly in Database
      | DB Column               | Value        |
      | SBz_BSB_No              | 033-152      |
      | SBz_User_Def_Strg02     | 456789       |
      | SBz_User_Def_Strg01     | AOLAUTOTEST  |
      | SBf_User_Def_Amt_1      | 10           |
      | SBf_User_Def_Amt_2      | 20           |
      | Formatted_SBd_Effective | Current Date |


  Scenario: Member with existing Direct Debit on file, is able to update their Direct Debit details

    When I look for a member with existing direct debit in super fund
    And  I navigate to "MoneyIn"
    And  I click Update Direct Debit
    And  I enter the following Direct Debit details
      | Field          | Value         |
      | bsbNumber      | 033-152       |
      | accountNumber  | 476888        |
      | accountName    | AOLTESTUPDATE |
      | personalAmount | 30            |
      | spouseAmount   | 40            |
    And  I check Direct Debit Terms and Conditions checkbox
    And  I click Submit
    And  I save as PDF
    Then I verify "EmployerPersonalContributions" PDF is saved and contains the below listed text
      | Value         |
      | 033-152       |
      | 476888        |
      | AOLTESTUPDATE |
      | 30            |
      | 40            |
    Then I verify Direct Debit details are updated correctly in Database
      | DB Column               | Value         |
      | SBz_BSB_No              | 033-152       |
      | SBz_User_Def_Strg02     | 476888        |
      | SBz_User_Def_Strg01     | AOLTESTUPDATE |
      | SBf_User_Def_Amt_1      | 30            |
      | SBf_User_Def_Amt_2      | 40            |
      | Formatted_SBd_Effective | Current Date  |


  Scenario: Member is able to Print Super Choice Form

    When I look up for a member under "65" years of age in super fund
    And  I navigate to "MoneyIn"
    And  I click Print Employer Contribution Form
    And  I click Download
    Then I verify "SuperChoiceForm" PDF is saved and contains below listed DB column values
      | DB Column       |
      | D2z_Given_Names |
      | D2z_Surname     |
      | MDz_Member      |


  Scenario: Member is able to download Personal And Spouse Contributions By Cheque Form

    When I look up for a member under "65" years of age in super fund
    And  I navigate to "MoneyIn"
    And  I click Print Check Form
    And  I click Download
    Then I verify "PersonalAndSpouseContributionsByChequeForm" PDF is saved and contains below listed DB column values
      | DB Column       |
      | D2z_Given_Names |
      | D2z_Surname     |
      | MDz_Member      |


  Scenario: For a Member with existing Direct Debit on file, Direct Debit details are reflected correctly

    When I look for a member with existing direct debit in super fund
    And  I navigate to "MoneyIn"
    Then I verify Member Direct Debit details on the AOL page are correct
      | AOL field      | Corresponding DB Column      |
      | Bsb            | SBz_BSB_No                   |
      | AccountNumber  | SBz_User_Def_Strg02          |
      | AccountName    | SBz_User_Def_Strg01          |
      | personalAmount | Formatted_SBf_User_Def_Amt_1 |
      | SpouseAmount   | Formatted_SBf_User_Def_Amt_2 |
    # |PaymentFrequency| Pending |
      | DeductionDate  | Formatted_SBd_Anniversary    |




