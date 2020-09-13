sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/model/resource/ResourceModel"
], function (opaTest, ResourceModel) {
	"use strict";

	QUnit.module("Component Journey");

	opaTest("#1 Testing functionalities in Display mode", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");
		
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([1], true, 0);

		Then.onTheGenericListReport
			.theButtonWithLabelIsEnabled("Delete");

		When.onTheGenericListReport
			.iClickTheButtonHavingLabel("Delete");

		Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Delete");

		When.onTheGenericListReport
			.iClickTheButtonOnTheDialog("Cancel");

		Then.onTheGenericListReport
			.theResultListContainsTheCorrectNumberOfItems(10);
			
		When.onTheGenericListReport
			.iNavigateFromListItemByFieldValue({
				Field: "layoutType",
				Value: "layoutType 21"
			});

		
		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Edit");

		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("Delete");

		Then.onTheGenericObjectPage
			.iShouldSeeTheDialogWithTitle("Delete");

		When.onTheGenericObjectPage
			.iClickTheButtonOnTheDialog("Cancel");
		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Edit");

		When.onTheObjectPage
			.iSelectColumn(1);
		When.onTheGenericObjectPage
			.iClickTheButtonWithIcon("sap-icon://expand-group")
			.iClickTheButtonWithIcon("sap-icon://collapse-group")
			.iClickTheButtonWithIcon("sap-icon://navigation-up-arrow")
			.iClickTheButtonWithIcon("sap-icon://navigation-down-arrow")
			.iClickTheButtonWithIcon("sap-icon://message-information")
			.iClickTheButtonWithIcon("sap-icon://message-information");

		Then.onTheObjectPage
			.iTeardownMyApp();
	});
	
	opaTest("#2 Testing functionalities in Edit mode", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");
		
		When.onTheGenericListReport
			.iNavigateFromListItemByFieldValue({
				Field: "layoutType",
				Value: "layoutType 22"
			});

		Then.onTheGenericObjectPage
			.theObjectPageIsInEditMode();

		When.onTheObjectPage
			.iDeleteLayoutName()
			.iChangeUOM()
			.iClickonMessageManage();

		When.onTheGenericObjectPage
			.iClickTheButtonWithIcon("sap-icon://decline");

		When.onTheObjectPage
			.iChangelayoutName();

		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Save");
		
		When.onTheGenericObjectPage
			.iClickTheButtonWithIcon("sap-icon://add");
		When.onTheObjectPage
			.iClickFilterItem()
			.iClickfilter();
		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("OK");
		
		Then.onTheObjectPage
			.iTeardownMyApp();
		
	});
	
	opaTest("#3 Testing delete row", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");
		When.onTheListReportPage.
		iClickListLineItem(0);
		
		Then.onTheObjectPage.
		iCheckVisibilityofSave("true");
		
		When.onTheObjectPage
		.iSelectColumn(2)
		.iClickColumnDelete();
		
		Then.onTheObjectPage.
		iTeardownMyApp("true");
		
	});
});