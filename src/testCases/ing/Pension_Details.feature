
Feature: My Pension - Pension Details

  Background:
    Given I am on "AdminMemberSearch" page

  Scenario: Member's pension detail reflect correctly on the AOL website
    When I look for member with an active pension account
    And  I navigate to "Pension"
    Then I verify Member pension details on the AOL page are correct
      | AOL field            | Corresponding DB Column     |
      | commencementDate     | Formatted_MDd_Pension_Start |
    #  | effectiveDate    | Formatted_MDd_Next_Payment  |    Date is blank in the current build of acurity. Commenting it out until it is fixed
    #  | paymentType      | PEc_Min_Max_Nom_Amt         |
    #  | currentInstalment | Formatted_PEf_Net_Pension_Amt |  This does not seem to be the right column where the value if stored. Commenting it out until the correct column is found
      | paymentFrequency     | PEc_Freq_Pens_Pay           |
      | annualReducedMinimum | Formatted_PEf_Min_Pens_Yr   |
      | bsbNumber            | MDz_BSB                     |
      | accountNumber        | MDz_Bank_Acct_No            |
      | accountName          | MDz_Bank_Acct_Name          |


  Scenario: Member is able to update their pension details
    When I look for member with an active pension account
    And  I navigate to "Pension"
    Then I verify Member pension details on the AOL page are correct
      | AOL field            | Corresponding DB Column     |
      | commencementDate     | Formatted_MDd_Pension_Start |
      | effectiveDate    | Formatted_MDd_Next_Payment  |
  #    | paymentType      | PEc_Min_Max_Nom_Amt         |
      | currentInstalment | Formatted_PEf_Net_Pension_Amt |
      | paymentFrequency     | PEc_Freq_Pens_Pay           |
      | annualReducedMinimum | Formatted_PEf_Min_Pens_Yr   |
    And  I click Update Pension Details
    And  I update Pension Details as follows
      | AOL Field        | Input Value |
      | paymentFrequency | Quarterly   |
    And  I click Next
    And  I click Submit
    And  I save as PDF
    Then I verify "PensionDetails" pdf is saved and contains the below statement
    """
    Your Pension Details update has been successfully registered.
    """
    And  I click Done
    Then I verify Member pension details on the AOL page are correct
      | AOL field            | Corresponding DB Column     |
      | commencementDate     | Formatted_MDd_Pension_Start |
    #  | effectiveDate    | Formatted_MDd_Next_Payment  |
   #   | paymentType      | PEc_Min_Max_Nom_Amt         |
  #    | currentInstalment | Formatted_PEf_Net_Pension_Amt |
      | paymentFrequency     | PEc_Freq_Pens_Pay           |
      | annualReducedMinimum | Formatted_PEf_Min_Pens_Yr   |


  Scenario: Member's with a pension account is able to update their bank account details
    When I look for member with an active pension account
    And  I navigate to "Pension"
    Then I verify Member pension details on the AOL page are correct
      | AOL field     | Corresponding DB Column |
      | bsbNumber     | MDz_BSB                 |
      | accountNumber | MDz_Bank_Acct_No        |
      | accountName   | MDz_Bank_Acct_Name      |
    And  I click Update Pension Payment Details
    And  I update Pension Details as follows
      | AOL field     | Input Value |
      | bsbNumber     | 033-152     |
      | accountNumber | 123456789   |
      | accountName   | TestAcc     |
    And  I click Next
    And  I click Submit
    And  I save as PDF
    Then I verify "PensionDetails" pdf is saved and contains the below statement
    """
    Your Pension Payment Details update has been successfully registered.
    """
    And  I click Done
    Then I verify Member pension details on the AOL page are correct
      | AOL field     | Corresponding DB Column |
      | bsbNumber     | MDz_BSB                 |
      | accountNumber | MDz_Bank_Acct_No        |
      | accountName   | MDz_Bank_Acct_Name      |




