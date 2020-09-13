sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/AggregationFilled"
], function (Opa5, Press, PropertyStrictEquals, AggregationFilled) {
	"use strict";

	Opa5.createPageObjects({
		onTheObjectPage: {
			actions: {
				iChangelayoutName: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::Field",
						actions: function (oControl) {
							oControl.setValue("Testing save");
							oControl.fireChange();
						},
						errorMessage: "unable to change the name"
					});
				},

				iDeleteLayoutName: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::Field",
						actions: function (oControl) {
							oControl.setValue("");
							oControl.fireChange();
						},
						errorMessage: "unable to change the name"
					});
				},
				iClickSetToDefaultBtn: function (value) {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--com.sap.vocabularies.UI.v1.FieldGroup::DefaultStatus::defaultFlag::Field-cBoxBool",
						actions: function (oControl) {
							oControl.setSelected(value);
							oControl.getParent().fireChange();
						},
						errorMessage: "The button could not be found"
					});
				},

				iClickColumnDelete: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--idRemoveColumn",
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Button not found"
					});
				},

				iClickAdd: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--idAddColumn",
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},
				iClickFilterItem: function () {
					return this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "title",
							value: "Basic"
						}),
						actions: function (items) {
							items.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},
				iClickfilter: function () {

					return this.waitFor({
						controlType: "sap.m.List",
						id: new RegExp("__list"),
						success: function (oStandlistItem) {
							oStandlistItem[0].getItems()[0].getCustomData()[0].getValue().setSelected(true);
							Opa5.assert.ok(true, "Pressed button");
						},
						errorMessage: "Did not find Go button."
					});
				},
				iClickOkay: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},

				iSelectColumn: function (i) {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable",
						matchers: new AggregationFilled({
							name: "items"
						}),
						actions: function (oTable) {
							oTable.getItems()[i].setSelected(true);
							oTable.fireSelectionChange();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},
				
				iSelectTableColumn: function (i) {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable",
						matchers: new AggregationFilled({
							name: "items"
						}),
						actions: function (oTable) {
							oTable.getItems()[i].setSelected(true);
							oTable.fireSelectionChange();
						},
						errorMessage: "Cannot navigate to Object Page"
					});
				},
				
				iChangeUOM: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--com.sap.vocabularies.UI.v1.FieldGroup::LayoutTRQ::referenceQuantity::Field-sfEdit-input",
						actions: function (oButton) {
							oButton.fireChange({value: ""});
							oButton.fireChange({value: "fg"});
						},
						errorMessage: "Cannot find Button"
					});
				},

				iClickMoveDirectUp: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--idDirectUp",
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},
				iClickMoveDirectDown: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--idDirectDown",
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},
				iClickMoveDown: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--idDown",
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},
				iClickMoveUp: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--idUp",
						actions: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "Cannot find Button"
					});
				},
				iClickonMessageManage: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--showMessages",
						actions: function (oControl) {
							oControl.firePress();
						},
						errorMessage: "The button could not be found"
					});
				},

			},
			assertions: {
				iSeeValueStateOfDescription: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::Field",
						matchers: new PropertyStrictEquals({
							name: "Value",
							value: ""
						}),
						success: function () {
							ok(true, "Layout Name of new Layout is empty");
						},
						errorMessage: "Layout Name  validations are incorrect"
					});
				},

				iCheckVisibilityofSave: function (txt) {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--activate",
						success: function (oControl) {
							var a = oControl.getEnabled().toString();
							equal(a, txt, "SAve button is enabled " + a);
						},
						errorMessage: "Save is enabled"
					});
				},

				iSeeEditButton: function () {
					return this.waitFor({
						id: "manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--edit",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: "Edit"
						}),
						success: function () {
							ok(true, "I see edit button");
						},
						errorMessage: "Unable to see edit button."
					});
				}
			}
		}
	});
});