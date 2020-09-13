sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"Trial_Formulation/trial_formulation/test/integration/pages/Common",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Press, PropertyStrictEquals) {
	"use strict";

	Opa5.createPageObjects({
		onTheObjectPage: {
			actions: {
				iChangeFromDate: function () {
					return this.waitFor({
						id: "Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_FROM::Field-datePicker",
						actions: function (oControl) {
							oControl.setValue("Mar 4, 2020").fireChange();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},
				iChangeToDate: function (date) {
					return this.waitFor({
						id: "Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_TO::Field-datePicker",
						actions: function (oControl) {
							oControl.setValue(date).fireChange();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},
				iEnterDescription: function (text) {
					return this.waitFor({
						id: "Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::descriptionField::recipeDESCRIPTION::Field",
						actions: function (oControl) {
							oControl.setValue(text).fireChange();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},

				iChangePODesc: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oControl) {
							oControl.getRows()[0].getCells()[2].setValue("New Description").fireChange();
						},
						errorMessage: "The button could not be found"
					});
				},
				iSelectaRow: function (i) {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oControl) {
							oControl.setSelectedIndex(i);
						},
						errorMessage: "The button could not be found"
					});
				},
				iSelectSpec: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oControl) {
							oControl.getRows()[1].getCells()[1].fireValueHelpRequest();
						},
						errorMessage: "The button could not be found"
					});
				},
				iSearchSpec: function () {
					return this.waitFor({
						controlType: "sap.m.SearchField",
						actions: function (oControl) {
							oControl.setValue("specificationID 9");
						},
						errorMessage: "The search could not be executed"
					});
				},
				iSelectFromVD: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oControl) {
							oControl.setSelectedIndex(0).fireRowSelectionChange();
							oControl.getParent().getParent().getParent().fireOk({tokens: oControl.getParent().getParent().getParent()._oSelectedTokens.getTokens()});
						},
						errorMessage: "The search could not be executed"
					});
				},
				iSelectUOM: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oControl) {
							oControl.getRows()[1].getCells()[4].fireValueHelpRequest();
						},
						errorMessage: "The button could not be found"
					});
				},
				iClickonMessageManage: function () {
					return this.waitFor({
						id: "Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--showMessages",
						actions: function (oControl) {
							oControl.firePress();
						},
						errorMessage: "The button could not be found"
					});
				},
				iChangeSpec: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oTable) {
							oTable.getRows()[1].getCells()[1].fireChange({value: ""});
							oTable.getRows()[1].getCells()[1].fireChange({value: "CARMINE"});
							oTable.getRows()[1].getCells()[1].fireChange({value: "specificationID 1"});
						},
						errorMessage: "The button could not be found"
					});
				},
				iChangeUOM: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oTable) {
							oTable.getRows()[1].getCells()[4].fireChange({value: ""});
							oTable.getRows()[1].getCells()[4].fireChange({value: "fg"});
							oTable.getRows()[1].getCells()[4].fireChange({value: "KG"});
						},
						errorMessage: "The button could not be found"
					});
				},
				iChangeQuantity: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oTable) {
							oTable.getRows()[1].getCells()[3].fireChange({value: ""});
							oTable.getRows()[1].getCells()[3].fireChange({value: "1234567890123.1234567"});
							oTable.getRows()[1].getCells()[3].fireChange({value: "-9"});
						},
						errorMessage: "The button could not be found"
					});
				},
				iChangeCompType: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						actions: function (oTable) {
							oTable.getRows()[3].getCells()[5].fireChange({selectedItem: oTable.getRows()[3].getCells()[5].getSelectableItems()[1]});
						},
						errorMessage: "The button could not be found"
					});
				}
			},
			assertions: {
				iSeeValueStateOfDescription: function () {
					return this.waitFor({
						id: "Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::descriptionField::recipeDESCRIPTION::Field",
						matchers: new PropertyStrictEquals({
							name: "valueState",
							value: "Error"
						}),
						success: function () {
							ok(true, "Description of new recipe is empty");
						},
						errorMessage: "Description validations are incorrect"
					});
				},
				iSeeValueStateOfDate: function () {
					return this.waitFor({
						id: "Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_TO::Field-datePicker",
						matchers: new PropertyStrictEquals({
							name: "valueState",
							value: "Error"
						}),
						success: function () {
							ok(true, "Date is incorrect");
						},
						errorMessage: "Date validations are incorrect."
					});
				}
			}
		}
	});
});
