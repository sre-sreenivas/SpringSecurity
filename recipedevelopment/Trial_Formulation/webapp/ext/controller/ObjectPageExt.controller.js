sap.ui.controller("Trial_Formulation.trial_formulation.ext.controller.ObjectPageExt", {
	
	//Triggered when the page is loadedfirst time
	onInit: function () {
		var that = this;
		this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("Recipe").attachMatched(that._onRouteMatched, that);
		that._onRouteMatched();

		this.bUpdate = true;
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		var sHash = oHashChanger.getHash();
		this.recipeID = sHash.split("'")[1];
		var urlParts = sHash.split("&");
		if (urlParts[2]) {
			var sCreate = urlParts[2].split("=")[1];
			if (sCreate === "create") {
				this.Evaluation_ID = urlParts[0].split("=")[1];
				this.Evaluation_Name = urlParts[1].split("=")[1];
				this.Evaluation_Desc = this.Evaluation_ID + "(" + this.Evaluation_Name + ")";
			}
		}
		sap.ui.getCore().getMessageManager().removeAllMessages();
		sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").addDelegate({
			onAfterRendering: function () {
				this.oDateFrom = sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_FROM::Field-datePicker"
				);

				this.oDateTo = sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_TO::Field-datePicker"
				);

				if (this.oDateFrom) {
					this.oDateFrom.attachChange(that._validateDateFrom, that);
				}

				if (this.oDateTo) {
					this.oDateTo.attachChange(that._validateDateFrom, that);
					var dMinDate = new Date();
					this.oDateTo.setMinDate(dMinDate);
				}

				var oView = that.getView();
				var oMessageManager = sap.ui.getCore().getMessageManager();
				oView.setModel(oMessageManager.getMessageModel(), "message");
				oMessageManager.registerObject(oView, true);
				var oMsgBtn = sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--showMessages");
				oMsgBtn.mEventRegistry.press.pop();
				oMsgBtn.attachPress(that.handleMessagePopoverPress, that);

				if (sap.ui.getCore().getMessageManager().getMessageModel().getData().length > 0) {
					oMsgBtn.setVisible(true);
					oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
				}
			}
		});

		sap.ui.getCore().byId("Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--objectPage")
			.setUseIconTabBar(
				true);
	},
	
	//Save and Edit button event are attached here. The event handler will be called whenever user navigates to object page from list report.
	//Visibility of the UI elements is controlled based on Edit and display mode.
	_onRouteMatched: function () {
		var that = this;
		sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(false);
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		var sHash = oHashChanger.getHash();
		this.recipeID = sHash.split("'")[1];
		this.bUpdate = true;

		this.headerInfo = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Form"
		);

		this.descriptionFieldEdit = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::descriptionField::recipeDESCRIPTION::Field"
		);
		this.descriptionFieldEdit.setMaxLength(120);
		this.descriptionFieldEdit.attachChange(this._validateDescriptionField, this);

		this.descriptionFieldDisplay = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::descriptionField::Form"
		);

		this.editButton = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit");
		if (this.editButton) {
			this.editButton.attachPress(function () {
				that.validatingOnEdit();
			});
		}

		this.saveButton = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate");
		if (this.saveButton) {
			this.saveButton.attachPress(function () {
				that.validatingOnDisplay();
				that.onSave();
			});
		}

		var oObjectPageController = this;
		oObjectPageController.extensionAPI.attachPageDataLoaded(function () {
			if (sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate")) {
				if (sap.ui
					.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").getVisible() &&
					sap.ui
					.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").getEnabled()) {

					if (oObjectPageController.Evaluation_ID) {
						var oModel = sap.ui.getCore().byId(
							"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--objectPage").getModel();
						var ctx = sap.ui.getCore().byId(
							"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--objectPage").getBindingContext();
						oModel.setProperty("UseLimitsOfevaluationSheet", oObjectPageController.Evaluation_Desc, ctx);
						oModel.setProperty("evaluationID", oObjectPageController.Evaluation_ID, ctx);
						oModel.setProperty("evaluationName", oObjectPageController.Evaluation_Name, ctx);
					}
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::recipeTYPE::Field"
					).setValue("Development Recipe");

					that.validatingOnEdit();
				}
			}
			if (sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit")) {
				if (sap.ui
					.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit").getVisible() && sap.ui
					.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit").getEnabled()) {
					that.validatingOnDisplay();
				}
			}

			var displayMode = sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit").getVisible();
			if (displayMode) {
				sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--action::quickView"
				).setVisible(true);
			} else {
				sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--action::quickView"
				).setVisible(false);
			}

			sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--action::quickView"
			).setIcon("sap-icon://message-information");
			sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--action::quickView"
			).setType("Transparent");
		});
	},
	
	//The event handler will be triggered whenever the Edit button is pressed.Here we are managing the visibility of recipe ID and calling the function to validate the description field.
	validatingOnEdit: function () {
		var that = this;
		this.oDateFrom = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_FROM::Field-datePicker"
		);

		this.oDateTo = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_TO::Field-datePicker"
		);

		if (this.oDateFrom) {
			this.oDateFrom.setValueState(sap.ui.core.ValueState.None);
		}
		if (this.oDateTo) {
			this.oDateTo.setValueState(sap.ui.core.ValueState.None);
		}

		//Making Header Info invisible
		var recipeForm = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Form"
		);
		if (recipeForm && recipeForm.getParent() !== null) {
			recipeForm.getParent().removeContent(0);
		}

		//Validating Description Field
		if (that.descriptionFieldEdit) {
			if (this.descriptionFieldEdit._oControl.edit) {
				this.descriptionFieldEdit._oControl.edit.setValueState("None");
			}
			that._validateDescriptionField();
		}
	},
	
	//The event handler will be triggered whenever the Save button is pressed. Here we are managing the visibility of description field. Also, the Recipe Type is manipulated to remove additional text.
	validatingOnDisplay: function () {
		var that = this;
		this.saveDisabledDate = false;
		this.saveDisabledDesc = false;

		//Destroying the Description Field
		if (that.descriptionFieldDisplay) {
			that.descriptionFieldDisplay.destroy(true);
		}
		this.recipeType = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::recipeTYPE::Field-comboBoxDisp"
		);
		if (this.recipeType) {
			if (that.recipeType.getValue() !== "") {
				that.recipeType.setValue(that.recipeType.getValue().split("(")[0]);
			}
		}
	},
	
	//The event handler will be triggered whenever the Description field value is changed. If the field is empty or if the description is more than 120 characters, it changes the value state of Error and the Save button is made disabled. This function is also triggered on the initial load.
	_validateDescriptionField: function () {
		var that = this;
		var descriptionValue = this.descriptionFieldEdit.getValue();
		if (descriptionValue === "" || this.descriptionFieldEdit.getValue() === null) {
			this.saveDisabledDesc = true;
			this.descriptionFieldEdit.setValueState("Error");
			this.descriptionFieldEdit.setValueStateText(that._oResourceBundle.getText("emptyDesc"));
			sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(true);
			this.updateMessageManager("Error", this._oResourceBundle
				.getText("emptyDesc"), "");
		} else if (this.descriptionFieldEdit.getValue().length > 120) {
			this.saveDisabledDesc = true;
			this.descriptionFieldEdit.setValueState("Error");
			this.descriptionFieldEdit.setValueStateText(that._oResourceBundle.getText("greaterThanCharacters"));
			sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(true);
			this.updateMessageManager("Error", this._oResourceBundle
				.getText("emptyDesc"), "");
		} else {
			this.saveDisabledDesc = false;
			this.descriptionFieldEdit.setValueState("None");
			this.removeMessageFromTarget(this._oResourceBundle.getText(
				"emptyDesc"));
			if (this.saveDisabledDate === false || this.saveDisabledDate === undefined) {
				var bError = this.checkForerrors();
				if (!bError || sap.ui.getCore().getMessageManager().getMessageModel().getData().length === 0) {
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(false);
				}
			}
		}
	},
	
	//The event handler will be triggered whenever the Valid from or To Fields are changed. If Valid From Date field value is lesser than the Valid To Date Field, it changes the value state of Error and the Save button is made disabled.
	_validateDateFrom: function (oEvent) {
		var oValFrom = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_FROM::Field-datePicker"
		);
		var dValueFrom = oValFrom.getDateValue();
		var oValTo = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::VALID_TO::Field-datePicker"
		);
		var sValueTo = oValTo.getValue();
		var dValueTo = new Date(sValueTo);
		if (sValueTo && (dValueFrom > dValueTo)) {
			this.saveDisabledDate = true;
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValueStateText(this._oResourceBundle.getText("validFromMsg"));
			sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(true);
			this.updateMessageManager("Error", this._oResourceBundle
				.getText("validFromMsg"), "");
		} else {
			this.saveDisabledDate = false;
			oValFrom.setValueState(sap.ui.core.ValueState.None);
			oValTo.setValueState(sap.ui.core.ValueState.None);
			this.removeMessageFromTarget(this._oResourceBundle.getText(
				"validFromMsg"));
			if (this.saveDisabledDesc === false || this.saveDisabledDesc === undefined) {
				var bError = this.checkForerrors();
				if (!bError) {
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(false);
				}
			}
		}
	},

	//Triggers when Message manager is clicked.
	handleMessagePopoverPress: function (oEvent) {
		this._getMessagePopover().openBy(oEvent.getSource());
	},
	
	//Message manager popover is added to the view.
	_getMessagePopover: function () {
		if (!this._oMessagePopover) {
			this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
				"Trial_Formulation.trial_formulation.ext.fragment.MessagePopOver", this);
			this.getView().addDependent(this._oMessagePopover);
		}
		return this._oMessagePopover;
	},
	
	//Errors are added to the message manager and the visibility of the message manager is manipulated here
	updateMessageManager: function (sType, sMsg, sDesc) {
		this.removeMessageFromTarget(sMsg);
		var oMessage = new sap.ui.core.message.Message({
			message: sMsg,
			type: sType
		});
		sap.ui.getCore().getMessageManager().addMessages(oMessage);
		var oMsgBtn = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--showMessages");
		oMsgBtn.setVisible(true);
		oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
	},
	
	//Rectified errors are removed from the message manager model
	removeMessageFromTarget: function (sMessage) {
		sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
			if (oMessage.message === sMessage) {
				sap.ui.getCore().getMessageManager().removeMessages(oMessage);
				var oMsgBtn = sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--showMessages");
				if (oMsgBtn)
					oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
			}
		}.bind(this));
	},
	
	//Check if messages in the message manager are of type error. If yes, it returns ERROR, else, true is returned.
	checkForerrors: function () {
		var sError = "";
		sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
			if (oMessage.type === "Error") {
				sError = true;
			}
		});
		return sError;
	},
	
	//This is triggered when the quick info button is clicked. It contains the administrative information of the recipe.
	openQuickView: function (oEvent, oModel) {
		var oButton = oEvent.getSource();
		if (!this._oQuickView) {
			sap.ui.core.Fragment.load({
				name: "Trial_Formulation.trial_formulation.ext.fragment.AdditionalInfo",
				controller: this
			}).then(function (oQuickView) {
				this._oQuickView = oQuickView;
				this._configQuickView(oModel);
				this._oQuickView.openBy(oButton);
			}.bind(this));
		} else {
			this._configQuickView(oModel);
			this._oQuickView.openBy(oButton);
		}
	},

	//Closes the quick info fragment
	_configQuickView: function (oModel) {
		this.getView().addDependent(this._oQuickView);
		this._oQuickView.close();
	},
	
	//When the object page is exited, the header form and quick view is destroyed to avoid duplicate IDs.
	onExit: function () {
		this.headerInfo.destroy();
		if (this._oQuickView) {
			this._oQuickView.destroy();
		}
	},
	
	//When the user has navigated from Compliance Evaluator application to Formula Optimizer application and Clicks on Save, this function gets Triggered. The recipe gets added to the compliance evaluator’s list of recipes, if this is a new recipe. Also, the app navigates back to Compliance Evaluator once the changes are saved.
	onSave: function () {
		if (this.bUpdate) {
			this.bUpdate = false;
			if (this.Evaluation_ID) {
				var oCompModel = this.getOwnerComponent().getModel("complianceModel");
				oCompModel.callFunction("/saveRecipe", {
					method: "GET",
					urlParameters: {
						evaluationID: this.Evaluation_ID,
						recipeId: this.recipeID,
						recipeDescription: this.descriptionFieldEdit.getValue(),
						recipeType: "Development Recipe",
						recipeStatus: "New"
					},
			success:function(odata, resp){ 
					var oCrossApp = new sap.ushell.services.CrossApplicationNavigation();

					setTimeout(function () {
                        oCrossApp.historyBack();
                    }, 1000);

				},
				error: function(odata, resp) {}
			});
		
		
			}
		}
	}
});
