sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/ui/test/actions/Press",
		"sap/ui/test/matchers/PropertyStrictEquals"
	], function(Opa5, Press, PropertyStrictEquals) {
		"use strict";

		Opa5.createPageObjects({
			onTheObjectPage: {
				actions: {
					iGiveEmptyEvaluationName: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Title::Field",
							matchers: new PropertyStrictEquals({
								name: "value",
								value: "evaluationName 2"
							}),
							actions: function (oControl) {
								oControl.fireChange();
								oControl.setValue("");
								oControl.fireChange();
							},
							errorMessage: "Cannot find Field"
						});
					},
					iClickonSellingMarket1: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::market::sellingMarket::MultiInput",
							actions: function (oControl) {
								oControl.fireTokenUpdate();
								oControl.getContent().getAggregation("tokenizer").removeToken(1);
								oControl.fireTokenUpdate();
							},
							errorMessage: "Cannot find Field"
						});
					},
					iClickonSellingMarket2: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::market::sellingMarket::MultiInput",
							actions: function (oControl) {
								oControl.fireTokenUpdate();
								oControl.getContent().getAggregation("tokenizer").removeToken(0);
								oControl.fireTokenUpdate();
							},
							errorMessage: "Cannot find Field"
						});
					},
					iClickSetInProgressBtn: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::",
							actions: new Press(),
							errorMessage: "The button could not be found"
						});
					},
					iClickOK: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Yes"
							}),
							actions: function(oButton){
								oButton.firePress();
							},
							errorMessage: "Cannot find Button"
						});
					},
					iClickAddRecipe: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--ActionEvaluationSections1button",
							actions: function(oControl){
								oControl.firePress();	
							},
							errorMessage: "The button could not be found"
						});
					},
					iClickTheButtonWithId: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Go"
							}),
							actions: function(oControl){
								oControl.firePress();	
							},
							errorMessage: "The search could not be executed"
						});
					},
					iClickValueHelpButton: function(txt){
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: txt
							}),
							actions: function(oControl){
								oControl.firePress();	
							},
							errorMessage: "The search could not be executed"
						});
					},
					iClickDelete: function(){
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--delete",
							actions: new Press(),
							errorMessage: "The button could not be found"
						});
					},
					iSearchRecipe: function(txt) {
						return this.waitFor({
							controlType: "sap.m.SearchField",
							actions: function(oControl){
								oControl.setValue(txt);
							},
							errorMessage: "The search could not be executed"
						});
					},
					iClickonEvaluationFacet: function(){
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--objectPage-anchBar-ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--IDEvaluation::Section-anchor",
							actions: function(oControl){
								oControl.fireDefaultAction();
							},
							errorMessage: "The button could not be found"
						});
					},
					iClickPurposeRecipe: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--ActionEvaluationSections4button",
							actions: function(oControl){
								oControl.firePress();	
							},
							errorMessage: "The button could not be found"
						});
					},
					iSelectaRecipe: function(){
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							actions: function(oTable){
								oTable.setSelectedIndex(0);	
							},
							errorMessage: "The button could not be found"
						});
					},
					iClickButton: function(){
						return this.waitFor({
							controlType: "sap.m.Button",
							actions: function(oControl){
								oControl.firePress();	
							},
							errorMessage: "The button could not be found"
						});
					}
				},
				assertions: {
					thePageShouldContainTheCorrectTitle: function(txt) {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--template::ObjectPage::ObjectPageDynamicHeaderTitle",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: txt
							}),
							success: function(oControl) {
								ok(true, "The Object Page Title is correct");
							},
							errorMessage: "The Object Page Title is not rendered correctly"
						});
					},
					iCheckSellingMarket: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::market::sellingMarket::MultiInput",
							matchers: new PropertyStrictEquals({
								name: "valueState",
								value: "Error"
							}),
							success: function(oControl) {
								ok(true, "The Object Page Title is correct");
							},
							errorMessage: "Cannot find Field"
						});
					},
					iSeePopUp: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Yes"
							}),
							success: function(oControl) {
								ok(true, "The Pop up is displayed");
							},
							errorMessage: "Cannot find Button"
						});
					},
					iSeeStatusChanged: function() {
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::status::evalStatus::Value-objStatus",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "New"
							}),
							success: function(oControl) {
								ok(true, "The Pop up is displayed");
							},
							errorMessage: "Cannot find Button"
						});
					},
					theDialogShouldContainText: function (txt) {
						return this.waitFor({
							controlType: "sap.m.Text",
							success: function (oControl) {
								var expectedText = "Do you want to delete the object evaluationName 5 ?";
								equal(expectedText, txt, "Text is displayed correctly");
								QUnit.ok(true, "The ListReport page has loaded with a title.");
							},
							errorMessage: "Can't see the ListReport page title."
						});
					},
					iSeeRecipeHeader: function(){
						return this.waitFor({
							id: "ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--ActionEvaluationSections1button",
							// controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "icon",
								value: "sap-icon://add"
							}),
							success: function(oControl) {
								ok(true, "The Object Page Title is correct");
							},
							errorMessage: "The Object Page Title is not rendered correctly"
						});
					}
				}
			}
		});
	}
);