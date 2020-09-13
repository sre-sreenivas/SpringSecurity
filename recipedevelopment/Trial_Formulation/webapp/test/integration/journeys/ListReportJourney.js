sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/matchers/I18NText",
	"sap/ui/model/resource/ResourceModel"
], function (opaTest, I18NText, ResourceModel) {
	"use strict";

	opaTest("#1 Testing Delete text in List report", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");

		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0], true, 0);

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
	});

	opaTest("#2 Testing Navigation from List report to Object Page", function (Given, When, Then) {
		// Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");

		When.onTheGenericListReport
			.iNavigateFromListItemByFieldValue({
				Field: "recipeTYPE",
				Value: "recipeTYPE 2"
			});

		Then.onTheGenericObjectPage
			.theObjectPageIsInEditMode();
	});

	opaTest("#3 Testing Recipe creation Validations", function (Given, When, Then) {
		When.onTheObjectPage
			.iChangeFromDate()
			.iChangeToDate("Mar 2, 2020");

		Then.onTheObjectPage
			.iSeeValueStateOfDate();

		When.onTheObjectPage
			.iChangeToDate("Mar 5, 2020");

		Then.onTheObjectPage
			.iSeeValueStateOfDate();

		When.onTheObjectPage
			.iEnterDescription(
			"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
			.iEnterDescription("")
			.iClickonMessageManage();
		When.onTheGenericObjectPage
			.iClickTheButtonWithIcon("sap-icon://decline");

		Then.onTheObjectPage
			.iSeeValueStateOfDescription();

		When.onTheObjectPage
			.iEnterDescription("New Recipe");

		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Save");

		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("Formula");

		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Save");

		When.onTheObjectPage
			.iChangePODesc()
			.iSelectaRow(0)
			.iSelectaRow(-1)
			.iSelectaRow(1);
		When.onTheGenericObjectPage
			.iClickTheButtonWithIcon("sap-icon://slim-arrow-down");
		When.onTheObjectPage
			.iSelectaRow(2);
		When.onTheGenericObjectPage
			.iClickTheButtonWithIcon("sap-icon://slim-arrow-up");
		When.onTheObjectPage
			.iSelectaRow(3)
			.iSelectaRow(-1)
			.iSelectaRow(1);
		When.onTheGenericListReport
			.iClickTheButtonHavingLabel("Delete");
		When.onTheObjectPage
			.iSelectaRow(2);

		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Save");

		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("Insert");

		When.onTheObjectPage
			.iSelectSpec()
			.iSearchSpec();
		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("Go");
		When.onTheObjectPage
			.iSelectFromVD();
		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("Cancel");
		When.onTheObjectPage		
			.iChangeSpec()
			.iChangeUOM()
			.iChangeQuantity()
			.iChangeCompType()
			.iSelectUOM()
			.iSelectFromVD()
			.iSelectUOM();
		When.onTheGenericObjectPage
			.iClickTheButtonHavingLabel("Cancel")
			.iChoosetheItemInComboBox("kjh");

		Then.onTheObjectPage
			.iTeardownMyApp();
	});

	opaTest("#4 Testing exisiting recipe", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html?serverDelay=1000&responderOn=true&sap-ui-language=en_US");

		When.onTheGenericListReport
			.iNavigateFromListItemByFieldValue({
				Field: "recipeTYPE",
				Value: "Development Recipe"
			});

		Then.onTheGenericObjectPage
			.theButtonWithLabelIsEnabled("Edit");

		When.onTheGenericObjectPage
			.iChoosetheItemInComboBox("kjh")
			.iChoosetheItemInComboBox("Default")
			.iClickTheButtonWithIcon("sap-icon://message-information")
			.iClickTheButtonWithIcon("sap-icon://message-information");

		Then.onTheObjectPage
			.iTeardownMyApp();
	});
});
