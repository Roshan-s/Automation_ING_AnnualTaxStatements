Feature: My Investments - Contribution Mix

  Background:
    Given I am on "AdminMemberSearch" page


  Scenario: Member's contribution mix is reflected correctly on AOL
      Given I look up for a member under "65" years of age in super fund
      And   I navigate to "Profile"
      Then  I validate that the Investment Profile is listed correctly on AOL