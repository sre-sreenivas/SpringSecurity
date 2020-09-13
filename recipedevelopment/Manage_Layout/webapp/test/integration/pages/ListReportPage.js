sap.ui.define([
	"sap/ui/test/Opa5",
	"manage/manage_layout/test/integration/pages/Common",
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

				iClickListLineItem: function (i) {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ListReport.view.ListReport::LayoutInformation--responsiveTable",
						matchers: new AggregationFilled({
							name: "items"
						}),
						actions: function (oTable) {
							var oItem = oTable.getItems()[i];
							oTable.fireItemPress({
								listItem: oItem
							});
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},

				iClickDelete: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ListReport.view.ListReport::LayoutInformation--deleteEntry",
						actions: function (oControl) {
							oControl.firePress();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				}

			},

			assertions: {

			}
		}
	});
});