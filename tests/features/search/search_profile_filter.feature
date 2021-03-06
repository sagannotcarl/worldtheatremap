@search
Feature: Filters on profile search

  As a user
  I want to use search filters
  So I can find profiles

  Background:
    Given I am on the English language home page
    And I am logged in
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with "Fatima"
    And I select "Individual" from the ".profile-type-edit" combobox
    And I select "Organization" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Algeria (census, 2010)"
    And I click on ".ethnicityRace .btn-add"
    And I fill in ".profile-ethnicity-edit" with "Self Identity"
    And I fill in ".profile-locality-edit" with "Algiers"
    And I fill in ".profile-administrative-area-edit" with "Algiers Province"
    And I select "Algeria" from the ".country-select-edit" combobox
    And I fill in ".profile-postal-code-edit" with "16000"
    And I click on ".label-text=Musical Theatre"
    And I click on ".label-text=African Diaspora"
    And I click on ".organization-types-label-text=Producer / Presenter"
    And I click on ".organization-types-label-text=Venue"
    And I click on ".label-text=Director"
    And I click on ".label-text=Administrator, Manager, Producer"
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"

  # Roles
  Scenario: Users can filter profiles by role
    When I select "Director" from the ".profile-roles-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple roles should match a profile that has both roles
    When I select "Director" from the ".profile-roles-edit" combobox
    When I select "Administrator, Manager, Producer" from the ".profile-roles-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple roles should match two different profiles that each have one of the roles
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with " Nor"
    And I select "Individual" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Malaysia"
    And I fill in ".profile-locality-edit" with "Kuala Lumpur"
    And I fill in ".profile-administrative-area-edit" with "Kuala Lumpur"
    And I select "Malaysia" from the ".country-select-edit" combobox
    And I click on ".roles-label-text=Performer"
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"
    When I select "Director" from the ".profile-roles-edit" combobox
    When I select "Performer" from the ".profile-roles-edit" combobox
    And the ".search-results" element should contain "Fatima"
    And the ".search-results" element should contain "Nor"

  # Interests
  Scenario: Users can filter profiles by interest
    When I select "Musical Theatre" from the ".interests-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple interests should match a profile that has both interests
    When I select "Musical Theatre" from the ".interests-edit" combobox
    And I select "African Diaspora" from the ".interests-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple interests should match two different profiles that each have one of the interests
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with " Nor"
    And I select "Individual" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Malaysia"
    And I fill in ".profile-locality-edit" with "Kuala Lumpur"
    And I fill in ".profile-administrative-area-edit" with "Kuala Lumpur"
    And I select "Malaysia" from the ".country-select-edit" combobox
    And I click on ".label-text=Opera"
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"
    When I select "African Diaspora" from the ".interests-edit" combobox
    And I select "Opera" from the ".interests-edit" combobox
    And the ".search-results" element should contain "Fatima"
    And the ".search-results" element should contain "Nor"

  # Organization Type
  Scenario: Users can filter profiles by organization type
    When I select "Producer" from the ".profile-organization-types-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple organzation types should match a profile that has both organzation types
    When I select "Producer" from the ".profile-organization-types-edit" combobox
    And I select "Venue" from the ".profile-organization-types-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple organization types should match two different profiles that each have one of the organization types
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with " Nor"
    And I select "Organization" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Malaysia"
    And I fill in ".profile-locality-edit" with "Kuala Lumpur"
    And I fill in ".profile-administrative-area-edit" with "Kuala Lumpur"
    And I select "Malaysia" from the ".country-select-edit" combobox
    And I click on ".organization-types-label-text=Venue"
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"
    When I select "Producer" from the ".profile-organization-types-edit" combobox
    And I select "Venue" from the ".profile-organization-types-edit" combobox
    And the ".search-results" element should contain "Fatima"
    And the ".search-results" element should contain "Nor"

  # City / Locality
  Scenario: Users can filter profiles by city
    When I select "Algiers" from the ".locality-select-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Users can filter profiles by city after editing a profile to add a new city
    And I go to the profile page for "Fatima"
    And I follow ".edit-link"
    And I fill in ".profile-locality-edit" with "Rabat"
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    When I select "Rabat" from the ".locality-select-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple cities should match two different profiles that each have one of the cities
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with " Nor"
    And I select "Individual" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Malaysia"
    And I fill in ".profile-locality-edit" with "Kuala Lumpur"
    And I fill in ".profile-administrative-area-edit" with "Kuala Lumpur"
    And I select "Malaysia" from the ".country-select-edit" combobox
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"
    When I select "Algiers" from the ".locality-select-edit" combobox
    And I select "Kuala Lumpur" from the ".locality-select-edit" combobox
    And the ".search-results" element should contain "Fatima"
    And the ".search-results" element should contain "Nor"

  # Country
  Scenario: Users can filter profiles by Country
    When I select "Algeria" from the ".country-select-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Users can filter profiles by Country after editing a profile to add a new Country
    And I go to the profile page for "Fatima"
    And I follow ".edit-link"
    And I select "Morocco" from the ".country-select-edit" combobox
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    When I select "Morocco" from the ".country-select-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple countries should match two different profiles that each have one of the countries
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with " Nor"
    And I select "Individual" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Malaysia"
    And I fill in ".profile-administrative-area-edit" with "Kuala Lumpur"
    And I select "Malaysia" from the ".country-select-edit" combobox
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"
    When I select "Algeria" from the ".country-select-edit" combobox
    And I select "Malaysia" from the ".country-select-edit" combobox
    And the ".search-results" element should contain "Fatima"
    And the ".search-results" element should contain "Nor"

  # Province / Administrative area
  Scenario: Users can filter profiles by Province
    When I select "Algiers Province" from the ".administrative-area-select-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Users can filter profiles by Province after editing a profile to add a new Province
    And I go to the profile page for "Fatima"
    And I follow ".edit-link"
    And I fill in ".profile-administrative-area-edit" with "Rabat-Sale-Kenitra"
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    When I select "Rabat-Salé-Kénitra" from the ".administrative-area-select-edit" combobox
    And the ".search-results" element should contain "Fatima"

  Scenario: Choosing multiple countries should match two different profiles that each have one of the countries
    When I go to the "profile" add page
    And I fill in ".profile-name-edit" with " Nor"
    And I select "Individual" from the ".profile-type-edit" combobox
    And I fill in ".profile-about-edit" with "Most popular name in Malaysia"
    And I fill in ".profile-administrative-area-edit" with "Kuala Lumpur"
    And I select "Malaysia" from the ".country-select-edit" combobox
    And I click on ".edit-profile-save"
    And I go to the "profiles" search page
    And I should not see ".search-results"
    When I select "Algiers Province" from the ".administrative-area-select-edit" combobox
    When I select "Kuala Lumpur" from the ".administrative-area-select-edit" combobox
    And the ".search-results" element should contain "Fatima"
    And the ".search-results" element should contain "Nor"

  # Postal Code
  Scenario: Users can filter profiles by postal code
    When I fill in ".profile-postal-code-edit" with "16000"
    And the ".search-results" element should contain "Fatima"

  Scenario: When there are only a few results no pager should be displayed
    When I fill in ".profile-postal-code-edit" with "16000"
    Then I should not see ".search-results-pager"

  # Ethnicity/Race
  Scenario: Users can filter profiles by Ethnicity/Race
    When I select "Self Identity" from the ".ethnicity-select-edit" combobox
    Then the ".search-results" element should contain "Fatima"
