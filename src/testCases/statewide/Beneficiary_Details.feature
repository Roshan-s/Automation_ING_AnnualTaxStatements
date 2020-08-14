Feature: My Beneficiary - Beneficiary details

  Background:
    Given I am on "AdminMemberSearch" page


  Scenario: Member is able to add a Beneficiary
    When  I look for a member under "65" with no active beneficiary in super fund
    And   I navigate to "Beneficiaries"
    And   I click Create
    And   I enter the following details for Beneficiary "1"
      | Field           | Value         |
      | benTitle        | Lord          |
      | benGivenNames   | TestOne       |
      | benSurname      | TestSurname   |
      | benGender       | Male          |
      | benBirthDate    | 05/05/1985    |
      | benRelationship | Child         |
      | benPercentage   | 100           |
      | country         | Australia     |
      | line1           | TestLineOne   |
      | line2           | TestLineTwo   |
      | suburb          | Melbourne CBD |
      | state           | VIC           |
      | postcode        | 3000          |
    And   I click Next
    And   I click Submit
    And   I save as PDF
    Then I verify "BeneficiariesDetails" pdf is saved and contains the below statement
    """
    Your Beneficiary Details have been successfully registered.
    """
    Then I verify Beneficiary "1" details are updated correctly in the database
      | DB Column                   | Value         |
      | DXz_Title                   | Lord          |
      | DXz_Given_Names             | TestOne       |
      | DXz_Surname                 | TestSurname   |
      | DXz_Sex                     | M             |
      | Formatted_DXd_Date_Of_Birth | 05/05/1985    |
      | DXz_Dep_Relationship        | Child         |
      | DXf_Dependant_Pcnt          | 100           |
      | DXz_Country_Code            | AU            |
      | DXz_Address_Line_2          | TestLineOne   |
      | DXz_Address_Line01          | TestLineTwo   |
      | DXz_Address_Line02          | Melbourne CBD |
      | DXz_Address_Line03          | VIC           |
      | DXz_Post_Code               | 3000          |


  Scenario: Member is able to add multiple Beneficiaries
    When I look for a member under "65" with no active beneficiary in super fund
    And  I navigate to "Beneficiaries"
    And  I click Create
    And  I enter the following details for Beneficiary "1"
      | Field           | Value         |
      | benTitle        | Lord          |
      | benGivenNames   | TestOne       |
      | benSurname      | TestSurname   |
      | benGender       | Male          |
      | benBirthDate    | 05/05/1985    |
      | benRelationship | Child         |
      | benPercentage   | 50            |
      | country         | Australia     |
      | line1           | TestLineOne   |
      | line2           | TestLineTwo   |
      | suburb          | Melbourne CBD |
      | state           | VIC           |
      | postcode        | 3000          |
    And I click Add Beneficiary
    And I enter the following details for Beneficiary "2"
      | Field           | Value         |
      | benTitle        | Lord          |
      | benGivenNames   | TestTwo       |
      | benSurname      | TestSurname   |
      | benGender       | Male          |
      | benBirthDate    | 05/05/1985    |
      | benRelationship | Child         |
      | benPercentage   | 50            |
      | country         | Australia     |
      | line1           | TestLineOne   |
      | line2           | TestLineTwo   |
      | suburb          | Melbourne CBD |
      | state           | VIC           |
      | postcode        | 3000          |
    And  I click Next
    And  I click Submit
    And I save as PDF
    Then I verify "BeneficiariesDetails" pdf is saved and contains the below statement
      """
      Your Beneficiary Details have been successfully registered.
      """
    Then I verify Beneficiary "1" details are updated correctly in the database
      | DB Column                   | Value         |
      | DXz_Title                   | Lord          |
      | DXz_Given_Names             | TestOne       |
      | DXz_Surname                 | TestSurname   |
      | DXz_Sex                     | M             |
      | Formatted_DXd_Date_Of_Birth | 05/05/1985    |
      | DXz_Dep_Relationship        | Child         |
      | DXf_Dependant_Pcnt          | 50            |
      | DXz_Country_Code            | AU            |
      | DXz_Address_Line_2          | TestLineOne   |
      | DXz_Address_Line01          | TestLineTwo   |
      | DXz_Address_Line02          | Melbourne CBD |
      | DXz_Address_Line03          | VIC           |
      | DXz_Post_Code               | 3000          |
    Then I verify Beneficiary "2" details are updated correctly in the database
      | DB Column                   | Value         |
      | DXz_Title                   | Lord          |
      | DXz_Given_Names             | TestTwo       |
      | DXz_Surname                 | TestSurname   |
      | DXz_Sex                     | M             |
      | Formatted_DXd_Date_Of_Birth | 05/05/1985    |
      | DXz_Dep_Relationship        | Child         |
      | DXf_Dependant_Pcnt          | 50            |
      | DXz_Country_Code            | AU            |
      | DXz_Address_Line_2          | TestLineOne   |
      | DXz_Address_Line01          | TestLineTwo   |
      | DXz_Address_Line02          | Melbourne CBD |
      | DXz_Address_Line03          | VIC           |
      | DXz_Post_Code               | 3000          |


  Scenario: Member is able to update an existing Beneficiary
    When I look for a member under "65" with an active beneficiary in super fund
    And  I navigate to "Beneficiaries"
    And  I click Update Beneficiary
    And  I enter the following details for Beneficiary "1"
      | Field           | Value         |
      | benTitle        | Mr            |
      | benGivenNames   | TestUpdate    |
      | benSurname      | TestSurname   |
      | benGender       | Male          |
      | benBirthDate    | 05/01/1987    |
      | benRelationship | Child         |
      | benPercentage   | 100           |
      | country         | Australia     |
      | line1           | TestLineOne   |
      | line2           | TestLineTwo   |
      | suburb          | Melbourne CBD |
      | state           | VIC           |
      | postcode        | 3000          |
    And  I click Next
    And  I click Submit
    And I save as PDF
    Then I verify "BeneficiariesDetails" pdf is saved and contains the below statement
    """
    Your Beneficiary Details have been successfully registered.
    """
    Then I verify Beneficiary "1" details are updated correctly in the database
      | DB Column                   | Value         |
      | DXz_Title                   | Mr            |
      | DXz_Given_Names             | TestUpdate    |
      | DXz_Surname                 | TestSurname   |
      | DXz_Sex                     | M             |
      | Formatted_DXd_Date_Of_Birth | 05/01/1987    |
      | DXz_Dep_Relationship        | Child         |
      | DXf_Dependant_Pcnt          | 100           |
      | DXz_Country_Code            | AU            |
      | DXz_Address_Line_2          | TestLineOne   |
      | DXz_Address_Line01          | TestLineTwo   |
      | DXz_Address_Line02          | Melbourne CBD |
      | DXz_Address_Line03          | VIC           |
      | DXz_Post_Code               | 3000          |


  Scenario: Member's beneficiary detail reflect correctly on AOL website
    When I look for a member under "65" with an active beneficiary in super fund
    And  I navigate to "Beneficiaries"
    Then I verify Beneficiary details on the AOL page are correct


  Scenario: Member is able to delete an existing beneficiary
    When I look for a member under "65" with an active beneficiary in super fund
    And  I navigate to "Beneficiaries"
    And  I click Update Beneficiary
    And  I delete Beneficiary "1"
    Then I verify Beneficiary "1" details are updated correctly in the database
      | DB Column   | Value |
      | DXz_Deleted | Y     |


  Scenario: Member is able to download the Binding Nomination Form
    When I look up for a member under "65" years of age in super fund
    And  I navigate to "Beneficiaries"
    And  I click Binding Nomination Form
    And  I click Download
    Then I verify "BindingNominationForm" PDF is saved and contains below listed DB column values
      | DB Column        |
      | D2z_Inst_Cust_No |
      | MDz_Member       |
      | D2z_Given_Names  |
      | D2z_Surname      |
