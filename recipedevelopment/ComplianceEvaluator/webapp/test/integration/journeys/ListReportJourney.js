sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/model/resource/ResourceModel"
], function (opaTest, ResourceModel) {
	"use strict";

	QUnit.module("Component Journey");
	
	opaTest("#1 Testing Custom Filter", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");
		
		When.onTheListReportPage.
		iFilterListReportWithSellingMarket("countryName 1").
		iFilterListReportWithComplianceFrom("Jan 21, 2010"). 
		iFilterListReportWithComplianceTo("Oct 29, 2017");
		
		Then.onTheListReportPage.
		iShouldSeeThePageTitle();
		
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(0);
		
		When.onTheListReportPage.
		iRemoveSellingMarketFilter("");
		
		Then.onTheListReportPage.
		iShouldSeeThePageTitle();
		
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(3);
		
		When.onTheListReportPage.
		iFilterListReportWithComplianceFrom("").
		iFilterListReportWithComplianceTo("Oct 29, 2017");
		
		Then.onTheListReportPage.
		iShouldSeeThePageTitle();
		
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(7);
		
		When.onTheListReportPage.
		iFilterListReportWithSellingMarket("countryName 1").
		iFilterListReportWithComplianceTo("");
		
		Then.onTheListReportPage.
		iShouldSeeThePageTitle();
		
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(0);
		
		When.onTheListReportPage.
		iFilterListReportWithSellingMarket("").
		iFilterListReportWithComplianceFrom("Jan 21, 2010");
		
		Then.onTheListReportPage.
		iShouldSeeThePageTitle();
		
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(6);
	});
	opaTest("#2 Navigate to Object Page", function(Given, When, Then) {
		When.onTheListReportPage.
		iClickListLineItem();
		
		Then.onTheObjectPage.
		thePageShouldContainTheCorrectTitle("evaluationName 2");
	});
	opaTest("#3 Testing Validations for header fields", function(Given, When, Then) {
		When.onTheObjectPage.
		iGiveEmptyEvaluationName().                         
		iClickonSellingMarket1().
		iClickonSellingMarket2();
		
		Then.onTheObjectPage.
		iCheckSellingMarket();
		
		When.onTheObjectPage.
		iClickonEvaluationFacet();
		
		Then.onTheObjectPage.
		iSeeRecipeHeader();
		
		When.onTheObjectPage.
		iClickAddRecipe().
		iClickValueHelpButton("Cancel").
		iClickAddRecipe().
		iSearchRecipe("a86000d7-3f7d-41d2-a2e9-256d66ac8930").
		iClickTheButtonWithId().
		iSelectaRecipe().                         
		// iClickValueHelpButton("Cancel");
		iClickButton("OK");
		
		Then.onTheObjectPage.
		iSeeRecipeHeader();
		
		When.onTheObjectPage.
		iClickPurposeRecipe().
		iClickValueHelpButton("Cancel").
		iClickPurposeRecipe().
		iSearchRecipe("3066e7fb-faa3-45ce-a12a-0a94a736ebb4").
		iClickTheButtonWithId().
		// iClickValueHelpButton("Cancel");
		iClickButton("OK");
		
		Then.onTheObjectPage.
		iTeardownMyApp();
	});
	
	opaTest("#4 Testing Custom Filter", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");
		
		When.onTheListReportPage.
		iFilterListReportWithName();
		
		Then.onTheListReportPage.
		iShouldSeeThePageTitle();
		
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(1);
		
		When.onTheListReportPage.
		iClickListLineItem();
		
		Then.onTheObjectPage.
		thePageShouldContainTheCorrectTitle("evaluationName 5");
	});
	opaTest("#5 Testing Set In Progress Button", function(Given, When, Then) {
		When.onTheObjectPage.
		iClickSetInProgressBtn();
		
		Then.onTheObjectPage.
		iSeePopUp();
		
		When.onTheObjectPage.
		iClickOK();
		
		Then.onTheObjectPage.
		iSeeStatusChanged();
		
		When.onTheObjectPage.
		iClickDelete();
		
		Then.onTheObjectPage.
		theDialogShouldContainText("Do you want to delete the object evaluationName 5 ?").
		iTeardownMyApp();
	});
	
	opaTest("#6 Testing Delete Button in List Report", function(Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");
		When.onTheListReportPage.
		iClickTheButtonWithId();
		
		Then.onTheListReportPage.
		theTableIsVisible(10);
		
		When.onTheListReportPage.
		iSelectListLineItem().
		iClickTheButtonWithId().
		iClickDelete();
		
		Then.onTheListReportPage.
		theDialogShouldContainText("Do you want to delete the object evaluationName 2 ?").
		iTeardownMyApp();
	});
});
