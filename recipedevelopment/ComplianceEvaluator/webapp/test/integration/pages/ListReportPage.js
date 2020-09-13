sap.ui.define([
	"sap/ui/test/Opa5",
	"ComplianceEvaluator/test/integration/pages/Common",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationFilled"
], function (Opa5, Common, Properties, Press, ResourceModel, EnterText, AggregationFilled) {
	"use strict";

	var sViewName = "ListReport";
	var sViewNamespace = "sap.suite.ui.generic.template.ListReport.view.";

	Opa5.createPageObjects({
		onTheListReportPage: {
			baseClass: Common,
			actions: {

				iLookAtTheLoadedApp: function () {
					return this;
				},

				iFilterListReportWithComplianceFrom: function (from) {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--listReportFilter-filterItemControl_BASIC-validFrom",
						actions: function (oControl) {
							oControl.setValue(from);
						},
						errorMessage: "The search could not be executed"
					});
				},
				iFilterListReportWithComplianceTo: function (to) {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--listReportFilter-filterItemControl_BASIC-validTo",
						actions: function (oControl) {
							oControl.setValue(to);
						},
						errorMessage: "The search could not be executed"
					});
				},
				iFilterListReportWithName: function () {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--listReportFilter-filterItemControl_BASIC-evaluationName",
						actions: function (oControl) {
							oControl.setValue("evaluationName 5");
						},
						errorMessage: "The search could not be executed"
					});
				},
				iFilterListReportWithSellingMarket: function(country) {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--listReportFilter-filterItemControl_BASIC-sellingMarket",
						actions: function (oControl) {
							oControl.setValue(country);
							oControl.fireTokenUpdate();
						},
						errorMessage: "Cannot find Field"
					});
				},   
				iRemoveSellingMarketFilter: function() {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--listReportFilter-filterItemControl_BASIC-sellingMarket",
						actions: function (oControl) {
							// oControl.getContent().getAggregation("tokenizer").removeToken(0);
							oControl.setValue("");
							oControl.fireTokenUpdate();
						},
						errorMessage: "Cannot find Field"
					});
				},
				iClickTheButtonWithId: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new Properties({
							id: new RegExp("btnGo")
						}),
						actions: new Press(),
						errorMessage: "The search could not be executed"
					});
				},
				iClickListLineItem: function () {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--responsiveTable",
						matchers: new AggregationFilled({
							name: "items"
						}),
						actions: function (oTable) {
							var oItem = oTable.getItems()[0];
							oTable.fireItemPress({
								listItem: oItem
							});
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},
				iSelectListLineItem: function () {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--responsiveTable",
						matchers: new AggregationFilled({
							name: "items"
						}),
						actions: function (oTable) {
							oTable.getItems()[0].setSelected(true);
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},
				iClickDelete: function () {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--deleteEntry",
						actions: function (oControl) {
							oControl.firePress();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				}
			},

			assertions: {
				theTableIsVisible: function (iItems) {
					var aMatchers = [
						new AggregationFilled({
							name: "items"
						})
					];
					var fnSuccess = function (oControl) {
						var actualItems = oControl.getItems();
						equal(actualItems.length, iItems, "All the " + iItems + " items are present in the table");
					};
					return this.iWaitForResponsiveTableInListReport(aMatchers, fnSuccess);
				},
				iWaitForResponsiveTableInListReport: function (aMatchers, fnSuccess) {
					return this.waitFor({
						id: "ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--responsiveTable",
						matchers: aMatchers,
						success: fnSuccess,
						errorMessage: "The Responsive Table is not rendered correctly"
					});
				},
				iLookAtTheScreen: function () {
					return this;
				},
				iShouldSeeThePageTitle: function () {
					return this.waitFor({
						controlType: "sap.m.Text",
						viewNamespace: sViewNamespace,
						viewName: sViewName,
						timeout: 600,
						success: function () {
							QUnit.ok(true, "The ListReport page has loaded with a title.");
						},
						errorMessage: "Can't see the ListReport page title."
					});
				},
				theDialogShouldContainText: function (txt) {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function (oControl) {
							var expectedText = "Do you want to delete the object evaluationName 2 ?";
							equal(expectedText, txt, "Text is displayed correctly");
							QUnit.ok(true, "The ListReport page has loaded with a title.");
						},
						errorMessage: "Can't see the ListReport page title."
					});
				}
			}
		}
	});
});