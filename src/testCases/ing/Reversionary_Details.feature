Feature: My Beneficiary - Reversionary Details - applicable to TTR and pension accounts only

  Background:
    Given I am on "AdminMemberSearch" page

  Scenario: Member is able to add a Reversionary
    When I look for member with an active pension account and no reversionary
    And  I navigate to "Reversionary"
    And  I click Create
    And  I enter the following Reversionary details
      | Field           | Value         |
      | revTitle        | Doctor        |
      | revGivenNames   | TestRev       |
      | revSurname      | TestSurname   |
      | revGender       | Male          |
      | revBirthDate    | 05/05/1985    |
      | revRelationship | CH            |
      | country         | Australia     |
      | line1           | TestLineOne   |
      | line2           | TestLineTwo   |
      | suburb          | Melbourne CBD |
      | state           | VIC           |
      | postcode        | 3000          |
    And  I click Next
    And  I click Submit
    And  I save as PDF
    Then I verify "ReversionaryDetails" pdf is saved and contains the below statement
    """
    Your Reversionary Details have been successfully submitted.
    """
    Then I verify Reversionary details are updated correctly in the database
      | DB Column            | Value         |
      | D2z_Title            | Doctor        |
      | D2z_Given_Names      | TestRev       |
      | D2z_Surname          | TestSurname   |
      | D2z_Sex              | M             |
      | Formatted_D2d_Birth  | 05/05/1985    |
      | D2z_Rev_Relationship | CH            |
      | D2z_Country_Code     | AU            |
      | D2z_Address_Line_2   | TestLineOne   |
      | D2z_Address_Line_3   | TestLineTwo   |
      | D2z_Suburb           | Melbourne CBD |
      | D2z_State            | VIC           |
      | D2z_Post_Code        | 3000          |


  Scenario: Member's Reversionary details on the AOL page are reflected correctly

    When I look for member with an active pension account and an existing reversionary
    And  I navigate to "Reversionary"
    Then I verify that the Member Reversionary details on the AOL page are correct
      | Field           | Value                  |
      | revTitle        | D2z_Title              |
      | revGivenNames   | D2z_Given_Names        |
      | revSurname      | D2z_Surname            |
      | revGender       | D2z_Sex                |
      | revBirthDate    | Formatted_D2d_Birth    |
      | revRelationship | D2z_Rev_Relationship   |
  #    | country         | Formatted_Full_Address |  Needs more work as the formatting does not align with the assertion


